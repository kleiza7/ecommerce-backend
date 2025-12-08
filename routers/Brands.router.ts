import { Router } from "express";
import { BrandsController } from "../controllers/Brands.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";

import {
  brandIdParamSchema,
  createBrandSchema,
  updateBrandSchema,
} from "../schemas/Brands.schema";

export class BrandsRouter {
  constructor(private router: Router, private controller: BrandsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    //
    // PUBLIC ROUTES
    //
    this.router.get("/get-all", this.controller.getAllBrands);

    this.router.get(
      "/get-by-id/:id",
      validate(brandIdParamSchema),
      this.controller.getBrandById
    );

    //
    // SELLER ONLY ROUTES
    //
    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(createBrandSchema),
      this.controller.createBrand
    );

    this.router.put(
      "/update/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(updateBrandSchema),
      this.controller.updateBrand
    );

    this.router.delete(
      "/delete/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(brandIdParamSchema),
      this.controller.deleteBrand
    );
  }

  public getRouter() {
    return this.router;
  }
}
