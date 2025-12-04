import { sequelize } from "../config/database";
import { associateModels } from "../models";
import { seedBrands } from "./data/Brands.seed";
import { seedCategories } from "./data/Categories.seed";
import { seedProducts } from "./data/Products.seed";
import { seedUsers } from "./data/Users.seed";

// Seeders

const main = async () => {
  try {
    console.log("🔄 Syncing DB...");

    // Model ilişkilerini yükle
    associateModels();

    // DB reset
    await sequelize.sync({ force: true });
    console.log("✔ Database synced (force: true)");

    // ORDER IS IMPORTANT
    console.log("🌱 Seeding categories...");
    await seedCategories();

    console.log("🌱 Seeding brands...");
    await seedBrands();

    console.log("🌱 Seeding users...");
    await seedUsers();

    console.log("🌱 Seeding products...");
    await seedProducts();

    console.log("🎉 All seeds completed successfully!");

    // Connection'u temiz kapat
    await sequelize.close();
    console.log("🔌 DB connection closed.");
  } catch (err) {
    console.error("❌ Seed error:", err);
    await sequelize.close();
    process.exit(1);
  }
};

main();
