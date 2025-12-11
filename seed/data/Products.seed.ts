import { prisma } from "../../config/prisma";

export const seedProducts = async () => {
  // --- Load brands & categories dynamically ---
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  if (brands.length === 0) throw new Error("No brands found");
  if (categories.length === 0) throw new Error("No categories found");

  // Helper to get random array element
  const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // --- Predefined product names per category (type-safe) ---
  const productNames: Record<string, string[]> = {
    Phones: [
      "iPhone 15",
      "iPhone 14 Pro",
      "Galaxy S23",
      "Galaxy A54",
      "Xiaomi Redmi Note 12",
      "Huawei P50",
      "Sony Xperia 10",
      "Asus Zenfone 9",
      "Pixel 7",
      "Nokia G21",
    ],
    Laptops: [
      "MacBook Air M2",
      "MacBook Pro M3",
      "Dell XPS 13",
      "Lenovo ThinkPad X1",
      "HP Spectre x360",
      "Asus ROG Strix G15",
      "Acer Nitro 5",
      "MSI Stealth 14",
      "Surface Laptop 5",
      "Huawei MateBook D16",
    ],
    Tablets: [
      "iPad Pro 11",
      "iPad Mini",
      "Galaxy Tab S8",
      "Xiaomi Pad 6",
      "Lenovo Tab P11",
      "Huawei MatePad",
      "Surface Go 3",
      "Amazon Fire HD 10",
      "Asus ZenPad",
      "Acer Iconia",
    ],
    "Smart Watches": [
      "Apple Watch Series 9",
      "Apple Watch SE",
      "Samsung Galaxy Watch 6",
      "Huawei Watch GT 3",
      "Xiaomi Mi Watch",
      "Garmin Venu 2",
      "Fitbit Sense 2",
      "Amazfit GTR 4",
      "Honor Watch GS",
      "Fossil Gen 6",
    ],
    Headphones: [
      "AirPods Pro 2",
      "AirPods Max",
      "Sony WH-1000XM5",
      "Bose QC 45",
      "JBL Tune 760",
      "Logitech G Pro X",
      "Razer Kraken V3",
      "SteelSeries Arctis 7",
      "Beats Studio 3",
      "Sennheiser HD 450",
    ],
    Monitors: [
      "ASUS ROG Swift 27",
      "ASUS TUF Gaming 24",
      "Dell UltraSharp 27",
      "Acer Predator 27",
      "LG UltraGear 27",
      "Samsung Odyssey G5",
      "MSI Optix G241",
      "BenQ Zowie XL2411",
      "HP Pavilion 27",
      "Philips Momentum 32",
    ],
    Keyboards: [
      "Logitech MX Keys",
      "Razer BlackWidow V3",
      "Corsair K70 RGB",
      "SteelSeries Apex Pro",
      "Asus ROG Strix Scope",
      "HyperX Alloy Origins",
      "Ducky One 2 Mini",
      "Keychron K2",
      "MSI Vigor GK50",
      "Cooler Master CK352",
    ],
    Mice: [
      "Logitech G502",
      "Razer DeathAdder V3",
      "SteelSeries Rival 600",
      "Corsair Dark Core RGB",
      "Asus ROG Chakram",
      "HyperX Pulsefire Haste",
      "Cooler Master MM720",
      "Glorious Model O",
      "MSI Clutch GM41",
      "BenQ Zowie EC2",
    ],
    Cameras: [
      "Canon EOS R10",
      "Canon EOS M50",
      "Sony A6400",
      "Sony A7 IV",
      "Nikon Z50",
      "Nikon D7500",
      "Fujifilm X-T30",
      "Panasonic Lumix G7",
      "GoPro Hero 11",
      "DJI Pocket 2",
    ],
    "Gaming Consoles": [
      "PlayStation 5",
      "PlayStation 5 Digital",
      "Xbox Series X",
      "Xbox Series S",
      "Nintendo Switch OLED",
      "Nintendo Switch Lite",
      "Steam Deck 512GB",
      "ASUS ROG Ally",
      "Logitech G Cloud",
      "PlayStation VR2",
    ],
  };

  const products: any[] = [];

  // Generate 10 products per category
  for (const category of categories) {
    const names = productNames[category.name] || [];

    for (let i = 0; i < 10; i++) {
      const brand = rand(brands);
      const productName = names[i] || `${category.name} Product ${i + 1}`;

      products.push({
        name: productName,
        description: `${brand.name} ${category.name} product`,
        price: Math.floor(Math.random() * 50000) + 2000, // 2000–52000
        brandId: brand.id,
        categoryId: category.id,
      });
    }
  }

  await prisma.product.createMany({ data: products });

  console.log(`Seeded ${products.length} products successfully!`);
};
