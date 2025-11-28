import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { USER_ROLE } from '../enums/UserRole.enum';

export class AuthController {
  private registerWithRole = async (req: Request, res: Response, role: USER_ROLE) => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const hashed = await bcrypt.hash(password, 10);

      await User.create({ name, email, password: hashed, role });

      res.status(201).json({ message: 'Registered successfully' });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
  };

  registerUser = async (req: Request, res: Response) => {
    return this.registerWithRole(req, res, USER_ROLE.USER);
  };

  registerSeller = async (req: Request, res: Response) => {
    return this.registerWithRole(req, res, USER_ROLE.SELLER);
  };

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
      });

      res.json({ token });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
  }
}
