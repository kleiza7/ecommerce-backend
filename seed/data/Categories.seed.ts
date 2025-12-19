import { prisma } from "../../config/prisma";
import { generateSlug } from "../../utils/Slug.util";

type CategorySeed = {
  name: string;
  description?: string;
  children?: CategorySeed[];
};

export const seedCategories = async () => {
  const categories: CategorySeed[] = [
    {
      name: "Electronics",
      description: "Electronic devices and accessories",
      children: [
        {
          name: "Phones",
          children: [
            { name: "Android Phones" },
            { name: "iPhones" },
            { name: "Feature Phones" },
          ],
        },
        {
          name: "Laptops",
          children: [
            { name: "Gaming Laptops" },
            { name: "Ultrabooks" },
            { name: "Business Laptops" },
          ],
        },
        { name: "Tablets" },
        { name: "Smart Watches" },
        { name: "Headphones" },
        { name: "Monitors" },
        { name: "Gaming Consoles" },
      ],
    },

    {
      name: "Fashion",
      description: "Clothing and accessories",
      children: [
        {
          name: "Women",
          children: [
            { name: "Dresses" },
            { name: "T-Shirts" },
            { name: "Jeans" },
            { name: "Shoes" },
          ],
        },
        {
          name: "Men",
          children: [
            { name: "T-Shirts" },
            { name: "Shirts" },
            { name: "Jeans" },
            { name: "Sneakers" },
          ],
        },
        {
          name: "Kids",
          children: [{ name: "Boys Clothing" }, { name: "Girls Clothing" }],
        },
        { name: "Bags" },
        { name: "Accessories" },
      ],
    },

    {
      name: "Home & Living",
      description: "Furniture and home products",
      children: [
        { name: "Furniture" },
        { name: "Kitchen" },
        { name: "Home Decoration" },
        {
          name: "Bedroom",
          children: [
            { name: "Beds" },
            { name: "Wardrobes" },
            { name: "Mattresses" },
          ],
        },
        { name: "Lighting" },
      ],
    },

    {
      name: "Sports & Outdoor",
      description: "Sportswear and outdoor equipment",
      children: [
        { name: "Fitness" },
        { name: "Running" },
        { name: "Camping" },
        { name: "Cycling" },
        {
          name: "Team Sports",
          children: [
            { name: "Football" },
            { name: "Basketball" },
            { name: "Volleyball" },
          ],
        },
      ],
    },

    {
      name: "Beauty & Personal Care",
      description: "Cosmetics and personal care",
      children: [
        { name: "Makeup" },
        { name: "Skincare" },
        { name: "Hair Care" },
        { name: "Perfume" },
        {
          name: "Personal Care",
          children: [
            { name: "Shaving" },
            { name: "Oral Care" },
            { name: "Body Care" },
          ],
        },
      ],
    },
  ];

  let displayOrder = 1;

  const createCategoryRecursive = async (
    category: CategorySeed,
    parentId: number | null,
    parentSlug: string | null
  ) => {
    const slug = parentSlug
      ? generateSlug(`${parentSlug}-${category.name}`)
      : generateSlug(category.name);

    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug,
        description: category.description ?? null,
        parentId,
        displayOrder: displayOrder++,
      },
    });

    if (category.children?.length) {
      for (const child of category.children) {
        await createCategoryRecursive(child, created.id, slug);
      }
    }
  };

  for (const category of categories) {
    await createCategoryRecursive(category, null, null);
  }
};
