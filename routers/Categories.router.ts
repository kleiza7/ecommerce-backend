import { Router } from "express";
import { CategoriesController } from "../controllers/Categories.controller";

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
    this.router.post("/create", this.controller.createCategory);
    this.router.put("/update/:id", this.controller.updateCategory);
    this.router.delete("/delete/:id", this.controller.deleteCategory);
  }

  public getRouter() {
    return this.router;
  }
}
