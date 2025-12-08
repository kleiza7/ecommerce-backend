import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AppError } from "../errors/AppError";

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    role: USER_ROLE
  ) {
    // Email already exists?
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role, // enum Prisma'da birebir tanımlı
      },
    });

    return { message: "Registered successfully" };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    // Validate password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Invalid credentials", 400);
    }

    // JWT Create
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { token };
  }
}
