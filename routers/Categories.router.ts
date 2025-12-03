import { Router } from "express";
import { CategoriesController } from "../controllers/Categories.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { CheckRole } from "../middlewares/CheckRole";
import { VerifyToken } from "../middlewares/VerifyToken";

export class CategoriesRouter {
  constructor(
    private router: Router,
    private controller: CategoriesController
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllCategories);
    this.router.get("/get-by-id/:id", this.controller.getCategoryById);
    this.router.get("/get-children/:id", this.controller.getChildren);
    this.router.post(
      "/create",
      VerifyToken,
      CheckRole(USER_ROLE.SELLER),
      this.controller.createCategory
    );
    this.router.put(
      "/update/:id",
      VerifyToken,
      CheckRole(USER_ROLE.SELLER),
      this.controller.updateCategory
    );
    this.router.delete(
      "/delete/:id",
      VerifyToken,
      CheckRole(USER_ROLE.SELLER),
      this.controller.deleteCategory
    );
  }

  public getRouter() {
    return this.router;
  }
}
