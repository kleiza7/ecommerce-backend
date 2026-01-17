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
  constructor(private router: Router, private controller: CartController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    /**
     * GET CART
     */
    this.router.get(
      "/get-cart",
      verifyToken,
      checkRole(USER_ROLE.USER),
      this.controller.getCart
    );

    /**
     * ADD ITEM
     */
    this.router.post(
      "/add",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(addToCartSchema),
      this.controller.addItem
    );

    /**
     * UPDATE ITEM QUANTITY
     */
    this.router.put(
      "/update",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(updateCartQuantitySchema),
      this.controller.updateQuantity
    );

    /**
     * MERGE GUEST CART (LOGIN SONRASI)
     */
    this.router.post(
      "/merge",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(mergeGuestCartSchema),
      this.controller.mergeGuestCart
    );

    /**
     * REMOVE ITEM
     */
    this.router.delete(
      "/remove/:itemId",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(removeItemSchema),
      this.controller.removeItem
    );

    /**
     * CLEAR CART
     */
    this.router.delete(
      "/clear",
      verifyToken,
      checkRole(USER_ROLE.USER),
      this.controller.clearCart
    );
  }

  public getRouter() {
    return this.router;
  }
}
