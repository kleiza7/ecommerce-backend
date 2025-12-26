import { Router } from "express";
import { CategoriesController } from "../controllers/Categories.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/Categories.schema";

export class CategoriesRouter {
  constructor(
    private router: Router,
    private controller: CategoriesController
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllCategories);

    this.router.get(
      "/get-by-id/:id",
      validate(categoryIdParamSchema),
      this.controller.getCategoryById
    );

    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(createCategorySchema),
      this.controller.createCategory
    );

    this.router.put(
      "/update",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(updateCategorySchema),
      this.controller.updateCategory
    );

    this.router.delete(
      "/delete/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(categoryIdParamSchema),
      this.controller.deleteCategory
    );
  }

  public getRouter() {
    return this.router;
  }
}
