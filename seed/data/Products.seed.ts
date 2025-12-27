import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import cloudinary from "../../config/cloudinary";
import { prisma } from "../../config/prisma";

const isProd = process.env.NODE_ENV === "production";

const SEED_IMAGES = path.join(__dirname, "..", "assets");
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads", "products");

const DUMMY_IMAGES = [
  "dummy-image-1.jpg",
  "dummy-image-2.jpg",
  "dummy-image-3.jpg",
  "dummy-image-4.jpg",
];

/* ===========================
   LOCAL HELPERS
=========================== */

const ensureUploadFolders = async () => {
  for (const f of ["original", "thumb", "medium", "large"]) {
    await fs.mkdir(path.join(UPLOAD_ROOT, f), { recursive: true });
  }
};

const ensureDummyImages = async () => {
  for (const img of DUMMY_IMAGES) {
    const source = path.join(SEED_IMAGES, img);

    const original = path.join(UPLOAD_ROOT, "original", img);
    const thumb = path.join(UPLOAD_ROOT, "thumb", img);
    const medium = path.join(UPLOAD_ROOT, "medium", img);
    const large = path.join(UPLOAD_ROOT, "large", img);

    try {
      await fs.access(original);
      continue;
    } catch {}

    await fs.copyFile(source, original);
    await sharp(original).resize(200).toFile(thumb);
    await sharp(original).resize(600).toFile(medium);
    await sharp(original).resize(1200).toFile(large);
  }
};

/* ===========================
   IMAGE URL FACTORY
=========================== */

const getLocalImageUrls = (img: string) => ({
  originalUrl: `/uploads/products/original/${img}`,
  thumbUrl: `/uploads/products/thumb/${img}`,
  mediumUrl: `/uploads/products/medium/${img}`,
  largeUrl: `/uploads/products/large/${img}`,
  publicId: null,
});

/**
 * 🔥 CDN CACHE
 * Aynı dummy image CDN'e SADECE 1 KERE yüklenir
 */
const cloudinaryCache = new Map<string, any>();

const uploadToCloudinary = async (img: string) => {
  if (cloudinaryCache.has(img)) {
    return cloudinaryCache.get(img);
  }

  const source = path.join(SEED_IMAGES, img);

  const result = await cloudinary.uploader.upload(source, {
    folder: "products",
  });

  const data = {
    originalUrl: result.secure_url,
    thumbUrl: cloudinary.url(result.public_id, { width: 200, crop: "scale" }),
    mediumUrl: cloudinary.url(result.public_id, { width: 600, crop: "scale" }),
    largeUrl: cloudinary.url(result.public_id, { width: 1200, crop: "scale" }),
    publicId: result.public_id,
  };

  cloudinaryCache.set(img, data);
  return data;
};

const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedProducts = async () => {
  console.log(
    `🌱 Seeding products (${isProd ? "PROD / CDN" : "LOCAL / DISK"})`
  );

  if (!isProd) {
    await ensureUploadFolders();
    await ensureDummyImages();
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  // 🔥 DEFAULT CURRENCY = TRY
  const tryCurrency = await prisma.currency.findUnique({
    where: { code: "TRY" },
  });

  if (!tryCurrency) {
    throw new Error("❌ TRY currency not found. Run seedCurrencies first.");
  }

  const leafCategories = categories.filter(
    (c) => !categories.some((x) => x.parentId === c.id)
  );

  for (const category of leafCategories) {
    for (let i = 0; i < 10; i++) {
      const brand = rand(brands);

      const product = await prisma.product.create({
        data: {
          name: `${brand.name} ${category.name} ${i + 1}`,
          description: `${brand.name} ${category.name} product`,
          stockCount: Math.floor(Math.random() * 100) + 1,
          price: Math.floor(Math.random() * 45000) + 3000,
          brandId: brand.id,
          categoryId: category.id,
          currencyId: tryCurrency.id, // ✅ DEFAULT TRY
        },
      });

      for (let j = 0; j < DUMMY_IMAGES.length; j++) {
        const imageData = isProd
          ? await uploadToCloudinary(DUMMY_IMAGES[j])
          : getLocalImageUrls(DUMMY_IMAGES[j]);

        await prisma.productImage.create({
          data: {
            productId: product.id,
            ...imageData,
            isPrimary: j === 0,
          },
        });
      }
    }
  }

  console.log("✅ Product seeding completed");
};
