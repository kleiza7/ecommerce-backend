import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { CartService } from "../services/Cart.service";

export class CartController {
  constructor(private cartService: CartService) {}

  /**
   * GET CART
   */
  getCart = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;

      const cartItems = await this.cartService.getCart(userId);

      return res.status(200).json({
        items: cartItems,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ADD ITEM
   */
  addItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { productId, quantity } = req.body;

      const item = await this.cartService.addItem(
        userId,
        Number(productId),
        Number(quantity)
      );

      return res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

  /**
   * UPDATE ITEM QUANTITY
   */
  updateQuantity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const itemId = Number(req.params.itemId);
      const { quantity } = req.body;

      const updated = await this.cartService.updateQuantity(
        userId,
        itemId,
        Number(quantity)
      );

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  /**
   * MERGE GUEST CART (LOGIN SONRASI)
   */
  mergeGuestCart = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { items } = req.body as {
        items: { productId: number; quantity: number }[];
      };

      const mergedCart = await this.cartService.mergeGuestCart(userId, items);

      return res.status(200).json({
        items: mergedCart,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * REMOVE ITEM
   */
  removeItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const itemId = Number(req.params.itemId);

      await this.cartService.removeItem(userId, itemId);

      return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * CLEAR CART
   */
  clearCart = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;

      await this.cartService.clearCart(userId);

      return res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      next(error);
    }
  };
}
