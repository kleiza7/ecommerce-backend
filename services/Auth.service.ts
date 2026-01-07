import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AppError } from "../errors/AppError";

export class AuthService {
  async getAllSellers() {
    const sellers = await prisma.user.findMany({
      where: { role: USER_ROLE.SELLER },
      select: {
        id: true,
        name: true,
      },
    });

    return sellers;
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: USER_ROLE
  ) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
      },
    });

    return { message: "Registered successfully" };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Invalid credentials", 400);
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken,
      user: publicUser,
    };
  }
}
