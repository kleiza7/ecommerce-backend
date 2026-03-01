import { prisma } from "../config/prisma";
import { seedBrands } from "./data/Brands.seed";
import { seedCategories } from "./data/Categories.seed";
import { seedCurrencies } from "./data/Currencies.seed";
import { seedProductReviews } from "./data/ProductReviews.seed";
import { seedProducts } from "./data/Products.seed";
import { seedUsers } from "./data/Users.seed";

const main = async () => {
  try {
    console.log("🌱 Running Prisma Seed...");

    // WARNING: Order matters
    console.log("➡ Seeding categories...");
    await seedCategories();

    console.log("➡ Seeding brands...");
    await seedBrands();

    console.log("➡ Seeding currencies...");
    await seedCurrencies();

    console.log("➡ Seeding users...");
    await seedUsers();

    console.log("➡ Seeding products...");
    await seedProducts();

    console.log("➡ Seeding product reviews...");
    await seedProductReviews();

    console.log("🎉 Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Prisma disconnected.");
  }
};

main();
