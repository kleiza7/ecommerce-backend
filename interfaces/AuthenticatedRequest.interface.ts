import { Request } from "express";
import { USER_ROLE } from "../enums/UserRole.enum";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: USER_ROLE;
  };
}
