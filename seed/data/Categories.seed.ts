import { Category } from "../../models/Category.model";
import { generateSlug } from "../../utils/Slug.util";

export const seedCategories = async () => {
  // 1) Ana kategori
  const electronics = await Category.create({
    name: "Electronics",
    slug: generateSlug("Electronics"),
    parent_id: null,
    description: "Main category",
    display_order: 1,
  });

  // 2) Phones
  await Category.create({
    name: "Phones",
    slug: generateSlug("Phones"),
    parent_id: electronics.id, // hard-coded id yok!
    description: "Mobile phones",
    display_order: 2,
  });

  // 3) Laptops
  await Category.create({
    name: "Laptops",
    slug: generateSlug("Laptops"),
    parent_id: electronics.id,
    description: "Laptops and notebooks",
    display_order: 3,
  });
};
