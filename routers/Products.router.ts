import { Router } from "express";
import { ProductsController } from "../controllers/Products.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/CheckRole";
import { verifyToken } from "../middlewares/VerifyToken";

export class ProductsRouter {
  constructor(private router: Router, private controller: ProductsController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllProducts);
    // TODO: bu endpointi daha sonradan dinamik bir şekilde filtre ürünleri listeleyeceğim bir endpoint olarak yazacağım
    this.router.get(
      "/get-by-brand-id/:brandId",
      this.controller.getProductsByBrandId
    );
    this.router.get("/get-by-id/:id", this.controller.getProductById);
    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      this.controller.createProduct
    );
  }

  public getRouter() {
    return this.router;
  }
}
