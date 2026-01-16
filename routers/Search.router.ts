import { Router } from "express";
import { SearchController } from "../controllers/Search.controller";
import { validate } from "../middlewares/validate.middleware";
import { searchQuerySchema } from "../schemas/Search.schema";

export class SearchRouter {
  constructor(private router: Router, private controller: SearchController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", validate(searchQuerySchema), this.controller.search);
  }

  public getRouter() {
    return this.router;
  }
}
