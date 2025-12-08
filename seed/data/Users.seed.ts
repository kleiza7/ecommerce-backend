import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin Seller",
        email: "seller@example.com",
        password: hashedPassword,
        role: UserRole.SELLER, // ✔ Prisma ENUM
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: hashedPassword,
        role: UserRole.USER, // ✔ Prisma ENUM
      },
    ],
    // ❌ Prisma v5+ skipDuplicates desteklemiyor → kaldırıldı
  });
};
