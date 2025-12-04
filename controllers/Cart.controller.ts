import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { CartService } from "../services/Cart.service";

export class CartController {
  constructor(private cartService: CartService) {}

  getCart = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const cart = await this.cartService.getCart(userId);
      return res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  };

  addItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { product_id, quantity } = req.body;

      const item = await this.cartService.addItem(userId, product_id, quantity);
      return res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

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
        quantity
      );
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

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
