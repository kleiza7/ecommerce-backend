import { prisma } from "../config/prisma";
import { PRODUCT_STATUS } from "../enums/ProductStatus.enum";
import { AppError } from "../errors/AppError";

export class ProductReviewsService {
  async getReviewsByProductId(productId: number) {
    return prisma.productReview.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createReview({
    productId,
    userId,
    rating,
    comment,
  }: {
    productId: number;
    userId: number;
    rating: number;
    comment?: string;
  }) {
    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.status === PRODUCT_STATUS.DELETED) {
      throw new AppError("Cannot review a deleted product", 400);
    }

    try {
      return await prisma.productReview.create({
        data: {
          productId,
          userId,
          rating,
          comment: comment ?? null,
        },
      });
    } catch {
      throw new AppError("You have already reviewed this product", 400);
    }
  }

  async updateReview({
    productId,
    userId,
    rating,
    comment,
  }: {
    productId: number;
    userId: number;
    rating: number;
    comment?: string;
  }) {
    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.status === PRODUCT_STATUS.DELETED) {
      throw new AppError("Cannot update review for a deleted product", 400);
    }

    const review = await prisma.productReview.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: { id: true },
    });

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    return prisma.productReview.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        rating,
        comment: comment ?? null,
      },
    });
  }

  async deleteReview({
    reviewId,
    userId,
  }: {
    reviewId: number;
    userId: number;
  }) {
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.userId !== userId) {
      throw new AppError("You can only delete your own review", 403);
    }

    await prisma.productReview.delete({
      where: { id: reviewId },
    });

    return true;
  }

  async getReviewStatsByProductIds(productIds: number[]) {
    if (!productIds.length) {
      return {};
    }

    const stats = await prisma.productReview.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds } },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return stats.reduce<
      Record<number, { avgRating: number; reviewCount: number }>
    >((acc, stat) => {
      acc[stat.productId] = {
        avgRating: stat._avg.rating ?? 0,
        reviewCount: stat._count._all,
      };
      return acc;
    }, {});
  }
}
