import { PRODUCT_STATUS, USER_ROLE } from "@prisma/client";
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

/**
 * 🔥 Her product için unique image üretir
 * base dummy image’ı kopyalar ama dosya adını benzersiz yapar
 */
const createProductImages = async (
  baseImg: string,
  productId: number,
  index: number,
) => {
  const imageNumber = index + 1;
  const uniqueName = `product-${productId}-${imageNumber}.jpg`;
  const source = path.join(SEED_IMAGES, baseImg);

  const original = path.join(UPLOAD_ROOT, "original", uniqueName);
  const thumb = path.join(UPLOAD_ROOT, "thumb", uniqueName);
  const medium = path.join(UPLOAD_ROOT, "medium", uniqueName);
  const large = path.join(UPLOAD_ROOT, "large", uniqueName);

  await fs.copyFile(source, original);
  await sharp(original).resize(200).toFile(thumb);
  await sharp(original).resize(600).toFile(medium);
  await sharp(original).resize(1200).toFile(large);

  return {
    originalUrl: `/uploads/products/original/${uniqueName}`,
    thumbUrl: `/uploads/products/thumb/${uniqueName}`,
    mediumUrl: `/uploads/products/medium/${uniqueName}`,
    largeUrl: `/uploads/products/large/${uniqueName}`,
    publicId: null,
  };
};

/* ===========================
   CLOUDINARY
=========================== */

const cloudinaryCache = new Map<string, any>();

const uploadToCloudinary = async (
  img: string,
  productId: number,
  index: number,
) => {
  const imageNumber = index + 1;
  const cacheKey = `${img}-${productId}-${imageNumber}`;

  if (cloudinaryCache.has(cacheKey)) {
    return cloudinaryCache.get(cacheKey);
  }

  const source = path.join(SEED_IMAGES, img);

  const result = await cloudinary.uploader.upload(source, {
    folder: "products",
    public_id: `product-${productId}-${imageNumber}`,
  });

  const data = {
    originalUrl: result.secure_url,
    thumbUrl: cloudinary.url(result.public_id, { width: 200, crop: "scale" }),
    mediumUrl: cloudinary.url(result.public_id, { width: 600, crop: "scale" }),
    largeUrl: cloudinary.url(result.public_id, { width: 1200, crop: "scale" }),
    publicId: result.public_id,
  };

  cloudinaryCache.set(cacheKey, data);
  return data;
};

const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedProducts = async () => {
  console.log(
    `🌱 Seeding products (${isProd ? "PROD / CDN" : "LOCAL / DISK"})`,
  );

  if (!isProd) {
    await ensureUploadFolders();
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  const defaultCurrency = await prisma.currency.findUnique({
    where: { code: "TRY" },
  });

  if (!defaultCurrency) {
    throw new Error("❌ Default currency not found. Run seedCurrencies first.");
  }

  const sellers = await prisma.user.findMany({
    where: { role: USER_ROLE.SELLER },
    select: { id: true },
  });

  if (!sellers.length) {
    throw new Error("❌ No sellers found. Run seedUsers first.");
  }

  const sellerIds = sellers.map((s) => s.id);

  const leafCategories = categories.filter(
    (c) => !categories.some((x) => x.parentId === c.id),
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
          currencyId: defaultCurrency.id,
          sellerId: rand(sellerIds),
          status: PRODUCT_STATUS.APPROVED,
        },
      });

      // 🔥 Her product için 4 farklı fiziksel image oluştur
      for (let j = 0; j < DUMMY_IMAGES.length; j++) {
        const imageData = isProd
          ? await uploadToCloudinary(DUMMY_IMAGES[j], product.id, j)
          : await createProductImages(DUMMY_IMAGES[j], product.id, j);

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
