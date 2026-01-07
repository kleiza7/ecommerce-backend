import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/Auth.schema";

export class AuthRouter {
  constructor(private router: Router, private controller: AuthController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all-sellers", this.controller.getAllSellers);

    this.router.post(
      "/register-user",
      validate(registerSchema),
      this.controller.registerUser
    );

    this.router.post(
      "/register-seller",
      validate(registerSchema),
      this.controller.registerSeller
    );

    this.router.post("/login", validate(loginSchema), this.controller.login);
  }

  public getRouter() {
    return this.router;
  }
}
