import { Router } from "express";
import { BrandsController } from "../controllers/Brands.controller";

export class BrandsRouter {
  constructor(private router: Router, private controller: BrandsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllBrands);
    this.router.get("/get-by-id/:id", this.controller.getBrandById);
    this.router.post("/create", this.controller.createBrand);
  }

  public getRouter() {
    return this.router;
  }
}
