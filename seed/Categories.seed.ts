import { Category } from "../models/Category.model";

export const seedCategories = async () => {
  await Category.bulkCreate([
    {
      name: "Electronics",
      slug: "electronics",
      parent_id: null,
      description: "Main category",
      display_order: 1,
    },
    {
      name: "Phones",
      slug: "phones",
      parent_id: 1,
      description: "Mobile phones",
      display_order: 2,
    },
    {
      name: "Laptops",
      slug: "laptops",
      parent_id: 1,
      description: "Laptops and notebooks",
      display_order: 3,
    },
  ]);
};
