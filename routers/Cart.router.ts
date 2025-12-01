import { Router } from "express";
import { CartController } from "../controllers/Cart.controller";
import { verifyToken } from "../middlewares/VerifyToken";

export class CartRouter {
  constructor(private router: Router, private controller: CartController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", verifyToken, this.controller.getCart);

    this.router.post("/add", verifyToken, this.controller.addItem);

    this.router.put(
      "/update/:itemId",
      verifyToken,
      this.controller.updateQuantity
    );

    this.router.delete(
      "/remove/:itemId",
      verifyToken,
      this.controller.removeItem
    );

    this.router.delete("/clear", verifyToken, this.controller.clearCart);
  }

  public getRouter() {
    return this.router;
  }
}
