import bcrypt from "bcrypt";
import { USER_ROLE } from "../../enums/UserRole.enum";
import { User } from "../../models/User.model";

export const seedUsers = async () => {
  const sellerPassword = await bcrypt.hash("123456", 10);
  const userPassword = await bcrypt.hash("123456", 10);

  await User.bulkCreate([
    {
      name: "Admin Seller",
      email: "seller@example.com",
      password: sellerPassword,
      role: USER_ROLE.SELLER,
    },
    {
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: USER_ROLE.USER,
    },
  ]);
};
