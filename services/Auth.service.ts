import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AppError } from "../errors/AppError";
import { User } from "../models/User.model";

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    role: USER_ROLE
  ) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    return { message: "Registered successfully" };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { token };
  }
}
