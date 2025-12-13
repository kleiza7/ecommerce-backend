import { Router } from "express";
import { ProductsController } from "../controllers/Products.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import {
  uploadNewProductImages,
  uploadProductImages,
} from "../middlewares/imageUpload.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  createProductSchema,
  productIdParamSchema,
  productListSchema,
  updateProductSchema,
} from "../schemas/Products.schema";

export class ProductsRouter {
  constructor(private router: Router, private controller: ProductsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    // LIST (pagination + filters)
    this.router.post(
      "/list",
      validate(productListSchema),
      this.controller.getProducts
    );

    // GET BY ID
    this.router.get(
      "/get-by-id/:id",
      validate(productIdParamSchema),
      this.controller.getProductById
    );

    // CREATE (SELLER ONLY)
    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      uploadProductImages,
      validate(createProductSchema),
      this.controller.createProduct
    );

    // UPDATE (SELLER ONLY)
    this.router.put(
      "/update/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      uploadNewProductImages,
      validate(updateProductSchema),
      this.controller.updateProduct
    );

    // DELETE (SELLER ONLY)
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
