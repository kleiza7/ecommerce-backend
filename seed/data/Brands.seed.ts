import { prisma } from "../../config/prisma";
import { generateSlug } from "../../utils/Slug.util";

export const seedBrands = async () => {
  await prisma.brand.createMany({
    data: [
      { name: "Apple", slug: generateSlug("Apple") },
      { name: "Samsung", slug: generateSlug("Samsung") },
      { name: "Lenovo", slug: generateSlug("Lenovo") },
      { name: "Asus", slug: generateSlug("Asus") },
      { name: "HP", slug: generateSlug("HP") },
      { name: "Dell", slug: generateSlug("Dell") },
      { name: "Acer", slug: generateSlug("Acer") },
      { name: "Xiaomi", slug: generateSlug("Xiaomi") },
      { name: "Huawei", slug: generateSlug("Huawei") },
      { name: "LG", slug: generateSlug("LG") },
      { name: "Sony", slug: generateSlug("Sony") },
      { name: "Microsoft", slug: generateSlug("Microsoft") },
      { name: "MSI", slug: generateSlug("MSI") },
      { name: "Razer", slug: generateSlug("Razer") },
      { name: "Logitech", slug: generateSlug("Logitech") },
      { name: "Corsair", slug: generateSlug("Corsair") },
      { name: "Canon", slug: generateSlug("Canon") },
      { name: "Nikon", slug: generateSlug("Nikon") },
      { name: "GoPro", slug: generateSlug("GoPro") },
      { name: "Philips", slug: generateSlug("Philips") },
    ],
  });
};
