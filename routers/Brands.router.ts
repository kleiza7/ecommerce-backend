import { Router } from "express";
import { BrandsController } from "../controllers/Brands.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/CheckRole";
import { verifyToken } from "../middlewares/VerifyToken";

export class BrandsRouter {
  constructor(private router: Router, private controller: BrandsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllBrands);
    this.router.get("/get-by-id/:id", this.controller.getBrandById);
    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      this.controller.createBrand
    );
  }

  public getRouter() {
    return this.router;
  }
}
