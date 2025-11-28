import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controller';

export class AuthRouter {
  constructor(private router: Router, private controller: AuthController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/register-user', this.controller.registerUser);
    this.router.post('/register-seller', this.controller.registerSeller);
    this.router.post('/login', this.controller.login);
  }

  public getRouter() {
    return this.router;
  }
}
