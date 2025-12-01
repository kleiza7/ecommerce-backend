import { sequelize } from "../config/database";
import { associateModels } from "../models";
import { seedBrands } from "./Brands.seed";
import { seedCategories } from "./Categories.seed";
import { seedProducts } from "./Products.seed";
import { seedUsers } from "./Users.seed";

const main = async () => {
  try {
    console.log("Syncing DB...");
    associateModels();
    await sequelize.sync({ force: true }); // DB'yi sıfırlar

    console.log("Seeding categories...");
    await seedCategories();

    console.log("Seeding brands...");
    await seedBrands();

    console.log("Seeding users...");
    await seedUsers();

    console.log("Seeding products...");
    await seedProducts();

    console.log("All seeds completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

main();
