import { Router } from "express";
import { ProductsController } from "../controllers/Products.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import {
  uploadNewProductImages,
  uploadProductImages,
} from "../middlewares/productImageUpload.middleware";
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
    this.router.post(
      "/list",
      validate(productListSchema),
      this.controller.getProductsList
    );

    this.router.get(
      "/get-products-by-seller",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      this.controller.getProductsBySeller
    );

    this.router.get(
      "/get-waiting-approval-products",
      verifyToken,
      checkRole(USER_ROLE.ADMIN),
      this.controller.getWaitingApprovalProducts
    );

    this.router.put(
      "/approve/:id",
      verifyToken,
      checkRole(USER_ROLE.ADMIN),
      validate(productIdParamSchema),
      this.controller.approveProduct
    );

    this.router.put(
      "/reject/:id",
      verifyToken,
      checkRole(USER_ROLE.ADMIN),
      validate(productIdParamSchema),
      this.controller.rejectProduct
    );

    this.router.get(
      "/get-by-id/:id",
      validate(productIdParamSchema),
      this.controller.getProductById
    );

    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      uploadProductImages,
      validate(createProductSchema),
      this.controller.createProduct
    );

    this.router.put(
      "/update",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      uploadNewProductImages,
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
