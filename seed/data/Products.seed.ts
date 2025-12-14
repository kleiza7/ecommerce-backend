import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { prisma } from "../../config/prisma";

const SEED_IMAGES = path.join(__dirname, "..", "assets");
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads", "products");

const ensureUploadFolders = async () => {
  const folders = ["original", "thumb", "medium", "large"];
  for (const f of folders) {
    await fs.mkdir(path.join(UPLOAD_ROOT, f), { recursive: true });
  }
};

const DUMMY_IMAGES = [
  "dummy-image-1.jpg",
  "dummy-image-2.jpg",
  "dummy-image-3.jpg",
  "dummy-image-4.jpg",
];

const generateFilename = (ext: string) =>
  `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

const seedProcessImage = async (productId: number, filename: string) => {
  const sourcePath = path.join(SEED_IMAGES, filename);
  const ext = path.extname(filename);

  const finalName = generateFilename(ext);

  const originalPath = path.join(UPLOAD_ROOT, "original", finalName);
  const thumbPath = path.join(UPLOAD_ROOT, "thumb", finalName);
  const mediumPath = path.join(UPLOAD_ROOT, "medium", finalName);
  const largePath = path.join(UPLOAD_ROOT, "large", finalName);

  await fs.copyFile(sourcePath, originalPath);

  await sharp(originalPath).resize({ width: 200 }).toFile(thumbPath);
  await sharp(originalPath).resize({ width: 600 }).toFile(mediumPath);
  await sharp(originalPath).resize({ width: 1200 }).toFile(largePath);

  return prisma.productImage.create({
    data: {
      productId,
      originalUrl: `/uploads/products/original/${finalName}`,
      thumbUrl: `/uploads/products/thumb/${finalName}`,
      mediumUrl: `/uploads/products/medium/${finalName}`,
      largeUrl: `/uploads/products/large/${finalName}`,
      isPrimary: false,
    },
  });
};

const ensurePrimary = async (productId: number) => {
  const images = await prisma.productImage.findMany({
    where: { productId },
  });

  if (!images.some((img) => img.isPrimary)) {
    await prisma.productImage.update({
      where: { id: images[0].id },
      data: { isPrimary: true },
    });
  }
};

export const seedProducts = async () => {
  console.log("Seeding products...");

  await ensureUploadFolders();

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  if (!brands.length) throw new Error("No brands found");
  if (!categories.length) throw new Error("No categories found");

  const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const productNames: Record<string, string[]> = {
    Phones: ["iPhone 15", "Galaxy S23", "Huawei P50"],
    Laptops: ["MacBook Pro", "Dell XPS", "MSI Stealth"],
    Tablets: ["iPad Pro", "Galaxy Tab", "Xiaomi Pad"],
  };

  for (const category of categories) {
    const names = productNames[category.name] || [];

    for (let i = 0; i < 10; i++) {
      const brand = rand(brands);
      const name = names[i] || `${category.name} Product ${i + 1}`;

      const product = await prisma.product.create({
        data: {
          name,
          description: `${brand.name} ${category.name} product`,
          stockCount: Math.floor(Math.random() * 101),
          price: Math.floor(Math.random() * 50000) + 2000,
          brandId: brand.id,
          categoryId: category.id,
        },
      });

      for (const dummy of DUMMY_IMAGES) {
        await seedProcessImage(product.id, dummy);
      }

      await ensurePrimary(product.id);
    }
  }

  console.log("Product seeding completed ✔");
};
