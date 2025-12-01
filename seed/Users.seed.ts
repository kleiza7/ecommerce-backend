import bcrypt from "bcrypt";
import { USER_ROLE } from "../enums/UserRole.enum";
import { User } from "../models/User.model";

export const seedUsers = async () => {
  const password = await bcrypt.hash("123456", 10);

  await User.bulkCreate([
    {
      name: "Admin",
      email: "admin@test.com",
      password,
      role: USER_ROLE.SELLER,
    },
    { name: "User", email: "user@test.com", password, role: USER_ROLE.USER },
  ]);
};
