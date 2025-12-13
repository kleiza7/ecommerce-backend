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

  // 2) Child categories under Electronics
  const childCategories = [
    { name: "Phones", description: "Mobile phones" },
    { name: "Laptops", description: "Laptops and notebooks" },
    { name: "Tablets", description: "Tablet devices" },
    { name: "Smart Watches", description: "Wearable smart watches" },
    { name: "Headphones", description: "Wireless and wired headphones" },
    { name: "Monitors", description: "Computer monitors and displays" },
    { name: "Keyboards", description: "Mechanical and membrane keyboards" },
    { name: "Mice", description: "Computer mouse devices" },
    { name: "Cameras", description: "Photo and video cameras" },
    { name: "Gaming Consoles", description: "PlayStation, Xbox, Nintendo" },
  ];

  let order = 2;

  for (const c of childCategories) {
    await prisma.category.create({
      data: {
        name: c.name,
        slug: generateSlug(c.name),
        parentId: electronics.id,
        description: c.description,
        displayOrder: order++,
      },
    });
  }
};
