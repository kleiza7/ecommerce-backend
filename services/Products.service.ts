import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";

const UPLOAD_ROOT = path.join(__dirname, "..", "uploads", "products");

export class ProductsService {
  private foldersEnsured = false;

  private async ensureFolders() {
    if (this.foldersEnsured) return;

    const folders = ["original", "thumb", "medium", "large"];
    for (const f of folders) {
      await fs.mkdir(path.join(UPLOAD_ROOT, f), { recursive: true });
    }

    this.foldersEnsured = true;
  }

  private generateFilename(ext: string) {
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  }

  private pathFromUrl(url: string) {
    return path.join(__dirname, "..", url);
  }

  private async ensurePrimaryImage(productId: number) {
    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { id: "asc" },
    });

    if (images.length === 0) return;
    if (images.some((i) => i.isPrimary)) return;

    await prisma.productImage.update({
      where: { id: images[0].id },
      data: { isPrimary: true },
    });
  }

  private async processImages(productId: number, files: Express.Multer.File[]) {
    if (!files || files.length === 0) return [];

    await this.ensureFolders();

    const created: any[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = this.generateFilename(ext);

      const originalPath = path.join(UPLOAD_ROOT, "original", filename);
      const thumbPath = path.join(UPLOAD_ROOT, "thumb", filename);
      const mediumPath = path.join(UPLOAD_ROOT, "medium", filename);
      const largePath = path.join(UPLOAD_ROOT, "large", filename);

      await fs.rename(file.path, originalPath);
      await sharp(originalPath).resize({ width: 200 }).toFile(thumbPath);
      await sharp(originalPath).resize({ width: 600 }).toFile(mediumPath);
      await sharp(originalPath).resize({ width: 1200 }).toFile(largePath);

      const img = await prisma.productImage.create({
        data: {
          productId,
          originalUrl: `/uploads/products/original/${filename}`,
          thumbUrl: `/uploads/products/thumb/${filename}`,
          mediumUrl: `/uploads/products/medium/${filename}`,
          largeUrl: `/uploads/products/large/${filename}`,
          isPrimary: false,
        },
      });

      created.push(img);
    }

    await this.ensurePrimaryImage(productId);
    return created;
  }

  private async deleteImageFiles(image: any) {
    const urls = [
      image.originalUrl,
      image.thumbUrl,
      image.mediumUrl,
      image.largeUrl,
    ];

    for (const url of urls) {
      const abs = this.pathFromUrl(url);
      try {
        await fs.unlink(abs);
      } catch {}
    }
  }

  async getProducts(params: {
    page: number;
    limit: number;
    brandIds: number[];
    categoryIds: number[];
  }) {
    const { page, limit, brandIds, categoryIds } = params;

    const where: any = {};

    if (brandIds.length > 0) {
      where.brandId = { in: brandIds };
    }

    if (categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          stockCount: true,
          price: true,
          brandId: true,
          categoryId: true,
          images: {
            select: {
              id: true,
              thumbUrl: true,
              isPrimary: true,
            },
            orderBy: { isPrimary: "desc" },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const itemsWithAbsolute = items.map((product) => ({
      ...product,
      images: product.images.map((img) => ({
        ...img,
        thumbUrl: getUrlWithBaseUrl(img.thumbUrl),
      })),
    }));

    return {
      items: itemsWithAbsolute,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { isPrimary: "desc" } } },
    });

    if (!product) throw new AppError("Product not found", 404);

    return {
      ...product,
      images: product.images.map((img) => ({
        ...img,
        originalUrl: getUrlWithBaseUrl(img.originalUrl),
        thumbUrl: getUrlWithBaseUrl(img.thumbUrl),
        mediumUrl: getUrlWithBaseUrl(img.mediumUrl),
        largeUrl: getUrlWithBaseUrl(img.largeUrl),
      })),
    };
  }

  async createProduct(
    data: {
      name: string;
      description: string;
      stockCount: number;
      price: number;
      brandId: number;
      categoryId: number;
    },
    files: Express.Multer.File[]
  ) {
    if (!files?.length) throw new AppError("At least 1 image is required", 400);

    if (!(await prisma.brand.findUnique({ where: { id: data.brandId } })))
      throw new AppError("Invalid brandId", 400);

    if (!(await prisma.category.findUnique({ where: { id: data.categoryId } })))
      throw new AppError("Invalid categoryId", 400);

    const product = await prisma.product.create({ data });

    await this.processImages(product.id, files);

    return this.getProductById(product.id);
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      stockCount?: number;
      price?: number;
      brandId?: number;
      categoryId?: number;
      deletedImageIds?: number[];
    },
    newAddedImages: Express.Multer.File[]
  ) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError("Product not found", 404);

    if (data.deletedImageIds?.length) {
      const imgs = await prisma.productImage.findMany({
        where: { id: { in: data.deletedImageIds }, productId: id },
      });

      for (const img of imgs) await this.deleteImageFiles(img);

      await prisma.productImage.deleteMany({
        where: { id: { in: data.deletedImageIds }, productId: id },
      });
    }

    if (newAddedImages?.length) await this.processImages(id, newAddedImages);

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    await prisma.product.update({
      where: { id },
      data: cleaned,
    });

    return this.getProductById(id);
  }

  async deleteProduct(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) throw new AppError("Product not found", 404);

    for (const img of product.images) await this.deleteImageFiles(img);

    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return true;
  }
}
