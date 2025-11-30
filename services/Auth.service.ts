import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_ROLE } from "../enums/UserRole.enum";
import { User } from "../models/User.model";

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    role: USER_ROLE
  ) {
    const existing = await User.findOne({ where: { email } });
    if (existing) return null;

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    return true;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return token;
  }
}
