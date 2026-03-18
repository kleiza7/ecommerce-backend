import { PRODUCT_STATUS, USER_ROLE } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import cloudinary from "../../config/cloudinary";
import { prisma } from "../../config/prisma";

const isProd = process.env.NODE_ENV === "production";

const SEED_IMAGES = path.join(__dirname, "..", "assets");
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads", "products");

const DUMMY_IMAGES = ["1.webp", "2.webp", "3.webp", "4.webp"] as const;

const ensureUploadFolders = async () => {
  for (const folderName of ["original", "thumb", "medium", "large"]) {
    await fs.mkdir(path.join(UPLOAD_ROOT, folderName), { recursive: true });
  }
};

const createProductImages = async (
  baseImg: string,
  productId: number,
  index: number,
) => {
  const imageNumber = index + 1;
  const uniqueName = `product-${productId}-${imageNumber}.webp`;

  const source = path.join(SEED_IMAGES, baseImg);

  const original = path.join(UPLOAD_ROOT, "original", uniqueName);
  const thumb = path.join(UPLOAD_ROOT, "thumb", uniqueName);
  const medium = path.join(UPLOAD_ROOT, "medium", uniqueName);
  const large = path.join(UPLOAD_ROOT, "large", uniqueName);

  await fs.copyFile(source, original);

  const image = sharp(original);

  await Promise.all([
    image.clone().resize(200).toFile(thumb),
    image.clone().resize(600).toFile(medium),
    image.clone().resize(1200).toFile(large),
  ]);

  return {
    originalUrl: `/uploads/products/original/${uniqueName}`,
    thumbUrl: `/uploads/products/thumb/${uniqueName}`,
    mediumUrl: `/uploads/products/medium/${uniqueName}`,
    largeUrl: `/uploads/products/large/${uniqueName}`,
    publicId: null as string | null,
  };
};

type CloudinaryImageData = {
  originalUrl: string;
  thumbUrl: string;
  mediumUrl: string;
  largeUrl: string;
  publicId: string;
};

const cloudinaryCache = new Map<string, CloudinaryImageData>();

const uploadToCloudinary = async (
  image: string,
  productId: number,
  index: number,
) => {
  const imageNumber = index + 1;
  const cacheKey = `${image}-${productId}-${imageNumber}`;

  if (cloudinaryCache.has(cacheKey)) {
    return cloudinaryCache.get(cacheKey)!;
  }

  const source = path.join(SEED_IMAGES, image);

  const result = await cloudinary.uploader.upload(source, {
    folder: "products",
    public_id: `product-${productId}-${imageNumber}`,
  });

  const data: CloudinaryImageData = {
    originalUrl: result.secure_url,
    thumbUrl: cloudinary.url(result.public_id, { width: 200, crop: "scale" }),
    mediumUrl: cloudinary.url(result.public_id, { width: 600, crop: "scale" }),
    largeUrl: cloudinary.url(result.public_id, { width: 1200, crop: "scale" }),
    publicId: result.public_id,
  };

  cloudinaryCache.set(cacheKey, data);

  return data;
};

const rand = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randFrom = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

const toTryPriceStringEndingWith90 = (min: number, max: number) => {
  const value = randFrom(min, max);
  const integerPart = Math.max(1, Math.floor(value));
  return `${integerPart}.90`;
};

const joinSentences = (sentences: string[]) => {
  return sentences.filter(Boolean).join(" ");
};

type ProductPriceRange = { priceMin: number; priceMax: number };
type ProductTypeConfig = {
  typeKey: string;
  priceMin: number;
  priceMax: number;
};

type RealCatalogItem = {
  brandName: string;
  modelName: string;
  seedOrder: number;
};

