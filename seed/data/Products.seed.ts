import { Brand } from "../../models/Brand.model";
import { Category } from "../../models/Category.model";
import { Product } from "../../models/Product.model";

export const seedProducts = async () => {
  // --- Load foreign keys dynamically ---
  const apple = await Brand.findOne({ where: { name: "Apple" } });
  if (!apple) throw new Error("Brand 'Apple' not found in seed");

  const phones = await Category.findOne({ where: { slug: "phones" } });
  const laptops = await Category.findOne({ where: { slug: "laptops" } });

  if (!phones || !laptops) {
    throw new Error("Category 'phones' or 'laptops' not found in seed");
  }

  // --- Create products ---
  await Product.bulkCreate([
    {
      name: "iPhone 15",
      description: "Apple smartphone",
      price: 42000,
      brand_id: apple.id,
      category_id: phones.id,
    },
    {
      name: "MacBook Air",
      description: "Apple laptop",
      price: 56000,
      brand_id: apple.id,
      category_id: laptops.id,
    },
  ]);
};
