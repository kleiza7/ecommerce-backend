import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";
import {
  deleteProductImages,
  processProductImages,
} from "../utils/ProductImage.util";

export class ProductsService {
  /* ===========================
     GET LIST
  =========================== */

  async getProducts(params: {
    page: number;
    limit: number;
    brandIds: number[];
    categoryIds: number[];
  }) {
    const { page, limit, brandIds, categoryIds } = params;

    const where: any = {};
    if (brandIds.length) where.brandId = { in: brandIds };
    if (categoryIds.length) where.categoryId = { in: categoryIds };

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
          currencyId: true, // ✅ SADECE ID
          images: {
            select: {
              id: true,
              mediumUrl: true,
              isPrimary: true,
            },
            orderBy: { isPrimary: "desc" },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: items.map((product) => ({
        ...product,
        images: product.images.map((img) => ({
          ...img,
          mediumUrl: getUrlWithBaseUrl(img.mediumUrl),
        })),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* ===========================
     GET BY ID
  =========================== */

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

  /* ===========================
     CREATE
  =========================== */

  async createProduct(
    data: {
      name: string;
      description: string;
      stockCount: number;
      price: number;
      brandId: number;
      categoryId: number;
      currencyId: number;
    },
    files: Express.Multer.File[]
  ) {
    if (!files?.length) {
      throw new AppError("At least 1 image is required", 400);
    }

    if (!(await prisma.brand.findUnique({ where: { id: data.brandId } }))) {
      throw new AppError("Invalid brandId", 400);
    }

    if (
      !(await prisma.category.findUnique({ where: { id: data.categoryId } }))
    ) {
      throw new AppError("Invalid categoryId", 400);
    }

    if (
      !(await prisma.currency.findUnique({ where: { id: data.currencyId } }))
    ) {
      throw new AppError("Invalid currencyId", 400);
    }

    const product = await prisma.product.create({ data });

    await processProductImages(product.id, files);

    return this.getProductById(product.id);
  }

  /* ===========================
     UPDATE
  =========================== */

  async updateProduct(
    payload: {
      id: number;
      name: string;
      description: string;
      stockCount: number;
      price: number;
      brandId: number;
      categoryId: number;
      currencyId: number;
      deletedImageIds: number[];
    },
    newAddedImages: Express.Multer.File[]
  ) {
    const {
      id,
      name,
      description,
      stockCount,
      price,
      brandId,
      categoryId,
      currencyId,
      deletedImageIds,
    } = payload;

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (!(await tx.currency.findUnique({ where: { id: currencyId } }))) {
        throw new AppError("Invalid currencyId", 400);
      }

      /* ===========================
         DELETE IMAGES
      ============================ */
      if (deletedImageIds.length) {
        const imagesToDelete = product.images.filter((img) =>
          deletedImageIds.includes(img.id)
        );

        await deleteProductImages(imagesToDelete);

        await tx.productImage.deleteMany({
          where: {
            id: { in: deletedImageIds },
            productId: id,
          },
        });
      }

      /* ===========================
         ADD NEW IMAGES
      ============================ */
      if (newAddedImages.length) {
        await processProductImages(id, newAddedImages);
      }

      /* ===========================
         UPDATE PRODUCT (FULL)
      ============================ */
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          stockCount,
          price,
          brandId,
          categoryId,
          currencyId,
        },
      });

      return this.getProductById(id);
    });
  }

  /* ===========================
     DELETE
  =========================== */

  async deleteProduct(id: number) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      // 🔥 CDN / Local delete
      await deleteProductImages(product.images);

      // 🔥 DB delete
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      await tx.product.delete({
        where: { id },
      });

      return true;
    });
  }
}
