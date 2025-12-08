import { Router } from "express";
import { CartController } from "../controllers/Cart.controller";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  addToCartSchema,
  removeItemSchema,
  updateCartQuantitySchema,
} from "../schemas/Cart.schema";

export class CartRouter {
  constructor(private router: Router, private controller: CartController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-cart", verifyToken, this.controller.getCart);

    this.router.post(
      "/add",
      verifyToken,
      validate(addToCartSchema),
      this.controller.addItem
    );

    this.router.put(
      "/update/:itemId",
      verifyToken,
      validate(updateCartQuantitySchema),
      this.controller.updateQuantity
    );

    this.router.delete(
      "/remove/:itemId",
      verifyToken,
      validate(removeItemSchema),
      this.controller.removeItem
    );

    this.router.delete("/clear", verifyToken, this.controller.clearCart);
  }

  public getRouter() {
    return this.router;
  }
}
