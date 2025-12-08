import { prisma } from "../../config/prisma";
import { generateSlug } from "../../utils/Slug.util";

export const seedBrands = async () => {
  await prisma.brand.createMany({
    data: [
      { name: "Apple", slug: generateSlug("Apple") },
      { name: "Samsung", slug: generateSlug("Samsung") },
      { name: "Lenovo", slug: generateSlug("Lenovo") },
    ],
  });
};
