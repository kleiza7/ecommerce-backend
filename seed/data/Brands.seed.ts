import { prisma } from "../../config/prisma";
import { generateSlug } from "../../utils/Slug.util";

export const seedBrands = async () => {
  const brands = [
    // Technology & Electronics
    "Apple",
    "Samsung",
    "Sony",
    "LG",
    "Xiaomi",
    "Huawei",
    "OnePlus",
    "Oppo",
    "Realme",
    "Nokia",
    "Motorola",
    "Asus",
    "Lenovo",
    "HP",
    "Dell",
    "Acer",
    "MSI",
    "Razer",
    "Microsoft",
    "Intel",
    "AMD",
    "Nvidia",
    "Logitech",
    "Corsair",
    "SteelSeries",
    "HyperX",
    "Philips",
    "Panasonic",
    "Sharp",
    "Toshiba",

    // Camera & Accessories
    "Canon",
    "Nikon",
    "Fujifilm",
    "GoPro",
    "DJI",
    "Leica",
    "Sigma",
    "Tamron",
    "Zhiyun",

    // Gaming & Consoles
    "PlayStation",
    "Xbox",
    "Nintendo",
    "Valve",
    "Thrustmaster",
    "Fanatec",

    // Fashion & Lifestyle
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "New Balance",
    "Under Armour",
    "Levi's",
    "Tommy Hilfiger",
    "Calvin Klein",
    "Zara",
    "H&M",
    "Mango",

    // Home & Living
    "Ikea",
    "Bosch",
    "Siemens",
    "Arçelik",
    "Beko",
    "Vestel",
    "Dyson",
    "Tefal",
    "Philips Hue",

    // Beauty & Personal Care
    "L'Oréal",
    "Maybelline",
    "Nivea",
    "Garnier",
    "Dove",
    "Gillette",
    "Oral-B",
    "Pantene",
  ];

  await prisma.brand.createMany({
    data: brands.map((name) => ({
      name,
      slug: generateSlug(name),
    })),
  });
};
