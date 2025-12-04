import { Router } from "express";
import { ProductsController } from "../controllers/Products.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { CheckRole } from "../middlewares/CheckRole";
import { VerifyToken } from "../middlewares/VerifyToken";

export class ProductsRouter {
  constructor(private router: Router, private controller: ProductsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllProducts);

    this.router.get(
      "/get-by-brand-id/:brandId",
      this.controller.getProductsByBrandId
    );

    this.router.get("/get-by-id/:id", this.controller.getProductById);

    this.router.post(
      "/create",
      VerifyToken,
      CheckRole(USER_ROLE.SELLER),
      this.controller.createProduct
    );

    this.router.put(
      "/update/:id",
      VerifyToken,
      CheckRole(USER_ROLE.SELLER),
      this.controller.updateProduct
    );

    this.router.delete(
      "/delete/:id",
      VerifyToken,
      CheckRole(USER_ROLE.SELLER),
      this.controller.deleteProduct
    );
  }

  public getRouter() {
    return this.router;
  }
}
