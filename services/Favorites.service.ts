import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";

export class FavoritesService {
  async getFavoritesListByUser(userId: number) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      select: {
        id: true,
        productId: true,
        product: {
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
        },
      },
    });

    return favorites.map((favorite) => ({
      ...favorite,
      product: {
        ...favorite.product,
        images: favorite.product.images.map((image) => ({
          ...image,
          mediumUrl: getUrlWithBaseUrl(image.mediumUrl),
        })),
      },
    }));
  }

  async toggleFavorite(params: { userId: number; productId: number }) {
    const { userId, productId } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });

      return { isFavorited: false };
    }

    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });

    return { isFavorited: true };
  }

  async mergeGuestFavorites(userId: number, productIds: number[]) {
    if (!productIds.length) {
      return this.getFavoritesListByUser(userId);
    }

    await prisma.$transaction(async (tx) => {
      const existingFavorites = await tx.favorite.findMany({
        where: {
          userId,
          productId: { in: productIds },
        },
        select: { productId: true },
      });

      const existingFavoritesSet = new Set(
        existingFavorites.map((favorite) => favorite.productId),
      );

      const toCreate = productIds.filter(
        (productId) => !existingFavoritesSet.has(productId),
      );

      if (toCreate.length > 0) {
        await tx.favorite.createMany({
          data: toCreate.map((productId) => ({
            userId,
            productId,
          })),
        });
      }
    });

    return this.getFavoritesListByUser(userId);
  }
}
