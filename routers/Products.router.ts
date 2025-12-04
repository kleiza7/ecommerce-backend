import { Router } from "express";
import { ProductsController } from "../controllers/Products.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../schemas/product.schema";

export class ProductsRouter {
  constructor(private router: Router, private controller: ProductsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    // PUBLIC
    this.router.get("/get-all", this.controller.getAllProducts);

    this.router.get(
      "/get-by-brand-id/:brandId",
      this.controller.getProductsByBrandId
    );

    this.router.get(
      "/get-by-id/:id",
      validate(productIdParamSchema),
      this.controller.getProductById
    );

    // SELLER ONLY
    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(createProductSchema),
      this.controller.createProduct
    );

    this.router.put(
      "/update/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(updateProductSchema),
      this.controller.updateProduct
    );

    this.router.delete(
      "/delete/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(productIdParamSchema),
      this.controller.deleteProduct
    );
  }

  public getRouter() {
    return this.router;
  }
}
