import { Router } from "express";
import { CartController } from "../controllers/Cart.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  addToCartSchema,
  mergeGuestCartSchema,
  removeItemSchema,
  updateCartQuantitySchema,
} from "../schemas/Cart.schema";

export class CartRouter {
  constructor(
    private router: Router,
    private controller: CartController,
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/get-cart",
      verifyToken,
      checkRole(USER_ROLE.USER),
      this.controller.getCart,
    );

    this.router.post(
      "/add",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(addToCartSchema),
      this.controller.addItem,
    );

    this.router.put(
      "/update",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(updateCartQuantitySchema),
      this.controller.updateQuantity,
    );

    this.router.post(
      "/merge",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(mergeGuestCartSchema),
      this.controller.mergeGuestCart,
    );

    this.router.delete(
      "/remove/:itemId",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(removeItemSchema),
      this.controller.removeItem,
    );

    this.router.delete(
      "/clear",
      verifyToken,
      checkRole(USER_ROLE.USER),
      this.controller.clearCart,
    );
  }

  public getRouter() {
    return this.router;
  }
}
