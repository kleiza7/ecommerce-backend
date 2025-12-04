import { Brand } from "../../models/Brand.model";
import { generateSlug } from "../../utils/Slug.util";

export const seedBrands = async () => {
  await Brand.bulkCreate([
    { name: "Apple", slug: generateSlug("Apple") },
    { name: "Samsung", slug: generateSlug("Samsung") },
    { name: "Lenovo", slug: generateSlug("Lenovo") },
  ]);
};
