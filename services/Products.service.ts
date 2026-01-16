import { prisma } from "../config/prisma";
import { PRODUCT_STATUS } from "../enums/ProductStatus.enum";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";
import {
  deleteProductImages,
  processProductImages,
} from "../utils/ProductImage.util";

export class ProductsService {
  /* ===========================
     GET LIST (INTERNAL)
  =========================== */

  private async getProductsBaseQuery(params: {
    brandIds: number[];
    categoryIds: number[];
    sellerIds: number[];
    statuses?: PRODUCT_STATUS[];
    query?: string;
    skip?: number;
    take?: number;
  }) {
    const { brandIds, categoryIds, sellerIds, statuses, query, skip, take } =
      params;

    const where: {
      brandId?: { in: number[] };
      categoryId?: { in: number[] };
      sellerId?: { in: number[] };
      status?: { in: PRODUCT_STATUS[] };
      OR?: {
        name?: { contains: string };
        description?: { contains: string };
      }[];
    } = {};

    if (brandIds.length) where.brandId = { in: brandIds };
    if (categoryIds.length) where.categoryId = { in: categoryIds };
    if (sellerIds.length) where.sellerId = { in: sellerIds };
    if (statuses && statuses.length) where.status = { in: statuses };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          stockCount: true,
          price: true,
          status: true,
          brand: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          currency: { select: { id: true, code: true, symbol: true } },
          seller: { select: { id: true, name: true } },
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

    const mappedItems = items.map((product) => ({
      ...product,
      images: product.images.map((img) => ({
        ...img,
        mediumUrl: getUrlWithBaseUrl(img.mediumUrl),
      })),
    }));

    return { items: mappedItems, total };
  }

  /* ===========================
     GET LIST WITH PAGINATION
  =========================== */

  async getProductsListWithPagination(params: {
    pagination: {
      page: number;
      limit: number;
    };
    brandIds: number[];
    categoryIds: number[];
    sellerIds: number[];
    statuses?: PRODUCT_STATUS[];
    query?: string;
  }) {
    const { pagination, brandIds, categoryIds, sellerIds, statuses, query } =
      params;

    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const { items, total } = await this.getProductsBaseQuery({
      brandIds,
      categoryIds,
      sellerIds,
      statuses,
      query,
      skip,
      take,
    });

    return {
      items,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  /* ===========================
     GET LIST WITHOUT PAGINATION
  =========================== */

  async getProductsListWithoutPagination(params: {
    brandIds: number[];
    categoryIds: number[];
    sellerIds: number[];
    statuses?: PRODUCT_STATUS[];
    query?: string;
  }) {
    const { brandIds, categoryIds, sellerIds, statuses, query } = params;

    const { items } = await this.getProductsBaseQuery({
      brandIds,
      categoryIds,
      sellerIds,
      statuses,
      query,
    });

    return items;
  }

  /* ===========================
     GET BY ID
  =========================== */

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        stockCount: true,
        price: true,
        status: true,
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        currency: { select: { id: true, code: true, symbol: true } },
        seller: { select: { id: true, name: true } },
        images: { orderBy: { isPrimary: "desc" } },
      },
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
     ADMIN - CHANGE PRODUCT STATUS
  =========================== */

  async changeProductStatus(params: {
    productId: number;
    status: PRODUCT_STATUS;
  }) {
    const { productId, status } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new AppError("Product not found", 404);

    if (product.status === PRODUCT_STATUS.DELETED) {
      throw new AppError("Deleted product status cannot be changed", 400);
    }

    await prisma.product.update({
      where: { id: productId },
      data: { status },
    });

    return true;
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
      sellerId: number;
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

    const product = await prisma.product.create({
      data: {
        ...data,
        status: PRODUCT_STATUS.WAITING_FOR_APPROVE,
      },
    });

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
      sellerId: number;
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
      sellerId,
      deletedImageIds,
    } = payload;

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!product) throw new AppError("Product not found", 404);
      if (product.sellerId !== sellerId) throw new AppError("Forbidden", 403);
      if (product.status === PRODUCT_STATUS.DELETED) {
        throw new AppError("Deleted product cannot be updated", 400);
      }

      if (!(await tx.brand.findUnique({ where: { id: brandId } }))) {
        throw new AppError("Invalid brandId", 400);
      }

      if (!(await tx.category.findUnique({ where: { id: categoryId } }))) {
        throw new AppError("Invalid categoryId", 400);
      }

      if (!(await tx.currency.findUnique({ where: { id: currencyId } }))) {
        throw new AppError("Invalid currencyId", 400);
      }

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

      if (newAddedImages.length) {
        await processProductImages(id, newAddedImages);
      }

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
          status: PRODUCT_STATUS.WAITING_FOR_APPROVE,
        },
      });

      return this.getProductById(id);
    });
  }

  /* ===========================
     DELETE (SOFT)
  =========================== */

  async deleteProduct(id: number, sellerId: number) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) throw new AppError("Product not found", 404);
    if (product.sellerId !== sellerId) throw new AppError("Forbidden", 403);

    await prisma.product.update({
      where: { id },
      data: { status: PRODUCT_STATUS.DELETED },
    });

    return true;
  }

  /* ===========================
     SEARCH (TEXT ONLY)
  =========================== */

  async searchNamesByText(query: string, limit = 10): Promise<string[]> {
    const rows = await prisma.product.findMany({
      where: {
        status: PRODUCT_STATUS.APPROVED,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      select: { name: true },
      take: limit,
    });

    return rows.map((row) => row.name);
  }
}
