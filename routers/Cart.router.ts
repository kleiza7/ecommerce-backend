import { Router } from "express";
import { CartController } from "../controllers/Cart.controller";
import { VerifyToken } from "../middlewares/VerifyToken";

export class CartRouter {
  constructor(private router: Router, private controller: CartController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", VerifyToken, this.controller.getCart);

    this.router.post("/add", VerifyToken, this.controller.addItem);

    this.router.put(
      "/update/:itemId",
      VerifyToken,
      this.controller.updateQuantity
    );

    this.router.delete(
      "/remove/:itemId",
      VerifyToken,
      this.controller.removeItem
    );

    this.router.delete("/clear", VerifyToken, this.controller.clearCart);
  }

  public getRouter() {
    return this.router;
  }
}
