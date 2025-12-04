import { Request, Response } from "express";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AuthService } from "../services/Auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  private registerWithRole = async (
    req: Request,
    res: Response,
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

      if (result === null) {
        return res.status(400).json({ message: "Email already exists" });
      }

      return res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  };

  registerUser = (req: Request, res: Response) => {
    return this.registerWithRole(req, res, USER_ROLE.USER);
  };

  registerSeller = (req: Request, res: Response) => {
    return this.registerWithRole(req, res, USER_ROLE.SELLER);
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const token = await this.authService.login(email, password);

      if (!token) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      return res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  };
}
