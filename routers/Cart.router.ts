import { Router } from "express";
import { CartController } from "../controllers/Cart.controller";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  addToCartSchema,
  removeItemSchema,
  updateCartQuantitySchema,
} from "../schemas/cart.schema";

export class CartRouter {
  constructor(private router: Router, private controller: CartController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET CART
    this.router.get("/", verifyToken, this.controller.getCart);

    // ADD ITEM
    this.router.post(
      "/add",
      verifyToken,
      validate(addToCartSchema),
      this.controller.addItem
    );

    // UPDATE QUANTITY
    this.router.put(
      "/update/:itemId",
      verifyToken,
      validate(updateCartQuantitySchema),
      this.controller.updateQuantity
    );

    // REMOVE ITEM
    this.router.delete(
      "/remove/:itemId",
      verifyToken,
      validate(removeItemSchema),
      this.controller.removeItem
    );

    // CLEAR CART
    this.router.delete("/clear", verifyToken, this.controller.clearCart);
  }

  public getRouter() {
    return this.router;
  }
}
