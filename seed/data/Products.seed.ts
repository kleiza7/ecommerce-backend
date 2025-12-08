import { prisma } from "../../config/prisma";
import { generateSlug } from "../../utils/Slug.util";

export const seedProducts = async () => {
  // --- Load foreign keys dynamically (Prisma version) ---
  const apple = await prisma.brand.findUnique({
    where: { slug: generateSlug("Apple") },
  });

  if (!apple) throw new Error("Brand 'Apple' not found in seed");

  const phones = await prisma.category.findUnique({
    where: { slug: generateSlug("Phones") },
  });

  const laptops = await prisma.category.findUnique({
    where: { slug: generateSlug("Laptops") },
  });

  if (!phones || !laptops) {
    throw new Error("Category 'phones' or 'laptops' not found in seed");
  }

  // --- Create products ---
  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15",
        description: "Apple smartphone",
        price: 42000,
        brandId: apple.id,
        categoryId: phones.id,
      },
      {
        name: "MacBook Air",
        description: "Apple laptop",
        price: 56000,
        brandId: apple.id,
        categoryId: laptops.id,
      },
    ],
  });
};
