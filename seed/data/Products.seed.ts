import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { prisma } from "../../config/prisma";

// TODO: burada her ürün için 4 resim kullandın, yani aslında bir ürünün bir resmi için 1'er kayıt oluşmalı, ürün sayısı * resim sayısı * 4 şeklinde toplam dosyalarda olmalı ama sen boyuttan kaçmak için hepsinde aynı resmi kullandın bunu göz önünde bulundur

const SEED_IMAGES = path.join(__dirname, "..", "assets");
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads", "products");

const DUMMY_IMAGES = [
  "dummy-image-1.jpg",
  "dummy-image-2.jpg",
  "dummy-image-3.jpg",
  "dummy-image-4.jpg",
];

const IMAGE_URL_SETS = DUMMY_IMAGES.map((img) => ({
  originalUrl: `/uploads/products/original/${img}`,
  thumbUrl: `/uploads/products/thumb/${img}`,
  mediumUrl: `/uploads/products/medium/${img}`,
  largeUrl: `/uploads/products/large/${img}`,
}));

const ensureUploadFolders = async () => {
  for (const f of ["original", "thumb", "medium", "large"]) {
    await fs.mkdir(path.join(UPLOAD_ROOT, f), { recursive: true });
  }
};

/**
 * 🔥 Dummy image'ları SADECE 1 KERE üretir
 * Toplam disk image = 16
 */
const ensureDummyImages = async () => {
  for (const img of DUMMY_IMAGES) {
    const source = path.join(SEED_IMAGES, img);

    const original = path.join(UPLOAD_ROOT, "original", img);
    const thumb = path.join(UPLOAD_ROOT, "thumb", img);
    const medium = path.join(UPLOAD_ROOT, "medium", img);
    const large = path.join(UPLOAD_ROOT, "large", img);

    try {
      await fs.access(original);
      continue; // varsa tekrar üretme
    } catch {}

    await fs.copyFile(source, original);
    await sharp(original).resize({ width: 200 }).toFile(thumb);
    await sharp(original).resize({ width: 600 }).toFile(medium);
    await sharp(original).resize({ width: 1200 }).toFile(large);
  }
};

const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedProducts = async () => {
  console.log("🌱 Seeding products (shared dummy images mode)...");

  await ensureUploadFolders();
  await ensureDummyImages();

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  const leafCategories = categories.filter(
    (c) => !categories.some((x) => x.parentId === c.id)
  );

  const categoryBrandMap: Record<string, string[]> = {
    "android-phones": ["Samsung", "Xiaomi", "Huawei", "Oppo", "OnePlus"],
    iphones: ["Apple"],
    "gaming-laptops": ["MSI", "Asus", "Dell", "HP"],
    ultrabooks: ["Apple", "Dell", "HP", "Lenovo"],
    "mens-shoes": ["Nike", "Adidas", "Puma"],
    "womens-shoes": ["Nike", "Adidas", "Zara"],
    football: ["Nike", "Adidas", "Puma"],
    basketball: ["Nike", "Under Armour"],
    makeup: ["L'Oréal", "Maybelline"],
    skincare: ["Nivea", "Garnier"],
  };

  const createProductWithImages = async (
    brandId: number,
    categoryId: number,
    name: string,
    description: string
  ) => {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        stockCount: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(Math.random() * 45000) + 3000,
        brandId,
        categoryId,
      },
    });

    // 🔥 HER PRODUCT → 4 ProductImage row
    await prisma.productImage.createMany({
      data: IMAGE_URL_SETS.map((urls, index) => ({
        productId: product.id,
        ...urls,
        isPrimary: index === 0,
      })),
    });
  };

  // Örnek: her leaf’e 10 product
  for (const category of leafCategories) {
    const allowed =
      categoryBrandMap[category.slug] ?? brands.map((b) => b.name);

    const eligibleBrands = brands.filter((b) => allowed.includes(b.name));

    for (let i = 0; i < 10; i++) {
      const brand = rand(eligibleBrands);

      await createProductWithImages(
        brand.id,
        category.id,
        `${brand.name} ${category.name} ${i + 1}`,
        `${brand.name} ${category.name} product`
      );
    }
  }

  console.log("✅ Product seeding completed (16 disk images, N×4 DB rows)");
};
