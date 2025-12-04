import { NextFunction, Request, Response } from "express";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AuthService } from "../services/Auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  private registerWithRole = async (
    req: Request,
    res: Response,
    next: NextFunction,
    role: USER_ROLE
  ) => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.register(
        name,
        email,
        password,
        role
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  registerUser = (req: Request, res: Response, next: NextFunction) => {
    return this.registerWithRole(req, res, next, USER_ROLE.USER);
  };

  registerSeller = (req: Request, res: Response, next: NextFunction) => {
    return this.registerWithRole(req, res, next, USER_ROLE.SELLER);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
