import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

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

    return prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: true,
      },
    });
  }

  async addItem(userId: number, productId: number, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new AppError("Product not found", 404);

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        priceSnapshot: product.price,
      },
    });
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw new AppError("Cart item not found", 404);

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return { message: "Item removed" };
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw new AppError("Cart item not found", 404);

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return true;
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return true;
  }
}
