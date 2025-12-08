import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

export class ProductsService {
  async getProducts(params: {
    page: number;
    limit: number;
    brandId?: number;
    categoryId?: number;
  }) {
    const { page, limit, brandId, categoryId } = params;

    const where: any = {};
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;

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
          price: true,
          brandId: true,
          categoryId: true,
        },
      }),

      prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    brandId: number;
    categoryId: number;
  }) {
    // Brand check
    const brand = await prisma.brand.findUnique({
      where: { id: data.brandId },
    });
    if (!brand) throw new AppError("Invalid brandId", 400);

    // Category check
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new AppError("Invalid categoryId", 400);

    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        brandId: data.brandId,
        categoryId: data.categoryId,
      },
    });
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      brandId?: number;
      categoryId?: number;
    }
  ) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new AppError("Product not found", 404);

    if (data.brandId) {
      const brand = await prisma.brand.findUnique({
        where: { id: data.brandId },
      });
      if (!brand) throw new AppError("Invalid brandId", 400);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw new AppError("Invalid categoryId", 400);
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) throw new AppError("Product not found", 404);

    await prisma.product.delete({ where: { id } });

    return true;
  }
}
