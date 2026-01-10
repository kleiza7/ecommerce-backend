import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("Test1234", 10);

  await prisma.user.createMany({
    data: [
      /* =========================
         ADMIN
      ========================= */
      {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: USER_ROLE.ADMIN,
      },

      /* =========================
         REGULAR USERS
      ========================= */
      {
        name: "User 1",
        email: "user1@example.com",
        password: hashedPassword,
        role: USER_ROLE.USER,
      },
      {
        name: "User 2",
        email: "user2@example.com",
        password: hashedPassword,
        role: USER_ROLE.USER,
      },

      /* =========================
         SELLERS
      ========================= */
      {
        name: "Seller 1",
        email: "seller1@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
      {
        name: "Seller 2",
        email: "seller2@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
      {
        name: "Seller 3",
        email: "seller3@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
      {
        name: "Seller 4",
        email: "seller4@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
      {
        name: "Seller 5",
        email: "seller5@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
      {
        name: "Seller 6",
        email: "seller6@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
      {
        name: "Seller 7",
        email: "seller7@example.com",
        password: hashedPassword,
        role: USER_ROLE.SELLER,
      },
    ],
  });
};
