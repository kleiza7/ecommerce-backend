import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";

export class CartService {
  private async getOrCreateCart(userId: number) {
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    return cart;
  }

  /**
   * GET CART
   */
  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
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

  /**
   * ADD ITEM
   */
  async addItem(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const existingItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      select: { currencyId: true },
    });

    if (existingItems.length > 0) {
      const cartCurrencyId = existingItems[0].currencyId;

      if (cartCurrencyId !== product.currencyId) {
        throw new AppError("Mixed currency carts are not allowed", 400);
      }
    }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let itemId: number;

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
        },
      });

      itemId = updated.id;
    } else {
      const created = await prisma.cartItem.create({
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

    const item = await prisma.cartItem.findUniqueOrThrow({
      where: { id: itemId },
      include: {
        product: {
          include: {
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
  }

  /**
   * UPDATE QUANTITY
   */
  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const existing = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!existing) {
      throw new AppError("Cart item not found", 404);
    }

    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than zero", 400);
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
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
  }

  /**
   * MERGE GUEST CART
   */
  async mergeGuestCart(
    userId: number,
    guestItems: { productId: number; quantity: number }[]
  ) {
    for (const item of guestItems) {
      await this.addItem(userId, item.productId, item.quantity);
    }

    return this.getCart(userId);
  }

  /**
   * REMOVE ITEM
   */
  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return true;
  }

  /**
   * CLEAR CART
   */
  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return true;
  }
}
