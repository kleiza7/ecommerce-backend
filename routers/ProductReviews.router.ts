import { Router } from "express";
import { ProductReviewsController } from "../controllers/ProductReviews.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  createProductReviewSchema,
  productReviewIdParamSchema,
  productReviewProductIdParamSchema,
  updateProductReviewSchema,
} from "../schemas/ProductReviews.schema";

export class ProductReviewsRouter {
  constructor(
    private router: Router,
    private controller: ProductReviewsController,
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/get-reviews-by-product-id/:productId",
      validate(productReviewProductIdParamSchema),
      this.controller.getReviewsByProductId,
    );

    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(createProductReviewSchema),
      this.controller.createReview,
    );

    this.router.put(
      "/update",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(updateProductReviewSchema),
      this.controller.updateReview,
    );

    this.router.delete(
      "/delete/:id",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(productReviewIdParamSchema),
      this.controller.deleteReview,
    );
  }

  public getRouter() {
    return this.router;
  }
}
