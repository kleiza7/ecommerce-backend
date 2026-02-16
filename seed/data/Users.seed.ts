import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("Test1234", 10);

  const admins = [
    {
      name: "Admin",
      email: "admin@example.com",
      role: USER_ROLE.ADMIN,
    },
  ];

  const users = Array.from({ length: 2 }, (_, index) => {
    const userNumber = index + 1;
    return {
      name: `User ${userNumber}`,
      email: `user${userNumber}@example.com`,
      role: USER_ROLE.USER,
    };
  });

  const sellers = Array.from({ length: 7 }, (_, index) => {
    const sellerNumber = index + 1;
    return {
      name: `Seller ${sellerNumber}`,
      email: `seller${sellerNumber}@example.com`,
      role: USER_ROLE.SELLER,
    };
  });

  const usersData = [...admins, ...users, ...sellers].map((user) => ({
    ...user,
    password: hashedPassword,
  }));

  await prisma.user.createMany({
    data: usersData,
  });
};
