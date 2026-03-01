import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("Test1234", 10);

  const admins = [
    {
      name: "System Administrator",
      email: "admin@shopland.dev",
      role: USER_ROLE.ADMIN,
    },
  ];

  const users = [
    { name: "John Doe", email: "john.doe@example.com", role: USER_ROLE.USER },
    {
      name: "Emily Carter",
      email: "emily.carter@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Olivia Wilson",
      email: "olivia.wilson@example.com",
      role: USER_ROLE.USER,
    },
    {
      name: "Daniel Martinez",
      email: "daniel.martinez@example.com",
      role: USER_ROLE.USER,
    },
  ];

  const sellers = [
    {
      name: "NovaTech Store",
      email: "contact@novatech-store.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "UrbanWear Co.",
      email: "support@urbanwear-co.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "HomeCraft Market",
      email: "info@homecraft-market.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "BrightElectro",
      email: "hello@brightelectro.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "PureStyle Boutique",
      email: "contact@purestyle-boutique.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "NextGen Gadgets",
      email: "sales@nextgen-gadgets.com",
      role: USER_ROLE.SELLER,
    },
    {
      name: "ComfortLiving Store",
      email: "support@comfortliving-store.com",
      role: USER_ROLE.SELLER,
    },
  ];

  const usersData = [...admins, ...users, ...sellers].map((user) => ({
    ...user,
    password: hashedPassword,
  }));

  await prisma.user.createMany({
    data: usersData,
  });
};