export const REAL_PRODUCTS_BY_TYPE: Record<string, RealCatalogItem[]> = {
  // ELECTRONICS
  "electronics-phones-iphones": [
    // iPhone 17 (premium first)
    { brandName: "Apple", modelName: "iPhone 17 Pro Max 2TB", seedOrder: 0 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 Pro Max 1TB", seedOrder: 3 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 Pro Max 512GB", seedOrder: 7 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 Pro Max 256GB", seedOrder: 11 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 Pro 1TB", seedOrder: 15 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 Pro 512GB", seedOrder: 19 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 Pro 256GB", seedOrder: 23 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 512GB", seedOrder: 31 }, // 4
    { brandName: "Apple", modelName: "iPhone 17 256GB", seedOrder: 35 }, // 4

    // iPhone 16
    { brandName: "Apple", modelName: "iPhone 16 Pro Max 512GB", seedOrder: 27 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 Pro Max 256GB", seedOrder: 39 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 Pro 256GB", seedOrder: 43 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 Pro 128GB", seedOrder: 47 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 Plus 256GB", seedOrder: 51 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 Plus 128GB", seedOrder: 59 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 256GB", seedOrder: 63 }, // 4
    { brandName: "Apple", modelName: "iPhone 16 128GB", seedOrder: 67 }, // 4

    // iPhone 15
    { brandName: "Apple", modelName: "iPhone 15 Pro Max 512GB", seedOrder: 55 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 Pro Max 256GB", seedOrder: 71 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 Pro 256GB", seedOrder: 75 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 Pro 128GB", seedOrder: 79 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 Plus 256GB", seedOrder: 83 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 Plus 128GB", seedOrder: 87 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 256GB", seedOrder: 91 }, // 4
    { brandName: "Apple", modelName: "iPhone 15 128GB", seedOrder: 99 }, // 4

    // iPhone 14 (keep premium variants)
    { brandName: "Apple", modelName: "iPhone 14 Pro Max 512GB", seedOrder: 95 }, // 4
    {
      brandName: "Apple",
      modelName: "iPhone 14 Pro Max 256GB",
      seedOrder: 103,
    }, // 4
    { brandName: "Apple", modelName: "iPhone 14 Pro 256GB", seedOrder: 107 }, // 4
  ],

  "electronics-phones-android-phones": [
    // Samsung (premium + current)
    { brandName: "Samsung", modelName: "Galaxy S24 Ultra 512GB", seedOrder: 4 }, // 4
    { brandName: "Samsung", modelName: "Galaxy S24+ 512GB", seedOrder: 12 }, // 4
    { brandName: "Samsung", modelName: "Galaxy S24 256GB", seedOrder: 20 }, // 4
    {
      brandName: "Samsung",
      modelName: "Galaxy S23 Ultra 512GB",
      seedOrder: 28,
    }, // 4
    { brandName: "Samsung", modelName: "Galaxy S23 256GB", seedOrder: 36 }, // 4
    { brandName: "Samsung", modelName: "Galaxy Z Fold6 512GB", seedOrder: 44 }, // 4
    { brandName: "Samsung", modelName: "Galaxy Z Flip6 256GB", seedOrder: 52 }, // 4
    { brandName: "Samsung", modelName: "Galaxy Z Fold5 512GB", seedOrder: 60 }, // 4
    { brandName: "Samsung", modelName: "Galaxy Z Flip5 256GB", seedOrder: 68 }, // 4
    { brandName: "Samsung", modelName: "Galaxy A55 256GB", seedOrder: 76 }, // 3
    { brandName: "Samsung", modelName: "Galaxy A25 128GB", seedOrder: 84 }, // 3

    // Google Pixel
    { brandName: "Google", modelName: "Pixel 8 Pro 256GB", seedOrder: 92 }, // 3
    { brandName: "Google", modelName: "Pixel 8 128GB", seedOrder: 100 }, // 3
    { brandName: "Google", modelName: "Pixel 7a 128GB", seedOrder: 108 }, // 3

    // Xiaomi / Redmi
    { brandName: "Xiaomi", modelName: "Xiaomi 14 Ultra 512GB", seedOrder: 116 }, // 3
    { brandName: "Xiaomi", modelName: "Xiaomi 14 256GB", seedOrder: 124 }, // 3
    { brandName: "Xiaomi", modelName: "Xiaomi 13T Pro 512GB", seedOrder: 132 }, // 3
    { brandName: "Xiaomi", modelName: "Xiaomi 13 256GB", seedOrder: 140 }, // 3
    {
      brandName: "Xiaomi",
      modelName: "Redmi Note 13 Pro+ 512GB",
      seedOrder: 148,
    }, // 3
    {
      brandName: "Xiaomi",
      modelName: "Redmi Note 13 Pro 256GB",
      seedOrder: 156,
    }, // 3

    // Motorola
    { brandName: "Motorola", modelName: "Edge 50 Pro 512GB", seedOrder: 164 }, // 3

    // Sony
    { brandName: "Sony", modelName: "Xperia 1 V 256GB", seedOrder: 172 }, // 3
    { brandName: "Sony", modelName: "Xperia 5 V 128GB", seedOrder: 180 }, // 3

    // ASUS
    { brandName: "ASUS", modelName: "ROG Phone 7 512GB", seedOrder: 188 }, // 3
    { brandName: "ASUS", modelName: "Zenfone 10 256GB", seedOrder: 196 }, // 3

    // OPPO
    { brandName: "OPPO", modelName: "Find X5 Pro 256GB", seedOrder: 204 }, // 3
    { brandName: "OPPO", modelName: "Reno10 Pro 256GB", seedOrder: 212 }, // 3

    // Huawei
    { brandName: "Huawei", modelName: "P60 Pro 256GB", seedOrder: 220 }, // 3
  ],

  "electronics-phones-feature-phones": [
    { brandName: "Nokia", modelName: "Nokia 105 (2023)", seedOrder: 372 }, // 2
    { brandName: "Nokia", modelName: "Nokia 106 4G", seedOrder: 384 }, // 2
    { brandName: "Nokia", modelName: "Nokia 110 4G (2023)", seedOrder: 396 }, // 2
    { brandName: "Nokia", modelName: "Nokia 150 (2023)", seedOrder: 408 }, // 2
    {
      brandName: "Samsung",
      modelName: "Samsung Guru Music 2 (SM-B310E)",
      seedOrder: 420,
    }, // 2
    {
      brandName: "Samsung",
      modelName: "Samsung Guru 1200 (GT-E1200)",
      seedOrder: 432,
    }, // 2
  ],

  "electronics-laptops-gaming-laptops": [
    { brandName: "ASUS", modelName: "ROG Strix G16 (2024)", seedOrder: 29 }, // 4
    { brandName: "ASUS", modelName: "ROG Zephyrus G14 (2024)", seedOrder: 41 }, // 4
    { brandName: "ASUS", modelName: "TUF Gaming A15 (2024)", seedOrder: 153 }, // 3
    { brandName: "Lenovo", modelName: "Legion 5 Pro (16ACH6H)", seedOrder: 53 }, // 4
    { brandName: "Lenovo", modelName: "Legion 7 (16ACHg6)", seedOrder: 65 }, // 4
    { brandName: "Lenovo", modelName: "LOQ 15IRH8", seedOrder: 161 }, // 3
    { brandName: "HP", modelName: "OMEN 16 (2024)", seedOrder: 77 }, // 4
    { brandName: "HP", modelName: "Victus 16 (2024)", seedOrder: 169 }, // 3
    { brandName: "Dell", modelName: "Alienware m16 R2", seedOrder: 89 }, // 4
    { brandName: "Dell", modelName: "G15 5530", seedOrder: 177 }, // 3
    {
      brandName: "Acer",
      modelName: "Predator Helios Neo 16 (PHN16-71)",
      seedOrder: 101,
    }, // 4
    { brandName: "Acer", modelName: "Nitro 16 (AN16-41)", seedOrder: 185 }, // 3
    { brandName: "MSI", modelName: "Katana 15 B13V", seedOrder: 193 }, // 3
    { brandName: "MSI", modelName: "Stealth 16 Studio A13V", seedOrder: 113 }, // 4
  ],

  "electronics-laptops-ultrabooks": [
    {
      brandName: "Apple",
      modelName: "MacBook Pro (M3, 2023) 14-inch",
      seedOrder: 8,
    }, // 4
    {
      brandName: "Apple",
      modelName: "MacBook Air (M3, 2024) 15-inch",
      seedOrder: 16,
    }, // 4
    {
      brandName: "Apple",
      modelName: "MacBook Air (M2, 2022) 13-inch",
      seedOrder: 24,
    }, // 4
    { brandName: "Dell", modelName: "XPS 14 (9440)", seedOrder: 32 }, // 4
    { brandName: "Dell", modelName: "XPS 13 (9315)", seedOrder: 40 }, // 4
    { brandName: "HP", modelName: "Spectre x360 14 (2024)", seedOrder: 48 }, // 4
    { brandName: "HP", modelName: "Envy x360 14 (2024)", seedOrder: 201 }, // 3
    { brandName: "Lenovo", modelName: "Yoga 9i 14 (2024)", seedOrder: 56 }, // 4
    { brandName: "Lenovo", modelName: "Yoga Slim 7 (14IMH9)", seedOrder: 209 }, // 3
    { brandName: "ASUS", modelName: "Zenbook 14 OLED (UX3405)", seedOrder: 64 }, // 4
    {
      brandName: "ASUS",
      modelName: "Zenbook S 13 OLED (UX5304)",
      seedOrder: 72,
    }, // 4
    { brandName: "Acer", modelName: "Swift X 14 (SFX14-71G)", seedOrder: 217 }, // 3
    { brandName: "Acer", modelName: "Swift Go 14 (SFG14-71)", seedOrder: 225 }, // 3
    {
      brandName: "Microsoft",
      modelName: "Surface Laptop 6 (13.5-inch)",
      seedOrder: 80,
    }, // 4
    { brandName: "Samsung", modelName: "Galaxy Book4 Pro 14", seedOrder: 233 }, // 3
  ],

  "electronics-laptops-business-laptops": [
    { brandName: "Lenovo", modelName: "ThinkPad T14 Gen 5", seedOrder: 88 }, // 4
    {
      brandName: "Lenovo",
      modelName: "ThinkPad X1 Carbon Gen 12",
      seedOrder: 96,
    }, // 4
    {
      brandName: "Lenovo",
      modelName: "ThinkPad X1 Yoga Gen 8",
      seedOrder: 104,
    }, // 4
    { brandName: "HP", modelName: "EliteBook 840 G11", seedOrder: 112 }, // 4
    { brandName: "HP", modelName: "ProBook 450 G10", seedOrder: 241 }, // 3
    { brandName: "HP", modelName: "ZBook Firefly 14 G10", seedOrder: 120 }, // 4
    { brandName: "Dell", modelName: "Latitude 7440", seedOrder: 128 }, // 4
    { brandName: "Dell", modelName: "Latitude 5440", seedOrder: 249 }, // 3
    { brandName: "Dell", modelName: "Precision 5680", seedOrder: 136 }, // 4
    {
      brandName: "Microsoft",
      modelName: "Surface Laptop 6 (15-inch)",
      seedOrder: 144,
    }, // 4
    { brandName: "ASUS", modelName: "ExpertBook B5 (B5404)", seedOrder: 257 }, // 3
    {
      brandName: "Acer",
      modelName: "TravelMate P4 (TMP414-53)",
      seedOrder: 265,
    }, // 3
  ],

  "electronics-tablets": [
    {
      brandName: "Apple",
      modelName: "iPad Pro 11-inch (M4, 2024) 256GB",
      seedOrder: 152,
    }, // 4
    {
      brandName: "Apple",
      modelName: "iPad Air 11-inch (M2) 128GB",
      seedOrder: 160,
    }, // 4
    { brandName: "Apple", modelName: "iPad 10th Gen 64GB", seedOrder: 273 }, // 3
    {
      brandName: "Samsung",
      modelName: "Galaxy Tab S9 FE 128GB",
      seedOrder: 281,
    }, // 3
    { brandName: "Lenovo", modelName: "Lenovo Tab P12 128GB", seedOrder: 289 }, // 3
    { brandName: "Xiaomi", modelName: "Xiaomi Pad 6 256GB", seedOrder: 297 }, // 3
  ],

  "electronics-smart-watches": [
    { brandName: "Apple", modelName: "Apple Watch Ultra 2", seedOrder: 168 }, // 4
    { brandName: "Apple", modelName: "Apple Watch Ultra", seedOrder: 176 }, // 4
    {
      brandName: "Samsung",
      modelName: "Galaxy Watch6 Classic (47mm)",
      seedOrder: 305,
    }, // 3
    { brandName: "Samsung", modelName: "Galaxy Watch6 (44mm)", seedOrder: 313 }, // 3
    { brandName: "Samsung", modelName: "Galaxy Watch5 Pro", seedOrder: 321 }, // 3
    {
      brandName: "Huawei",
      modelName: "Huawei Watch GT 4 (46mm)",
      seedOrder: 329,
    }, // 3
  ],

  "electronics-headphones": [
    { brandName: "Sony", modelName: "WH-1000XM5", seedOrder: 184 }, // 4
    { brandName: "Sony", modelName: "WF-1000XM5", seedOrder: 192 }, // 4
    { brandName: "Sony", modelName: "WH-1000XM4", seedOrder: 200 }, // 4
    {
      brandName: "Apple",
      modelName: "AirPods Pro (2nd generation)",
      seedOrder: 208,
    }, // 4
    { brandName: "Apple", modelName: "AirPods Max", seedOrder: 216 }, // 4
    {
      brandName: "Apple",
      modelName: "AirPods (3rd generation)",
      seedOrder: 337,
    }, // 3
    {
      brandName: "Apple",
      modelName: "AirPods (2nd generation)",
      seedOrder: 345,
    }, // 3
    { brandName: "Samsung", modelName: "Galaxy Buds2 Pro", seedOrder: 353 }, // 3
    { brandName: "Samsung", modelName: "Galaxy Buds2", seedOrder: 361 }, // 3
    { brandName: "Huawei", modelName: "FreeBuds Pro 3", seedOrder: 369 }, // 3
    { brandName: "JBL", modelName: "Live Pro 2", seedOrder: 377 }, // 3
    { brandName: "JBL", modelName: "Tune 760NC", seedOrder: 385 }, // 3
    { brandName: "SteelSeries", modelName: "Arctis Nova 7", seedOrder: 393 }, // 3
    {
      brandName: "Logitech",
      modelName: "G PRO X 2 LIGHTSPEED",
      seedOrder: 401,
    }, // 3
  ],

  "electronics-monitors": [
    {
      brandName: "Samsung",
      modelName: "Odyssey G7 32-inch (LC32G75TQSNXZA)",
      seedOrder: 224,
    }, // 4
    {
      brandName: "Samsung",
      modelName: "Odyssey G5 27-inch (LC27G55TQWNXZA)",
      seedOrder: 415,
    }, // 3
    {
      brandName: "Samsung",
      modelName: "ViewFinity S8 27-inch 4K (S27B800)",
      seedOrder: 423,
    }, // 3
    { brandName: "LG", modelName: "UltraGear 27GP850-B", seedOrder: 431 }, // 3
    { brandName: "LG", modelName: "27UP850-W", seedOrder: 437 }, // 3
    { brandName: "Dell", modelName: "Dell S2721DGF", seedOrder: 407 }, // 3
    { brandName: "Dell", modelName: "Dell P2723D", seedOrder: 399 }, // 3
    { brandName: "ASUS", modelName: "ProArt PA278CV", seedOrder: 391 }, // 3
    { brandName: "ASUS", modelName: "TUF Gaming VG27AQ", seedOrder: 383 }, // 3
    { brandName: "MSI", modelName: "MAG 274QRF-QD", seedOrder: 375 }, // 3
    { brandName: "Acer", modelName: "Nitro XV272U", seedOrder: 367 }, // 3
    { brandName: "Philips", modelName: "27E1N5600HE", seedOrder: 429 }, // 2
  ],

  "electronics-gaming-consoles": [
    {
      brandName: "Sony",
      modelName: "PlayStation 5 Slim (Standard Edition)",
      seedOrder: 232,
    }, // 4
    {
      brandName: "Sony",
      modelName: "PlayStation 5 Slim (Digital Edition)",
      seedOrder: 240,
    }, // 4
    {
      brandName: "Sony",
      modelName: "PlayStation 5 (Standard Edition)",
      seedOrder: 248,
    }, // 4
    { brandName: "Microsoft", modelName: "Xbox Series X", seedOrder: 256 }, // 4
    {
      brandName: "Microsoft",
      modelName: "Xbox Series S (1TB)",
      seedOrder: 264,
    }, // 4
    {
      brandName: "Microsoft",
      modelName: "Xbox Series S (512GB)",
      seedOrder: 413,
    }, // 3
    { brandName: "Sony", modelName: "PlayStation 4 Pro", seedOrder: 405 }, // 3
    { brandName: "Sony", modelName: "PlayStation 4 Slim", seedOrder: 397 }, // 3
    { brandName: "Microsoft", modelName: "Xbox One X", seedOrder: 389 }, // 3
    { brandName: "Microsoft", modelName: "Xbox One S", seedOrder: 381 }, // 3
  ],

  // FASHION
  "fashion-women-dresses": [
    { brandName: "Zara", modelName: "Satin Effect Midi Dress", seedOrder: 229 }, // 3
    { brandName: "Mango", modelName: "Pleated Midi Dress", seedOrder: 237 }, // 3
    { brandName: "Calvin Klein", modelName: "Sheath Dress", seedOrder: 14 }, // 4
    {
      brandName: "Tommy Hilfiger",
      modelName: "Belted Shirt Dress",
      seedOrder: 22,
    }, // 4
    { brandName: "H&M", modelName: "Rib-knit Bodycon Dress", seedOrder: 245 }, // 3
    {
      brandName: "Massimo Dutti",
      modelName: "Linen Blend Wrap Dress",
      seedOrder: 253,
    }, // 3
    { brandName: "Guess", modelName: "Logo Belted Mini Dress", seedOrder: 261 }, // 3
    {
      brandName: "COS",
      modelName: "A-Line Cotton Poplin Dress",
      seedOrder: 269,
    }, // 3
  ],

  "fashion-women-t-shirts": [
    {
      brandName: "Nike",
      modelName: "Sportswear Essential Women's T-Shirt",
      seedOrder: 10,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "Essentials Slim Logo Tee (Women)",
      seedOrder: 18,
    }, // 4
    {
      brandName: "Puma",
      modelName: "Essentials Logo Tee (Women)",
      seedOrder: 277,
    }, // 3
    {
      brandName: "Reebok",
      modelName: "Identity Cotton Tee (Women)",
      seedOrder: 285,
    }, // 3
    {
      brandName: "Under Armour",
      modelName: "Sportstyle Graphic T-Shirt (Women)",
      seedOrder: 293,
    }, // 3
    { brandName: "H&M", modelName: "Slim Fit Ribbed Top", seedOrder: 411 }, // 2
    {
      brandName: "Zara",
      modelName: "Basic Cotton T-Shirt (Women)",
      seedOrder: 301,
    }, // 3
    { brandName: "Mango", modelName: "Organic Cotton T-Shirt", seedOrder: 309 }, // 3
    {
      brandName: "Calvin Klein",
      modelName: "Modern Cotton Logo Tee (Women)",
      seedOrder: 26,
    }, // 4
    {
      brandName: "Tommy Hilfiger",
      modelName: "Flag Crew Neck Tee (Women)",
      seedOrder: 34,
    }, // 4
    {
      brandName: "Levi's",
      modelName: "The Perfect Tee (Women)",
      seedOrder: 317,
    }, // 3
  ],

  "fashion-women-jeans": [
    {
      brandName: "Levi's",
      modelName: "501 Original Fit Jeans (Women)",
      seedOrder: 42,
    }, // 4
    { brandName: "Levi's", modelName: "Wedgie Straight Jeans", seedOrder: 325 }, // 3
    {
      brandName: "Levi's",
      modelName: "Ribcage Straight Ankle Jeans",
      seedOrder: 333,
    }, // 3
    {
      brandName: "Calvin Klein",
      modelName: "High Rise Straight Jeans (Women)",
      seedOrder: 50,
    }, // 4
    {
      brandName: "Tommy Hilfiger",
      modelName: "Como Slim Fit Jeans (Women)",
      seedOrder: 58,
    }, // 4
    { brandName: "Mango", modelName: "Mom Fit Jeans (Women)", seedOrder: 341 }, // 3
    {
      brandName: "Zara",
      modelName: "Straight Fit Full Length Jeans (Women)",
      seedOrder: 349,
    }, // 3
    { brandName: "H&M", modelName: "Slim High Jeans", seedOrder: 419 }, // 2
    { brandName: "H&M", modelName: "Wide High Jeans", seedOrder: 427 }, // 2
    {
      brandName: "Guess",
      modelName: "Sexy Curve Skinny Jeans",
      seedOrder: 357,
    }, // 3
    {
      brandName: "Massimo Dutti",
      modelName: "High Waist Straight Jeans",
      seedOrder: 365,
    }, // 3
    {
      brandName: "Diesel",
      modelName: "Diesel D-Slandy Skinny Jeans",
      seedOrder: 66,
    }, // 4
  ],

  "fashion-women-shoes": [
    { brandName: "Zara", modelName: "Leather Loafers (Women)", seedOrder: 373 }, // 3
    {
      brandName: "Mango",
      modelName: "Heeled Ankle Boots (Women)",
      seedOrder: 381,
    }, // 3
    {
      brandName: "Calvin Klein",
      modelName: "Leather Pump Heels",
      seedOrder: 74,
    }, // 4
    {
      brandName: "Tommy Hilfiger",
      modelName: "Leather Ballet Flats",
      seedOrder: 82,
    }, // 4
    { brandName: "H&M", modelName: "Block-heel Sandals", seedOrder: 435 }, // 2
    {
      brandName: "Birkenstock",
      modelName: "Arizona Birko-Flor",
      seedOrder: 389,
    }, // 3
    {
      brandName: "Nine West",
      modelName: "Tatiana Pointy Toe Pump",
      seedOrder: 397,
    }, // 3
    { brandName: "Nike", modelName: "Air Force 1 '07 (Women)", seedOrder: 6 }, // 4
    { brandName: "Adidas", modelName: "Samba OG (Women)", seedOrder: 38 }, // 4
  ],

  "fashion-men-t-shirts": [
    {
      brandName: "Nike",
      modelName: "Sportswear Club T-Shirt (Men)",
      seedOrder: 46,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "Essentials Small Logo Tee (Men)",
      seedOrder: 54,
    }, // 4
    { brandName: "Puma", modelName: "ESS Logo Tee (Men)", seedOrder: 405 }, // 3
    {
      brandName: "Reebok",
      modelName: "Identity T-Shirt (Men)",
      seedOrder: 413,
    }, // 3
    {
      brandName: "Under Armour",
      modelName: "Sportstyle Left Chest T-Shirt (Men)",
      seedOrder: 421,
    }, // 3
    {
      brandName: "H&M",
      modelName: "Regular Fit Cotton T-Shirt (Men)",
      seedOrder: 433,
    }, // 2
    {
      brandName: "Zara",
      modelName: "Basic Cotton T-Shirt (Men)",
      seedOrder: 429,
    }, // 3
    {
      brandName: "Calvin Klein",
      modelName: "Monogram Logo Tee (Men)",
      seedOrder: 62,
    }, // 4
    {
      brandName: "Tommy Hilfiger",
      modelName: "Essential Flag T-Shirt (Men)",
      seedOrder: 70,
    }, // 4
    { brandName: "Levi's", modelName: "Housemark Tee (Men)", seedOrder: 379 }, // 3
    {
      brandName: "Uniqlo",
      modelName: "AIRism Cotton Crew Neck T-Shirt (Men)",
      seedOrder: 371,
    }, // 3
    {
      brandName: "The North Face",
      modelName: "Simple Dome Tee",
      seedOrder: 363,
    }, // 3
  ],

  "fashion-men-shirts": [
    {
      brandName: "Tommy Hilfiger",
      modelName: "Oxford Regular Fit Shirt (Men)",
      seedOrder: 78,
    }, // 4
    {
      brandName: "Calvin Klein",
      modelName: "Slim Fit Poplin Shirt (Men)",
      seedOrder: 86,
    }, // 4
    {
      brandName: "Zara",
      modelName: "Textured Cotton Shirt (Men)",
      seedOrder: 355,
    }, // 3
    { brandName: "H&M", modelName: "Easy Iron Shirt (Men)", seedOrder: 425 }, // 2
    {
      brandName: "Mango",
      modelName: "Regular Fit Linen Shirt (Men)",
      seedOrder: 347,
    }, // 3
    {
      brandName: "Levi's",
      modelName: "Battery Housemark Shirt",
      seedOrder: 339,
    }, // 3
    {
      brandName: "Massimo Dutti",
      modelName: "Cotton Twill Shirt (Men)",
      seedOrder: 331,
    }, // 3
    {
      brandName: "Brooks Brothers",
      modelName: "Regent Fit Dress Shirt",
      seedOrder: 323,
    }, // 3
    {
      brandName: "Ralph Lauren",
      modelName: "Custom Fit Oxford Shirt",
      seedOrder: 94,
    }, // 4
    {
      brandName: "Ralph Lauren",
      modelName: "Classic Fit Poplin Shirt",
      seedOrder: 102,
    }, // 4
  ],

  "fashion-men-jeans": [
    {
      brandName: "Levi's",
      modelName: "511 Slim Fit Jeans (Men)",
      seedOrder: 110,
    }, // 4
    {
      brandName: "Levi's",
      modelName: "512 Slim Taper Jeans (Men)",
      seedOrder: 315,
    }, // 3
    {
      brandName: "Levi's",
      modelName: "505 Regular Fit Jeans (Men)",
      seedOrder: 307,
    }, // 3
    {
      brandName: "Calvin Klein",
      modelName: "Slim Straight Jeans (Men)",
      seedOrder: 118,
    }, // 4
    {
      brandName: "Tommy Hilfiger",
      modelName: "Bleecker Slim Jeans (Men)",
      seedOrder: 126,
    }, // 4
    {
      brandName: "Diesel",
      modelName: "Diesel D-Strukt Slim Jeans",
      seedOrder: 134,
    }, // 4
    { brandName: "G-Star RAW", modelName: "3301 Slim Jeans", seedOrder: 299 }, // 3
    { brandName: "Wrangler", modelName: "Larston Slim Jeans", seedOrder: 291 }, // 3
    { brandName: "Lee", modelName: "Luke Slim Tapered Jeans", seedOrder: 283 }, // 3
    {
      brandName: "Levi's",
      modelName: "501 Original Fit Jeans (Men)",
      seedOrder: 142,
    }, // 4
  ],

  "fashion-men-sneakers": [
    { brandName: "Nike", modelName: "Air Force 1 '07", seedOrder: 2 }, // 4
    { brandName: "Nike", modelName: "Air Max 90", seedOrder: 30 }, // 4
    { brandName: "Nike", modelName: "Dunk Low", seedOrder: 114 }, // 4
    { brandName: "Adidas", modelName: "Stan Smith", seedOrder: 122 }, // 4
    { brandName: "Adidas", modelName: "Forum Low", seedOrder: 130 }, // 4
    { brandName: "Adidas", modelName: "Gazelle", seedOrder: 138 }, // 4
    { brandName: "Puma", modelName: "Suede Classic XXI", seedOrder: 275 }, // 3
    { brandName: "Reebok", modelName: "Classic Leather", seedOrder: 267 }, // 3
    { brandName: "New Balance", modelName: "574", seedOrder: 259 }, // 3
    { brandName: "New Balance", modelName: "550", seedOrder: 251 }, // 3
    {
      brandName: "Converse",
      modelName: "Chuck Taylor All Star Low Top",
      seedOrder: 243,
    }, // 3
  ],

  "fashion-kids-boys-clothing": [
    {
      brandName: "Nike",
      modelName: "Kids Sportswear Futura Tee",
      seedOrder: 146,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "Kids Essentials 3-Stripes Hoodie",
      seedOrder: 154,
    }, // 4
    {
      brandName: "Puma",
      modelName: "Kids Essentials Logo Tee",
      seedOrder: 235,
    }, // 3
    { brandName: "H&M", modelName: "Boys 2-piece Printed Set", seedOrder: 417 }, // 2
    {
      brandName: "Zara",
      modelName: "Boys Cotton Matching Set",
      seedOrder: 227,
    }, // 3
    { brandName: "Mango", modelName: "Boys Jogger Pants", seedOrder: 219 }, // 3
    {
      brandName: "Under Armour",
      modelName: "Boys Rival Fleece Hoodie",
      seedOrder: 211,
    }, // 3
    { brandName: "Reebok", modelName: "Kids Vector T-Shirt", seedOrder: 203 }, // 3
    {
      brandName: "The North Face",
      modelName: "Youth Simple Dome Tee",
      seedOrder: 195,
    }, // 3
    { brandName: "Nike", modelName: "Kids Club Fleece Hoodie", seedOrder: 162 }, // 4
  ],

  "fashion-kids-girls-clothing": [
    {
      brandName: "Nike",
      modelName: "Girls Sportswear Club Tee",
      seedOrder: 170,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "Girls Essentials Leggings Set",
      seedOrder: 178,
    }, // 4
    {
      brandName: "Puma",
      modelName: "Girls Essentials Logo Hoodie",
      seedOrder: 187,
    }, // 3
    { brandName: "H&M", modelName: "Girls 2-piece Jersey Set", seedOrder: 409 }, // 2
    { brandName: "Zara", modelName: "Girls Knit Matching Set", seedOrder: 179 }, // 3
    { brandName: "Mango", modelName: "Girls Printed Dress", seedOrder: 171 }, // 3
    { brandName: "Reebok", modelName: "Girls Vector T-Shirt", seedOrder: 163 }, // 3
    {
      brandName: "Under Armour",
      modelName: "Girls Rival Fleece Joggers",
      seedOrder: 155,
    }, // 3
    {
      brandName: "Gap",
      modelName: "Kids Logo Sweatshirt (Girls)",
      seedOrder: 147,
    }, // 3
    {
      brandName: "The North Face",
      modelName: "Youth Never Stop Shorts",
      seedOrder: 139,
    }, // 3
    {
      brandName: "Adidas",
      modelName: "Girls Badge of Sport Tee",
      seedOrder: 186,
    }, // 4
  ],

  "fashion-bags": [
    { brandName: "Nike", modelName: "Brasilia Backpack", seedOrder: 194 }, // 4
    { brandName: "Adidas", modelName: "Classic Backpack", seedOrder: 202 }, // 4
    { brandName: "Puma", modelName: "Phase Backpack", seedOrder: 131 }, // 3
    {
      brandName: "Tommy Hilfiger",
      modelName: "Essential Reporter Bag",
      seedOrder: 210,
    }, // 4
    {
      brandName: "Calvin Klein",
      modelName: "Monogram Crossbody Bag",
      seedOrder: 218,
    }, // 4
    { brandName: "Zara", modelName: "City Mini Crossbody Bag", seedOrder: 123 }, // 3
    { brandName: "Mango", modelName: "Shopper Tote Bag", seedOrder: 115 }, // 3
    { brandName: "H&M", modelName: "Shoulder Bag", seedOrder: 387 }, // 2
    {
      brandName: "Herschel",
      modelName: "Little America Backpack",
      seedOrder: 107,
    }, // 3
    { brandName: "Eastpak", modelName: "Padded Pak'r Backpack", seedOrder: 99 }, // 3
    {
      brandName: "The North Face",
      modelName: "Borealis Backpack",
      seedOrder: 226,
    }, // 4
    {
      brandName: "Eastpak",
      modelName: "Out Of Office Backpack",
      seedOrder: 91,
    }, // 3
  ],

  "fashion-accessories": [
    {
      brandName: "Calvin Klein",
      modelName: "Reversible Leather Belt",
      seedOrder: 83,
    }, // 3
    {
      brandName: "Tommy Hilfiger",
      modelName: "Flag Leather Belt",
      seedOrder: 75,
    }, // 3
    { brandName: "Levi's", modelName: "Classic Batwing Cap", seedOrder: 67 }, // 3
    {
      brandName: "Nike",
      modelName: "Sportswear Heritage86 Cap",
      seedOrder: 234,
    }, // 4
    { brandName: "Adidas", modelName: "Baseball Cap", seedOrder: 242 }, // 4
    { brandName: "Puma", modelName: "Ess Logo Cap", seedOrder: 59 }, // 3
    { brandName: "H&M", modelName: "Leather Wallet", seedOrder: 379 }, // 2
    { brandName: "Zara", modelName: "Textured Card Holder", seedOrder: 371 }, // 2
    { brandName: "Mango", modelName: "Metal Buckle Belt", seedOrder: 51 }, // 3
    {
      brandName: "Ray-Ban",
      modelName: "Wayfarer Classic (RB2140)",
      seedOrder: 250,
    }, // 4
    {
      brandName: "Ray-Ban",
      modelName: "Aviator Classic (RB3025)",
      seedOrder: 258,
    }, // 4
    { brandName: "Casio", modelName: "G-Shock DW-5600E-1V", seedOrder: 266 }, // 4
    {
      brandName: "Seiko",
      modelName: "Seiko 5 Sports SRPD55K1",
      seedOrder: 274,
    }, // 4
    {
      brandName: "Ray-Ban",
      modelName: "Clubmaster Classic (RB3016)",
      seedOrder: 282,
    }, // 4
    { brandName: "Casio", modelName: "Casio F-91W-1", seedOrder: 363 }, // 2
  ],

  // HOME & LIVING
  "home-living-furniture": [
    { brandName: "IKEA", modelName: "KALLAX Shelf Unit", seedOrder: 13 }, // 3
    { brandName: "IKEA", modelName: "LACK Coffee Table", seedOrder: 21 }, // 3
    { brandName: "IKEA", modelName: "MALM Chest of Drawers", seedOrder: 29 }, // 3
    { brandName: "IKEA", modelName: "HEMNES TV Unit", seedOrder: 37 }, // 3
    { brandName: "IKEA", modelName: "BILLY Bookcase", seedOrder: 45 }, // 3
    { brandName: "IKEA", modelName: "LISABO Table", seedOrder: 53 }, // 3
    { brandName: "IKEA", modelName: "BRIMNES Cabinet", seedOrder: 61 }, // 3
    { brandName: "IKEA", modelName: "MICKE Desk", seedOrder: 69 }, // 3
    { brandName: "IKEA", modelName: "ALEX Drawer Unit", seedOrder: 77 }, // 3
    { brandName: "IKEA", modelName: "IVAR Shelf Unit", seedOrder: 85 }, // 3
  ],

  "home-living-kitchen": [
    {
      brandName: "Bosch",
      modelName: "Serie 4 Dishwasher (SMS4HVI33E)",
      seedOrder: 17,
    }, // 4
    {
      brandName: "Bosch",
      modelName: "Serie 6 Built-in Oven (HBG634BB1)",
      seedOrder: 25,
    }, // 4
    {
      brandName: "Bosch",
      modelName: "Serie 6 Dishwasher (SMS6HVI10T)",
      seedOrder: 33,
    }, // 4
    {
      brandName: "Siemens",
      modelName: "iQ300 Dishwasher (SN23HW02MT)",
      seedOrder: 229,
    }, // 3
    {
      brandName: "Siemens",
      modelName: "iQ500 Built-in Oven (HB517ABR0T)",
      seedOrder: 41,
    }, // 4
    {
      brandName: "Siemens",
      modelName: "iQ500 Dishwasher (SN25ZW49MT)",
      seedOrder: 49,
    }, // 4
    {
      brandName: "Arçelik",
      modelName: "270560EI Inverter Refrigerator",
      seedOrder: 237,
    }, // 3
    { brandName: "Beko", modelName: "ExpertFry Air Fryer", seedOrder: 245 }, // 3
    { brandName: "Vestel", modelName: "NF52101 Refrigerator", seedOrder: 253 }, // 3
    {
      brandName: "Tefal",
      modelName: "Easy Fry & Grill Precision",
      seedOrder: 261,
    }, // 3
    { brandName: "Tefal", modelName: "Cook4me+ Multicooker", seedOrder: 269 }, // 3
    {
      brandName: "Philips",
      modelName: "Airfryer XXL (HD9650/90)",
      seedOrder: 57,
    }, // 4
    {
      brandName: "KitchenAid",
      modelName: "Artisan Stand Mixer (5KSM175PS)",
      seedOrder: 65,
    }, // 4
    {
      brandName: "Nespresso",
      modelName: "Vertuo Next Coffee Machine",
      seedOrder: 73,
    }, // 4
    {
      brandName: "Braun",
      modelName: "MultiQuick 9 Hand Blender (MQ 9187XLI)",
      seedOrder: 277,
    }, // 3
    {
      brandName: "Braun",
      modelName: "MultiServe Coffee Machine",
      seedOrder: 285,
    }, // 3
  ],

  "home-living-home-decoration": [
    {
      brandName: "IKEA",
      modelName: "FEJKA Artificial Potted Plant",
      seedOrder: 351,
    }, // 2
    { brandName: "IKEA", modelName: "RÅSKOG Utility Cart", seedOrder: 289 }, // 3
    { brandName: "IKEA", modelName: "MOLNART LED Bulb", seedOrder: 359 }, // 2
    { brandName: "IKEA", modelName: "VILJESTARK Vase", seedOrder: 367 }, // 2
    { brandName: "IKEA", modelName: "STOCKHOLM Mirror", seedOrder: 297 }, // 3
    {
      brandName: "IKEA",
      modelName: "HÖSTAGILLE Cushion Cover",
      seedOrder: 375,
    }, // 2
    {
      brandName: "Philips Hue",
      modelName: "Hue Go Portable Table Lamp",
      seedOrder: 81,
    }, // 4
    {
      brandName: "Philips Hue",
      modelName: "Hue Lightstrip Plus",
      seedOrder: 89,
    }, // 4
    {
      brandName: "Zara Home",
      modelName: "Home Scented Candle",
      seedOrder: 383,
    }, // 2
    { brandName: "Zara Home", modelName: "Reed Diffuser", seedOrder: 391 }, // 2
    {
      brandName: "H&M Home",
      modelName: "Cotton Cushion Cover",
      seedOrder: 399,
    }, // 2
    { brandName: "H&M Home", modelName: "Glass Vase", seedOrder: 407 }, // 2
    { brandName: "Muji", modelName: "Aroma Diffuser", seedOrder: 305 }, // 3
    { brandName: "Muji", modelName: "Fragrance Oil (Green)", seedOrder: 415 }, // 2
  ],

  "home-living-bedroom-beds": [
    { brandName: "IKEA", modelName: "MALM Bed Frame", seedOrder: 93 }, // 3
    {
      brandName: "IKEA",
      modelName: "BRIMNES Bed Frame with Storage",
      seedOrder: 101,
    }, // 3
    { brandName: "IKEA", modelName: "HEMNES Day-bed Frame", seedOrder: 109 }, // 3
    {
      brandName: "IKEA",
      modelName: "SLATTUM Upholstered Bed Frame",
      seedOrder: 117,
    }, // 3
    { brandName: "IKEA", modelName: "SONGESAND Bed Frame", seedOrder: 125 }, // 3
    {
      brandName: "IKEA",
      modelName: "IDANÄS Upholstered Bed Frame",
      seedOrder: 133,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "TUFJORD Upholstered Bed Frame",
      seedOrder: 141,
    }, // 3
    { brandName: "IKEA", modelName: "NEIDEN Bed Frame", seedOrder: 149 }, // 3
    {
      brandName: "IKEA",
      modelName: "NORDLI Bed Frame with Storage",
      seedOrder: 157,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "BRIMNES Day-bed with 2 Drawers",
      seedOrder: 165,
    }, // 3
    { brandName: "IKEA", modelName: "SAGSTUA Bed Frame", seedOrder: 173 }, // 3
    { brandName: "IKEA", modelName: "KOPARDAL Bed Frame", seedOrder: 423 }, // 2
    { brandName: "IKEA", modelName: "ASKVOLL Bed Frame", seedOrder: 431 }, // 2
  ],

  "home-living-bedroom-wardrobes": [
    { brandName: "IKEA", modelName: "PAX Wardrobe Frame", seedOrder: 181 }, // 3
    {
      brandName: "IKEA",
      modelName: "BRIMNES Wardrobe with 3 Doors",
      seedOrder: 189,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "KLEPPSTAD Wardrobe with 3 Doors",
      seedOrder: 439,
    }, // 2
    { brandName: "IKEA", modelName: "SONGESAND Wardrobe", seedOrder: 197 }, // 3
    {
      brandName: "IKEA",
      modelName: "PLATSA Wardrobe Combination",
      seedOrder: 205,
    }, // 3
    { brandName: "IKEA", modelName: "IDANÄS Wardrobe", seedOrder: 213 }, // 3
    {
      brandName: "IKEA",
      modelName: "HAUGA Wardrobe with Sliding Doors",
      seedOrder: 221,
    }, // 3
    { brandName: "IKEA", modelName: "NORDKISA Open Wardrobe", seedOrder: 447 }, // 2
    {
      brandName: "IKEA",
      modelName: "PAX Wardrobe (White, 100x58x236)",
      seedOrder: 229,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "PAX Wardrobe (Black-brown, 50x58x236)",
      seedOrder: 237,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "BRIMNES Wardrobe with 2 Doors",
      seedOrder: 245,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "KLEPPSTAD Wardrobe (White)",
      seedOrder: 455,
    }, // 2
    {
      brandName: "IKEA",
      modelName: "PLATSA Frame (60x40x180)",
      seedOrder: 463,
    }, // 2
    {
      brandName: "IKEA",
      modelName: "SONGESAND Wardrobe (White)",
      seedOrder: 253,
    }, // 3
  ],

  "home-living-bedroom-mattresses": [
    { brandName: "IKEA", modelName: "ÅBYGDA Foam Mattress", seedOrder: 471 }, // 2
    {
      brandName: "IKEA",
      modelName: "VESTERÖY Pocket Spring Mattress",
      seedOrder: 261,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "VALEVÅG Pocket Spring Mattress",
      seedOrder: 269,
    }, // 3
    { brandName: "IKEA", modelName: "MORGEDAL Foam Mattress", seedOrder: 277 }, // 3
    {
      brandName: "IKEA",
      modelName: "HÖVÅG Pocket Spring Mattress",
      seedOrder: 285,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "HAMARVIK Spring Mattress",
      seedOrder: 479,
    }, // 2
    {
      brandName: "IKEA",
      modelName: "VÅGSTRANDA Pocket Spring Mattress",
      seedOrder: 293,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "MEISTERVIK Foam Mattress",
      seedOrder: 487,
    }, // 2
    {
      brandName: "IKEA",
      modelName: "HYLLESTAD Pocket Spring Mattress",
      seedOrder: 301,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "HESSTUN Pocket Spring Mattress",
      seedOrder: 309,
    }, // 3
    {
      brandName: "IKEA",
      modelName: "MATRAND Memory Foam Mattress",
      seedOrder: 317,
    }, // 3
    { brandName: "IKEA", modelName: "MALFORS Foam Mattress", seedOrder: 495 }, // 2
  ],

  "home-living-lighting": [
    {
      brandName: "Philips Hue",
      modelName: "Hue White Ambiance E27 Bulb",
      seedOrder: 97,
    }, // 4
    {
      brandName: "Philips Hue",
      modelName: "Hue Play Light Bar",
      seedOrder: 105,
    }, // 4
    {
      brandName: "Philips Hue",
      modelName: "Hue Go Portable Lamp",
      seedOrder: 113,
    }, // 4
    {
      brandName: "Philips Hue",
      modelName: "Hue Ceiling Light Aurelle",
      seedOrder: 121,
    }, // 4
    { brandName: "IKEA", modelName: "HEKTAR Floor Lamp", seedOrder: 325 }, // 3
    { brandName: "IKEA", modelName: "NOT Table Lamp", seedOrder: 503 }, // 2
    { brandName: "IKEA", modelName: "RANARP Work Lamp", seedOrder: 333 }, // 3
    { brandName: "IKEA", modelName: "FADO Table Lamp", seedOrder: 341 }, // 3
    {
      brandName: "Panasonic",
      modelName: "LED Desk Lamp (HHLT0339)",
      seedOrder: 349,
    }, // 3
  ],

  // SPORTS & OUTDOOR
  "sports-outdoor-fitness": [
    { brandName: "Nike", modelName: "Training Mat 2.0", seedOrder: 5 }, // 4
    { brandName: "Adidas", modelName: "Training Mat", seedOrder: 13 }, // 4
    {
      brandName: "Reebok",
      modelName: "Fitness Training Gloves",
      seedOrder: 204,
    }, // 3
    { brandName: "Under Armour", modelName: "Training Gloves", seedOrder: 212 }, // 3
    { brandName: "Puma", modelName: "Training Duffel Bag", seedOrder: 220 }, // 3
  ],

  "sports-outdoor-running": [
    { brandName: "Nike", modelName: "Air Zoom Pegasus 40", seedOrder: 9 }, // 4
    { brandName: "Nike", modelName: "Winflo 11", seedOrder: 17 }, // 4
    { brandName: "Nike", modelName: "Vomero 17", seedOrder: 25 }, // 4
    { brandName: "Nike", modelName: "ZoomX Vaporfly NEXT% 3", seedOrder: 33 }, // 4
    { brandName: "Adidas", modelName: "Ultraboost Light", seedOrder: 41 }, // 4
    { brandName: "Adidas", modelName: "Supernova Rise", seedOrder: 49 }, // 4
    {
      brandName: "New Balance",
      modelName: "Fresh Foam 1080v13",
      seedOrder: 228,
    }, // 3
    { brandName: "Puma", modelName: "Velocity Nitro 3", seedOrder: 236 }, // 3
  ],

  "sports-outdoor-camping": [
    { brandName: "Coleman", modelName: "Sundome 4 Tent", seedOrder: 244 }, // 3
    {
      brandName: "Coleman",
      modelName: "North Rim 0°F Sleeping Bag",
      seedOrder: 252,
    }, // 3
    {
      brandName: "Black Diamond",
      modelName: "Storm 500-R Headlamp",
      seedOrder: 260,
    }, // 3
    {
      brandName: "Stanley",
      modelName: "Adventure Camp Cook Set",
      seedOrder: 268,
    }, // 3
  ],

  "sports-outdoor-cycling": [
    {
      brandName: "Garmin",
      modelName: "Edge 530 Cycling Computer",
      seedOrder: 57,
    }, // 4
    { brandName: "Garmin", modelName: "Edge 840 Solar", seedOrder: 65 }, // 4
    { brandName: "Garmin", modelName: "Edge 1040 Solar", seedOrder: 73 }, // 4
    {
      brandName: "Wahoo",
      modelName: "KICKR Core Smart Trainer",
      seedOrder: 81,
    }, // 4
  ],

  "sports-outdoor-team-sports-football": [
    {
      brandName: "Nike",
      modelName: "Mercurial Vapor 15 Academy FG",
      seedOrder: 89,
    }, // 4
    {
      brandName: "Nike",
      modelName: "Premier League Academy Football",
      seedOrder: 97,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "Predator Accuracy.3 FG",
      seedOrder: 105,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "UCL Training Ball 23/24",
      seedOrder: 113,
    }, // 4
    { brandName: "Puma", modelName: "Future 7 Match FG/AG", seedOrder: 276 }, // 3
  ],

  "sports-outdoor-team-sports-basketball": [
    {
      brandName: "Nike",
      modelName: "Precision 7 Basketball Shoes",
      seedOrder: 121,
    }, // 4
    {
      brandName: "Nike",
      modelName: "Elite Championship Basketball",
      seedOrder: 129,
    }, // 4
    { brandName: "Puma", modelName: "MB.02 Basketball Shoes", seedOrder: 284 }, // 3
    {
      brandName: "Spalding",
      modelName: "NBA Street Basketball",
      seedOrder: 292,
    }, // 3
  ],

  "sports-outdoor-team-sports-volleyball": [
    {
      brandName: "Nike",
      modelName: "React Hyperset 2 Volleyball Shoes",
      seedOrder: 137,
    }, // 4
    {
      brandName: "Adidas",
      modelName: "Stabil 16 Indoor Shoes",
      seedOrder: 145,
    }, // 4
    { brandName: "Puma", modelName: "Solarflash III Indoor", seedOrder: 300 }, // 3
  ],

  // BEAUTY & PERSONAL CARE
  "beauty-personal-care-makeup": [
    {
      brandName: "L'Oréal Paris",
      modelName: "True Match Super-Blendable Foundation",
      seedOrder: 198,
    }, // 3
    {
      brandName: "L'Oréal Paris",
      modelName: "Telescopic Mascara",
      seedOrder: 206,
    }, // 3
    {
      brandName: "L'Oréal Paris",
      modelName: "Infallible 24H Fresh Wear Foundation",
      seedOrder: 214,
    }, // 3
    {
      brandName: "Maybelline",
      modelName: "SuperStay Matte Ink Liquid Lipstick",
      seedOrder: 222,
    }, // 3
    {
      brandName: "Maybelline",
      modelName: "Lash Sensational Mascara",
      seedOrder: 230,
    }, // 3
  ],

  "beauty-personal-care-skincare": [
    {
      brandName: "NIVEA",
      modelName: "Soft Moisturizing Cream",
      seedOrder: 377,
    }, // 2
    {
      brandName: "NIVEA",
      modelName: "Q10 Anti-Wrinkle Day Cream",
      seedOrder: 238,
    }, // 3
    { brandName: "NIVEA", modelName: "Creme 150ml", seedOrder: 385 }, // 2
    {
      brandName: "NIVEA",
      modelName: "Micellar Water (Sensitive)",
      seedOrder: 393,
    }, // 2
    {
      brandName: "L'Oréal Paris",
      modelName: "Revitalift Filler Day Cream",
      seedOrder: 246,
    }, // 3
    {
      brandName: "L'Oréal Paris",
      modelName: "Hydra Genius Aloe Water",
      seedOrder: 254,
    }, // 3
  ],

  "beauty-personal-care-hair-care": [
    {
      brandName: "Pantene",
      modelName: "Pro-V Repair & Protect Shampoo",
      seedOrder: 262,
    }, // 3
    {
      brandName: "Pantene",
      modelName: "Pro-V Aqua Light Conditioner",
      seedOrder: 401,
    }, // 2
    {
      brandName: "Pantene",
      modelName: "Pro-V Keratin Protect Mask",
      seedOrder: 409,
    }, // 2
    {
      brandName: "L'Oréal Paris",
      modelName: "Elseve Dream Long Shampoo",
      seedOrder: 270,
    }, // 3
    {
      brandName: "L'Oréal Paris",
      modelName: "Elseve Hyaluron Plump Conditioner",
      seedOrder: 278,
    }, // 3
    {
      brandName: "L'Oréal Paris",
      modelName: "Elseve Total Repair 5 Shampoo",
      seedOrder: 286,
    }, // 3
  ],

  "beauty-personal-care-perfume": [
    {
      brandName: "Calvin Klein",
      modelName: "CK One Eau de Toilette",
      seedOrder: 294,
    }, // 3
    {
      brandName: "Calvin Klein",
      modelName: "Euphoria Eau de Parfum",
      seedOrder: 302,
    }, // 3
    {
      brandName: "Tommy Hilfiger",
      modelName: "Tommy Eau de Toilette",
      seedOrder: 310,
    }, // 3
    {
      brandName: "Tommy Hilfiger",
      modelName: "Tommy Girl Eau de Toilette",
      seedOrder: 318,
    }, // 3
  ],

  "beauty-personal-care-personal-care-shaving": [
    { brandName: "Gillette", modelName: "Fusion5 Razor", seedOrder: 326 }, // 3
    { brandName: "Gillette", modelName: "Mach3 Turbo Razor", seedOrder: 417 }, // 2
    {
      brandName: "Gillette",
      modelName: "Fusion5 ProGlide Razor",
      seedOrder: 334,
    }, // 3
    { brandName: "Philips", modelName: "OneBlade (QP2724/10)", seedOrder: 342 }, // 3
  ],

  "beauty-personal-care-personal-care-oral-care": [
    {
      brandName: "Oral-B",
      modelName: "iO 4 Electric Toothbrush",
      seedOrder: 350,
    }, // 3
    {
      brandName: "Oral-B",
      modelName: "iO 6 Electric Toothbrush",
      seedOrder: 358,
    }, // 3
    {
      brandName: "Oral-B",
      modelName: "iO 9 Electric Toothbrush",
      seedOrder: 366,
    }, // 3
    {
      brandName: "Philips",
      modelName: "Sonicare ProtectiveClean 4300",
      seedOrder: 374,
    }, // 3
    { brandName: "Philips", modelName: "Sonicare 3100 Series", seedOrder: 425 }, // 2
    {
      brandName: "Philips",
      modelName: "Sonicare DiamondClean 9000",
      seedOrder: 382,
    }, // 3
  ],

  // BEAUTY & PERSONAL CARE
  "beauty-personal-care-personal-care-body-care": [
    {
      brandName: "NIVEA",
      modelName: "Rich Nourishing Body Lotion",
      seedOrder: 433,
    }, // 2
    {
      brandName: "NIVEA",
      modelName: "Men Sensitive Shower Gel",
      seedOrder: 441,
    }, // 2
    {
      brandName: "Gillette",
      modelName: "Clear Gel Antiperspirant",
      seedOrder: 449,
    }, // 2
    {
      brandName: "NIVEA",
      modelName: "Pearl & Beauty Deodorant",
      seedOrder: 457,
    }, // 2
  ],
};

const PRODUCT_PRICE_CONFIG: Record<string, ProductPriceRange> = {
  PHONE_IPHONE: { priceMin: 10999, priceMax: 99999 },
  PHONE_ANDROID: { priceMin: 10999, priceMax: 99999 },
  PHONE_FEATURE: { priceMin: 799, priceMax: 7999 },
  LAPTOP_GAMING: { priceMin: 45999, priceMax: 189999 },
  LAPTOP_ULTRABOOK: { priceMin: 34999, priceMax: 159999 },
  LAPTOP_BUSINESS: { priceMin: 32999, priceMax: 169999 },
  TABLET: { priceMin: 6999, priceMax: 89999 },
  WATCH: { priceMin: 2499, priceMax: 49999 },
  HEADPHONES: { priceMin: 699, priceMax: 24999 },
  MONITOR: { priceMin: 3999, priceMax: 69999 },
  CONSOLE: { priceMin: 14999, priceMax: 49999 },
  DRESS: { priceMin: 699, priceMax: 8999 },
  TSHIRT: { priceMin: 249, priceMax: 2499 },
  JEANS: { priceMin: 699, priceMax: 6999 },
  SHOES: { priceMin: 699, priceMax: 19999 },
  SHIRT: { priceMin: 699, priceMax: 9999 },
  SNEAKERS: { priceMin: 699, priceMax: 19999 },
  KIDS_BOYS: { priceMin: 249, priceMax: 9999 },
  KIDS_GIRLS: { priceMin: 249, priceMax: 9999 },
  BAG: { priceMin: 699, priceMax: 29999 },
  ACCESSORY: { priceMin: 149, priceMax: 9999 },
  FURNITURE: { priceMin: 2999, priceMax: 129999 },
  KITCHEN: { priceMin: 399, priceMax: 49999 },
  DECOR: { priceMin: 199, priceMax: 15999 },
  BED: { priceMin: 2999, priceMax: 169999 },
  WARDROBE: { priceMin: 2999, priceMax: 169999 },
  MATTRESS: { priceMin: 2999, priceMax: 69999 },
  LIGHTING: { priceMin: 249, priceMax: 24999 },
  FITNESS: { priceMin: 199, priceMax: 14999 },
  RUNNING: { priceMin: 199, priceMax: 19999 },
  CAMPING: { priceMin: 699, priceMax: 89999 },
  CYCLING: { priceMin: 2499, priceMax: 199999 },
  FOOTBALL: { priceMin: 199, priceMax: 14999 },
  BASKETBALL: { priceMin: 199, priceMax: 14999 },
  VOLLEYBALL: { priceMin: 199, priceMax: 14999 },
  MAKEUP: { priceMin: 149, priceMax: 8999 },
  SKINCARE: { priceMin: 149, priceMax: 8999 },
  HAIRCARE: { priceMin: 149, priceMax: 8999 },
  PERFUME: { priceMin: 699, priceMax: 19999 },
  SHAVING: { priceMin: 149, priceMax: 8999 },
  ORALCARE: { priceMin: 149, priceMax: 8999 },
  BODYCARE: { priceMin: 149, priceMax: 8999 },
};

const LEAF_CATEGORY_TYPE_MAP: Record<string, string> = {
  iPhones: "PHONE_IPHONE",
  "Android Phones": "PHONE_ANDROID",
  "Feature Phones": "PHONE_FEATURE",
  "Gaming Laptops": "LAPTOP_GAMING",
  Ultrabooks: "LAPTOP_ULTRABOOK",
  "Business Laptops": "LAPTOP_BUSINESS",
  Tablets: "TABLET",
  "Smart Watches": "WATCH",
  Headphones: "HEADPHONES",
  Monitors: "MONITOR",
  "Gaming Consoles": "CONSOLE",
  Dresses: "DRESS",
  "T-Shirts": "TSHIRT",
  Jeans: "JEANS",
  Shoes: "SHOES",
  Shirts: "SHIRT",
  Sneakers: "SNEAKERS",
  "Boys Clothing": "KIDS_BOYS",
  "Girls Clothing": "KIDS_GIRLS",
  Bags: "BAG",
  Accessories: "ACCESSORY",
  Furniture: "FURNITURE",
  Kitchen: "KITCHEN",
  "Home Decoration": "DECOR",
  Beds: "BED",
  Wardrobes: "WARDROBE",
  Mattresses: "MATTRESS",
  Lighting: "LIGHTING",
  Fitness: "FITNESS",
  Running: "RUNNING",
  Camping: "CAMPING",
  Cycling: "CYCLING",
  Football: "FOOTBALL",
  Basketball: "BASKETBALL",
  Volleyball: "VOLLEYBALL",
  Makeup: "MAKEUP",
  Skincare: "SKINCARE",
  "Hair Care": "HAIRCARE",
  Perfume: "PERFUME",
  Shaving: "SHAVING",
  "Oral Care": "ORALCARE",
  "Body Care": "BODYCARE",
};

const getProductTypeKeyByLeafCategoryName = (leafCategoryName: string) => {
  const name = leafCategoryName.trim();
  return LEAF_CATEGORY_TYPE_MAP[name] ?? "GENERIC";
};

const getProductConfigByLeafCategoryName = (
  leafCategoryName: string,
): ProductTypeConfig => {
  const typeKey = getProductTypeKeyByLeafCategoryName(leafCategoryName);
  const config = PRODUCT_PRICE_CONFIG[typeKey];

  if (!config) {
    return { typeKey: "GENERIC", priceMin: 199, priceMax: 9999 };
  }

  return { typeKey, priceMin: config.priceMin, priceMax: config.priceMax };
};

const buildProductName = (brandName: string, modelName: string) => {
  const normalizedModel = modelName.toLowerCase();
  const normalizedBrand = brandName.toLowerCase();

  if (normalizedModel.startsWith(normalizedBrand)) {
    return modelName;
  }

  return `${brandName} ${modelName}`;
};

const getCategorySpecificDescription = (
  leafCategoryName: string,
  productName: string,
) => {
  const leafName = leafCategoryName.trim();

  if (
    leafName === "iPhones" ||
    leafName === "Android Phones" ||
    leafName === "Feature Phones"
  ) {
    return joinSentences([
      `${productName} delivers smooth performance, a clear display, and a reliable everyday smartphone experience.`,
      `It is designed for calls, messaging, social apps, and daily tasks with a simple and responsive interface.`,
    ]);
  }

  if (
    leafName === "Gaming Laptops" ||
    leafName === "Ultrabooks" ||
    leafName === "Business Laptops"
  ) {
    return joinSentences([
      `${productName} offers solid performance, a quality display, and a comfortable keyboard for everyday computing.`,
      `It is suitable for multitasking, productivity work, and long sessions at home, in the office, or on the go.`,
    ]);
  }

  if (
    leafName === "Headphones" ||
    leafName === "Smart Watches" ||
    leafName === "Tablets" ||
    leafName === "Monitors" ||
    leafName === "Gaming Consoles"
  ) {
    return joinSentences([
      `${productName} provides a reliable and comfortable user experience for everyday use.`,
      `Its balanced feature set focuses on practicality, ease of use, and consistent performance.`,
    ]);
  }

  if (
    leafName === "Dresses" ||
    leafName === "T-Shirts" ||
    leafName === "Jeans" ||
    leafName === "Shoes" ||
    leafName === "Shirts" ||
    leafName === "Sneakers" ||
    leafName === "Boys Clothing" ||
    leafName === "Girls Clothing" ||
    leafName === "Bags" ||
    leafName === "Accessories"
  ) {
    return joinSentences([
      `${productName} combines everyday comfort with a clean and versatile design.`,
      `It pairs easily with different outfits and works well for both casual and everyday wear.`,
    ]);
  }

  if (
    leafName === "Furniture" ||
    leafName === "Kitchen" ||
    leafName === "Home Decoration" ||
    leafName === "Beds" ||
    leafName === "Wardrobes" ||
    leafName === "Mattresses" ||
    leafName === "Lighting"
  ) {
    return joinSentences([
      `${productName} is designed for practical daily use with a clean and modern home style.`,
      `Its design fits easily into different interiors while focusing on comfort and functionality.`,
    ]);
  }

  if (
    leafName === "Fitness" ||
    leafName === "Running" ||
    leafName === "Camping" ||
    leafName === "Cycling" ||
    leafName === "Football" ||
    leafName === "Basketball" ||
    leafName === "Volleyball"
  ) {
    return joinSentences([
      `${productName} is built for regular activity and reliable everyday performance.`,
      `It focuses on comfort, durability, and practical usability for training or outdoor use.`,
    ]);
  }

  if (
    leafName === "Makeup" ||
    leafName === "Skincare" ||
    leafName === "Hair Care" ||
    leafName === "Perfume" ||
    leafName === "Shaving" ||
    leafName === "Oral Care" ||
    leafName === "Body Care"
  ) {
    return joinSentences([
      `${productName} is suitable for daily personal care routines and consistent everyday use.`,
      `Its simple and practical design makes it easy to include in regular grooming or skincare habits.`,
    ]);
  }

  return joinSentences([
    `${productName} offers a reliable and user-friendly experience for everyday use.`,
    `It focuses on practical performance and consistent quality in its category.`,
  ]);
};

const getRealCatalogItemsForLeafCategory = (leafCategory: {
  name: string;
  slug: string;
}) => {
  const slugKey = leafCategory.slug.trim();

  if (REAL_PRODUCTS_BY_TYPE[slugKey]?.length) {
    return REAL_PRODUCTS_BY_TYPE[slugKey];
  }

  const typeKey = getProductTypeKeyByLeafCategoryName(leafCategory.name);

  if (REAL_PRODUCTS_BY_TYPE[typeKey]?.length) {
    return REAL_PRODUCTS_BY_TYPE[typeKey];
  }

  return [] as RealCatalogItem[];
};

type SellerGroup =
  | "Electronics"
  | "Fashion"
  | "Home & Living"
  | "Sports & Outdoor"
  | "Beauty & Personal Care";

const getSellerGroupByRootName = (rootCategoryName: string): SellerGroup => {
  const name = rootCategoryName.trim();

  if (name === "Electronics") {
    return "Electronics";
  }
  if (name === "Fashion") {
    return "Fashion";
  }
  if (name === "Home & Living") {
    return "Home & Living";
  }
  if (name === "Sports & Outdoor") {
    return "Sports & Outdoor";
  }
  if (name === "Beauty & Personal Care") {
    return "Beauty & Personal Care";
  }

  return "Electronics";
};

type SellerSeedIdentity = {
  email: string;
  group: SellerGroup;
  weight: number;
};

const SELLER_SEED_IDENTITIES: SellerSeedIdentity[] = [
  // Electronics (6)
  { email: "contact@novatech.com", group: "Electronics", weight: 5.8 }, // big
  { email: "hello@brightelectro.com", group: "Electronics", weight: 3.2 }, // mid
  { email: "sales@nextgengadgets.com", group: "Electronics", weight: 3.6 }, // mid
  { email: "support@voltedge.com", group: "Electronics", weight: 2.2 }, // smaller
  { email: "contact@quantumdevice.com", group: "Electronics", weight: 0.9 }, // tiny
  { email: "info@coretechmarket.com", group: "Electronics", weight: 1.7 }, // small-mid

  // Fashion (5)
  { email: "support@urbanwear.com", group: "Fashion", weight: 4.8 }, // big
  { email: "contact@purestyle.com", group: "Fashion", weight: 2.6 },
  { email: "hello@veloura.com", group: "Fashion", weight: 2.1 },
  { email: "sales@threadculture.com", group: "Fashion", weight: 1.4 },
  { email: "support@modenest.com", group: "Fashion", weight: 0.9 }, // small

  // Home & Living (4)
  { email: "info@homecraft.com", group: "Home & Living", weight: 4.6 }, // big
  { email: "support@comfortliving.com", group: "Home & Living", weight: 2.0 },
  { email: "hello@nestspace.com", group: "Home & Living", weight: 1.4 },
  { email: "contact@oakhouse.com", group: "Home & Living", weight: 0.8 }, // small

  // Sports & Outdoor (3)
  { email: "support@activepulse.com", group: "Sports & Outdoor", weight: 3.6 }, // big
  { email: "contact@trailpeak.com", group: "Sports & Outdoor", weight: 1.8 },
  { email: "sales@motiongear.com", group: "Sports & Outdoor", weight: 0.9 }, // small

  // Beauty & Personal Care (2)
  {
    email: "support@glowcare.com",
    group: "Beauty & Personal Care",
    weight: 2.7,
  }, // bigger
  {
    email: "contact@auraskin.com",
    group: "Beauty & Personal Care",
    weight: 1.1,
  },
];

const pickWeighted = <T>(items: { item: T; weight: number }[]) => {
  const total = items.reduce((acc, current) => acc + current.weight, 0);
  const roll = Math.random() * total;

  let cumulative = 0;

  for (const current of items) {
    cumulative += current.weight;
    if (roll <= cumulative) {
      return current.item;
    }
  }

  return items[items.length - 1]!.item;
};

type SellerDbRow = { id: number; email: string };

const buildSellerPools = (sellerRows: SellerDbRow[]) => {
  const idByEmail = new Map<string, number>(
    sellerRows.map((seller) => [seller.email.toLowerCase(), seller.id]),
  );

  const pools: Record<SellerGroup, { sellerId: number; weight: number }[]> = {
    Electronics: [],
    Fashion: [],
    "Home & Living": [],
    "Sports & Outdoor": [],
    "Beauty & Personal Care": [],
  };

  for (const identity of SELLER_SEED_IDENTITIES) {
    const sellerId = idByEmail.get(identity.email.toLowerCase());

    if (!sellerId) {
      continue;
    }

    pools[identity.group].push({ sellerId, weight: identity.weight });
  }

  return pools;
};

const getRootCategoryNameForLeaf = (
  leafCategoryId: number,
  categoryById: Map<
    number,
    { id: number; name: string; parentId: number | null }
  >,
) => {
  let cursor = categoryById.get(leafCategoryId);

  if (!cursor) {
    return "Electronics";
  }

  while (cursor.parentId) {
    const parent = categoryById.get(cursor.parentId);
    if (!parent) {
      break;
    }
    cursor = parent;
  }

  return cursor.name;
};

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
    where: { code: "TL" },
  });

  if (!defaultCurrency) {
    throw new Error("❌ Default currency not found. Run seedCurrencies first.");
  }

  const sellerRows = await prisma.user.findMany({
    where: { role: USER_ROLE.SELLER },
    select: { id: true, email: true },
  });

  if (!sellerRows.length) {
    throw new Error("❌ No sellers found. Run seedUsers first.");
  }

  const sellerPools = buildSellerPools(sellerRows);

  const brandsByNameMap = new Map(brands.map((brand) => [brand.name, brand]));
  const categoryById = new Map(
    categories.map((category) => [
      category.id,
      { id: category.id, name: category.name, parentId: category.parentId },
    ]),
  );

  const leafCategories = categories.filter((category) => {
    return !categories.some((candidate) => candidate.parentId === category.id);
  });

  const productsToCreate: any[] = [];

  for (const category of leafCategories) {
    const config = getProductConfigByLeafCategoryName(category.name);
    const catalogItems = getRealCatalogItemsForLeafCategory(category);

    if (!catalogItems.length) {
      throw new Error(
        `❌ No real product catalog items mapped for leaf category: ${category.name} (${category.slug})`,
      );
    }

    const usableCatalogItems = catalogItems.filter((catalogItem) =>
      brandsByNameMap.has(catalogItem.brandName),
    );

    if (usableCatalogItems.length < 1) {
      throw new Error(
        `❌ Category ${category.name} (${category.slug}) has 0 usable catalog items. Brand mismatch.`,
      );
    }

    const rootName = getRootCategoryNameForLeaf(category.id, categoryById);
    const sellerGroup = getSellerGroupByRootName(rootName);

    const pool = sellerPools[sellerGroup];

    if (!pool.length) {
      throw new Error(
        `❌ No seller pool for group "${sellerGroup}". Check seller emails and mapping.`,
      );
    }

    const sortedCatalogItems = [...usableCatalogItems].sort((a, b) => {
      return a.seedOrder - b.seedOrder;
    });

    for (const catalogItem of sortedCatalogItems) {
      const brand = brandsByNameMap.get(catalogItem.brandName)!;
      const productName = buildProductName(
        catalogItem.brandName,
        catalogItem.modelName,
      );

      const descriptionText = getCategorySpecificDescription(
        category.name,
        productName,
      );

      const tryPrice = toTryPriceStringEndingWith90(
        config.priceMin,
        config.priceMax,
      );

      const stockCount = randInt(5, 200);

      const sellerId = pickWeighted(
        pool.map((item) => ({ item: item.sellerId, weight: item.weight })),
      );

      productsToCreate.push({
        name: productName,
        description: descriptionText,
        stockCount,
        price: tryPrice as unknown as number,
        brandId: brand.id,
        categoryId: category.id,
        currencyId: defaultCurrency.id,
        sellerId,
        status: PRODUCT_STATUS.APPROVED,
      });
    }
  }

  console.log(`Creating ${productsToCreate.length} products...`);
  await prisma.product.createMany({ data: productsToCreate });

  const createdProducts = await prisma.product.findMany({
    select: { id: true },
  });

  const imageTasks = createdProducts.map(async (product) => {
    const images = await Promise.all(
      DUMMY_IMAGES.map((img, index) =>
        isProd
          ? uploadToCloudinary(img, product.id, index)
          : createProductImages(img, product.id, index),
      ),
    );

    return images.map((imageData, index) => ({
      productId: product.id,
      ...imageData,
      isPrimary: index === 0,
    }));
  });

  const imageRows = (await Promise.all(imageTasks)).flat();
  await prisma.productImage.createMany({ data: imageRows });

  console.log("✅ Product seeding completed");
};
