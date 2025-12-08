import { prisma } from "../../config/prisma";
import { generateSlug } from "../../utils/Slug.util";

export const seedCategories = async () => {
  // 1) Parent category (Electronics)
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: generateSlug("Electronics"),
      parentId: null,
      description: "Main category",
      displayOrder: 1,
    },
  });

  // 2) Phones (child)
  await prisma.category.create({
    data: {
      name: "Phones",
      slug: generateSlug("Phones"),
      parentId: electronics.id,
      description: "Mobile phones",
      displayOrder: 2,
    },
  });

  // 3) Laptops (child)
  await prisma.category.create({
    data: {
      name: "Laptops",
      slug: generateSlug("Laptops"),
      parentId: electronics.id,
      description: "Laptops and notebooks",
      displayOrder: 3,
    },
  });
};
