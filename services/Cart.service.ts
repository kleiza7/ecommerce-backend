import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";

export class CartService {
  private async getOrCreateCart(userId: number) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
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
                thumbUrl: true,
                isPrimary: true,
              },
            },
          },
        },
      },
    });

    for (const item of items) {
      for (const img of item.product.images) {
        img.thumbUrl = getUrlWithBaseUrl(img.thumbUrl);
      }
    }

    return items;
  }

  async addItem(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    return prisma.$transaction(async (tx) => {
      const cart = await this.getOrCreateCart(userId);

      const product = await tx.product.findUniqueOrThrow({
        where: { id: productId },
      });

      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      const currentQuantity = existing ? existing.quantity : 0;
      const requestedQuantity = currentQuantity + quantity;

      if (requestedQuantity > product.stockCount) {
        throw new AppError(
          `Only ${product.stockCount} items left in stock`,
          409
        );
      }

      const existingItems = await tx.cartItem.findMany({
        where: { cartId: cart.id },
        select: { currencyId: true },
      });

      if (existingItems.length > 0) {
        const cartCurrencyId = existingItems[0].currencyId;

        if (cartCurrencyId !== product.currencyId) {
          throw new AppError("Mixed currency carts are not allowed", 400);
        }
      }

      let itemId: number;

      if (existing) {
        const updated = await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: requestedQuantity,
          },
        });

        itemId = updated.id;
      } else {
        const created = await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            priceSnapshot: product.price,
            currencyId: product.currencyId,
          },
        });

        itemId = created.id;
      }

      const item = await tx.cartItem.findUniqueOrThrow({
        where: { id: itemId },
        include: {
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
                  thumbUrl: true,
                  isPrimary: true,
                },
              },
            },
          },
        },
      });

      for (const img of item.product.images) {
        img.thumbUrl = getUrlWithBaseUrl(img.thumbUrl);
      }

      return item;
    });
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    if (quantity <= 0) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    return prisma.$transaction(async (tx) => {
      const cart = await this.getOrCreateCart(userId);

      const existing = await tx.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id,
        },
        include: {
          product: true,
        },
      });

      if (!existing) {
        throw new AppError("Cart item not found", 404);
      }

      if (quantity > existing.product.stockCount) {
        throw new AppError(
          `Only ${existing.product.stockCount} items left in stock`,
          409
        );
      }

      const updated = await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
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
                  thumbUrl: true,
                  isPrimary: true,
                },
              },
            },
          },
        },
      });

      for (const img of updated.product.images) {
        img.thumbUrl = getUrlWithBaseUrl(img.thumbUrl);
      }

      return updated;
    });
  }

  async mergeGuestCart(
    userId: number,
    guestItems: { productId: number; quantity: number }[]
  ) {
    return prisma.$transaction(async (tx) => {
      for (const item of guestItems) {
        await this.addItem(userId, item.productId, item.quantity);
      }

      return this.getCart(userId);
    });
  }

  async removeItem(userId: number, itemId: number) {
    return prisma.$transaction(async (tx) => {
      const cart = await this.getOrCreateCart(userId);

      const item = await tx.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id,
        },
      });

      if (!item) {
        throw new AppError("Cart item not found", 404);
      }

      await tx.cartItem.delete({
        where: { id: itemId },
      });

      return true;
    });
  }

  async clearCart(userId: number) {
    return prisma.$transaction(async (tx) => {
      const cart = await this.getOrCreateCart(userId);

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return true;
    });
  }
}
