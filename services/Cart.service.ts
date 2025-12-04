import { AppError } from "../errors/AppError";
import { Cart } from "../models/Cart.model";
import { CartItem } from "../models/CartItem.model";
import { Product } from "../models/Product.model";

export class CartService {
  private async getOrCreateCart(userId: number) {
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    return CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product }],
    });
  }

  async addItem(userId: number, productId: number, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    let item = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
      return item;
    }

    return CartItem.create({
      cart_id: cart.id,
      product_id: productId,
      quantity,
      price_snapshot: product.price,
    });
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    if (quantity <= 0) {
      await item.destroy();
      return { message: "Item removed" };
    }

    item.quantity = quantity;
    await item.save();
    return item;
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);

    const deleted = await CartItem.destroy({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!deleted) {
      throw new AppError("Cart item not found", 404);
    }

    return true;
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    await CartItem.destroy({
      where: { cart_id: cart.id },
    });

    return true;
  }
}
