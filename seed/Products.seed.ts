import { Product } from "../models/Product.model";

export const seedProducts = async () => {
  await Product.bulkCreate([
    {
      name: "iPhone 15",
      description: "Apple smartphone",
      price: 42000,
      brand_id: 1,
      category_id: 2,
    },
    {
      name: "MacBook Air",
      description: "Apple laptop",
      price: 56000,
      brand_id: 1,
      category_id: 3,
    },
  ]);
};
