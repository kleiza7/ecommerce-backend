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
] as const;

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

type ProductTypeConfig = {
  typeKey: string;
  priceMin: number;
  priceMax: number;
};

type RealCatalogItem = {
  brandName: string;
  modelName: string;
};

const REAL_PRODUCTS_BY_TYPE: Record<string, RealCatalogItem[]> = {
  PHONE_ANDROID: [
    { brandName: "Samsung", modelName: "Galaxy A15 128GB" },
    { brandName: "Samsung", modelName: "Galaxy S24 256GB" },
    { brandName: "Samsung", modelName: "Galaxy S24 Ultra 256GB" },
    { brandName: "Xiaomi", modelName: "Redmi Note 13 Pro 256GB" },
    { brandName: "Xiaomi", modelName: "Xiaomi 14 256GB" },
    { brandName: "Huawei", modelName: "P60 Pro 256GB" },
    { brandName: "OnePlus", modelName: "OnePlus 12 256GB" },
    { brandName: "Oppo", modelName: "Reno11 F 256GB" },
    { brandName: "Realme", modelName: "Realme 12 Pro 256GB" },
    { brandName: "Motorola", modelName: "Moto G84 256GB" },
    { brandName: "Nokia", modelName: "G42 128GB" },
    { brandName: "Sony", modelName: "Xperia 1 V 256GB" },
  ],
  PHONE_IPHONE: [
    { brandName: "Apple", modelName: "iPhone 13 128GB" },
    { brandName: "Apple", modelName: "iPhone 14 128GB" },
    { brandName: "Apple", modelName: "iPhone 15 128GB" },
    { brandName: "Apple", modelName: "iPhone 15 Pro 256GB" },
    { brandName: "Apple", modelName: "iPhone 15 Pro Max 256GB" },
    { brandName: "Apple", modelName: "iPhone 16 128GB" },
    { brandName: "Apple", modelName: "iPhone 16 Plus 256GB" },
    { brandName: "Apple", modelName: "iPhone 16 Pro 256GB" },
    { brandName: "Apple", modelName: "iPhone 16 Pro Max 512GB" },
    { brandName: "Apple", modelName: "iPhone SE (3rd generation) 128GB" },
  ],
  PHONE_FEATURE: [
    { brandName: "Nokia", modelName: "105 (2023)" },
    { brandName: "Nokia", modelName: "106 4G" },
    { brandName: "Nokia", modelName: "110 4G" },
    { brandName: "Nokia", modelName: "150 (2023)" },
    { brandName: "Nokia", modelName: "2660 Flip" },
    { brandName: "Nokia", modelName: "2780 Flip" },
    { brandName: "Samsung", modelName: "Guru Music 2" },
    { brandName: "Motorola", modelName: "Moto A10" },
    { brandName: "Philips", modelName: "Xenium E2602" },
    { brandName: "Panasonic", modelName: "KX-TU550" },
  ],
  LAPTOP_GAMING: [
    { brandName: "Asus", modelName: "ROG Strix G16" },
    { brandName: "Asus", modelName: "TUF Gaming A15" },
    { brandName: "Lenovo", modelName: "Legion Pro 5" },
    { brandName: "HP", modelName: "OMEN 16" },
    { brandName: "Dell", modelName: "Alienware m16" },
    { brandName: "Acer", modelName: "Predator Helios Neo 16" },
    { brandName: "MSI", modelName: "Katana 15" },
    { brandName: "MSI", modelName: "Stealth 16 Studio" },
    { brandName: "Razer", modelName: "Blade 16" },
    { brandName: "Lenovo", modelName: "LOQ 15" },
  ],
  LAPTOP_ULTRABOOK: [
    { brandName: "Apple", modelName: "MacBook Air 13-inch M3" },
    { brandName: "Apple", modelName: "MacBook Air 15-inch M3" },
    { brandName: "Dell", modelName: "XPS 13" },
    { brandName: "HP", modelName: "Spectre x360 14" },
    { brandName: "Lenovo", modelName: "Yoga Slim 7" },
    { brandName: "Asus", modelName: "Zenbook 14 OLED" },
    { brandName: "Acer", modelName: "Swift Go 14" },
    { brandName: "Microsoft", modelName: "Surface Laptop 6" },
    { brandName: "Samsung", modelName: "Galaxy Book4 Pro" },
    { brandName: "LG", modelName: "Gram 16" },
  ],
  LAPTOP_BUSINESS: [
    { brandName: "Lenovo", modelName: "ThinkPad T14 Gen 5" },
    { brandName: "Lenovo", modelName: "ThinkPad X1 Carbon Gen 12" },
    { brandName: "HP", modelName: "EliteBook 840 G11" },
    { brandName: "Dell", modelName: "Latitude 7440" },
    { brandName: "Dell", modelName: "Latitude 5440" },
    { brandName: "Microsoft", modelName: "Surface Laptop 6" },
    { brandName: "Asus", modelName: "ExpertBook B5" },
    { brandName: "Acer", modelName: "TravelMate P4" },
    { brandName: "LG", modelName: "Gram 14" },
    { brandName: "Samsung", modelName: "Galaxy Book4" },
  ],
  TABLET: [
    { brandName: "Apple", modelName: "iPad 10th Gen 64GB" },
    { brandName: "Apple", modelName: "iPad Air 11-inch M2 128GB" },
    { brandName: "Apple", modelName: "iPad Pro 11-inch M4 256GB" },
    { brandName: "Samsung", modelName: "Galaxy Tab S9 FE 128GB" },
    { brandName: "Samsung", modelName: "Galaxy Tab S9 128GB" },
    { brandName: "Lenovo", modelName: "Tab P12 128GB" },
    { brandName: "Huawei", modelName: "MatePad 11.5 128GB" },
    { brandName: "Xiaomi", modelName: "Pad 6 128GB" },
    { brandName: "Microsoft", modelName: "Surface Pro 10" },
    { brandName: "Nokia", modelName: "T21 64GB" },
  ],
  WATCH: [
    { brandName: "Apple", modelName: "Watch Series 9 45mm" },
    { brandName: "Apple", modelName: "Watch SE (2nd Gen) 44mm" },
    { brandName: "Samsung", modelName: "Galaxy Watch6 44mm" },
    { brandName: "Samsung", modelName: "Galaxy Watch6 Classic 47mm" },
    { brandName: "Huawei", modelName: "Watch GT 4 46mm" },
    { brandName: "Huawei", modelName: "Watch Fit 3" },
    { brandName: "Xiaomi", modelName: "Watch 2 Pro" },
    { brandName: "OnePlus", modelName: "Watch 2" },
    { brandName: "Apple", modelName: "Watch Ultra 2" },
    { brandName: "Samsung", modelName: "Galaxy Watch5 Pro" },
  ],
  HEADPHONES: [
    { brandName: "Sony", modelName: "WH-1000XM5" },
    { brandName: "Sony", modelName: "WF-1000XM5" },
    { brandName: "Apple", modelName: "AirPods Pro (2nd generation)" },
    { brandName: "Apple", modelName: "AirPods (3rd generation)" },
    { brandName: "Samsung", modelName: "Galaxy Buds2 Pro" },
    { brandName: "Huawei", modelName: "FreeBuds Pro 3" },
    { brandName: "Logitech", modelName: "G Pro X 2 Lightspeed" },
    { brandName: "Corsair", modelName: "HS80 RGB Wireless" },
    { brandName: "SteelSeries", modelName: "Arctis Nova 7" },
    { brandName: "HyperX", modelName: "Cloud III Wireless" },
    { brandName: "Philips", modelName: "Fidelio X2HR" },
    { brandName: "Panasonic", modelName: "RB-M700B" },
  ],
  MONITOR: [
    { brandName: "Samsung", modelName: "Odyssey G5 27-inch" },
    { brandName: "Samsung", modelName: "ViewFinity S8 27-inch 4K" },
    { brandName: "LG", modelName: "UltraGear 27GP850-B" },
    { brandName: "LG", modelName: "27UP850-W 4K" },
    { brandName: "Dell", modelName: "P2723D" },
    { brandName: "Dell", modelName: "S2721DGF" },
    { brandName: "Asus", modelName: "TUF Gaming VG27AQ" },
    { brandName: "Acer", modelName: "Nitro XV272U" },
    { brandName: "MSI", modelName: "MAG 274QRF-QD" },
    { brandName: "Philips", modelName: "27E1N5600HE" },
  ],
  CONSOLE: [
    { brandName: "PlayStation", modelName: "PlayStation 5 Slim Standard" },
    { brandName: "PlayStation", modelName: "PlayStation 5 Slim Digital" },
    { brandName: "Xbox", modelName: "Xbox Series X" },
    { brandName: "Xbox", modelName: "Xbox Series S 1TB" },
    { brandName: "Nintendo", modelName: "Switch OLED" },
    { brandName: "Nintendo", modelName: "Switch Lite" },
    { brandName: "Valve", modelName: "Steam Deck OLED 512GB" },
    { brandName: "Valve", modelName: "Steam Deck LCD 256GB" },
    { brandName: "PlayStation", modelName: "PlayStation 5 Standard" },
    { brandName: "Xbox", modelName: "Xbox Series S 512GB" },
  ],
  DRESS: [
    { brandName: "Zara", modelName: "Satin Effect Midi Dress" },
    { brandName: "Mango", modelName: "Pleated Midi Dress" },
    { brandName: "Calvin Klein", modelName: "Sheath Dress" },
    { brandName: "Tommy Hilfiger", modelName: "Belted Shirt Dress" },
    { brandName: "H&M", modelName: "Rib-knit Bodycon Dress" },
    { brandName: "Zara", modelName: "Printed Wrap Dress" },
    { brandName: "Mango", modelName: "Linen Blend Dress" },
    { brandName: "Calvin Klein", modelName: "A-Line Midi Dress" },
    { brandName: "Tommy Hilfiger", modelName: "Stripe Polo Dress" },
    { brandName: "H&M", modelName: "V-neck Satin Dress" },
  ],
  TSHIRT: [
    { brandName: "Nike", modelName: "Sportswear Club T-Shirt" },
    { brandName: "Adidas", modelName: "Essentials Small Logo Tee" },
    { brandName: "Puma", modelName: "ESS Logo Tee" },
    { brandName: "Reebok", modelName: "Identity T-Shirt" },
    { brandName: "Under Armour", modelName: "Sportstyle Left Chest T-Shirt" },
    { brandName: "H&M", modelName: "Regular Fit Cotton T-Shirt" },
    { brandName: "Zara", modelName: "Basic Cotton T-Shirt" },
    { brandName: "Calvin Klein", modelName: "Monogram Logo Tee" },
    { brandName: "Tommy Hilfiger", modelName: "Essential Flag T-Shirt" },
    { brandName: "Levi's", modelName: "Original Housemark Tee" },
  ],
  JEANS: [
    { brandName: "Levi's", modelName: "501 Original Fit Jeans" },
    { brandName: "Levi's", modelName: "511 Slim Fit Jeans" },
    { brandName: "Levi's", modelName: "512 Slim Taper Jeans" },
    { brandName: "Calvin Klein", modelName: "Slim Straight Jeans" },
    { brandName: "Tommy Hilfiger", modelName: "Bleecker Slim Jeans" },
    { brandName: "Mango", modelName: "Mom Fit Jeans" },
    { brandName: "Zara", modelName: "Straight Fit Jeans" },
    { brandName: "H&M", modelName: "Slim Jeans" },
    { brandName: "H&M", modelName: "Loose Fit Jeans" },
    { brandName: "Zara", modelName: "Wide Leg Jeans" },
  ],
  SHOES: [
    { brandName: "Zara", modelName: "Leather Loafers" },
    { brandName: "Mango", modelName: "Heeled Ankle Boots" },
    { brandName: "Calvin Klein", modelName: "Leather Pump Heels" },
    { brandName: "Tommy Hilfiger", modelName: "Leather Ballet Flats" },
    { brandName: "H&M", modelName: "Block-heel Sandals" },
    { brandName: "Nike", modelName: "Court Vision Low" },
    { brandName: "Adidas", modelName: "Grand Court 2.0" },
    { brandName: "Puma", modelName: "Carina 2.0" },
    { brandName: "Reebok", modelName: "Club C 85" },
    { brandName: "New Balance", modelName: "530" },
  ],
  SHIRT: [
    { brandName: "Tommy Hilfiger", modelName: "Oxford Regular Fit Shirt" },
    { brandName: "Calvin Klein", modelName: "Slim Fit Poplin Shirt" },
    { brandName: "Zara", modelName: "Textured Cotton Shirt" },
    { brandName: "H&M", modelName: "Easy Iron Shirt" },
    { brandName: "Mango", modelName: "Regular Fit Linen Shirt" },
    { brandName: "Levi's", modelName: "Battery Housemark Shirt" },
    { brandName: "Tommy Hilfiger", modelName: "Stripe Casual Shirt" },
    { brandName: "Calvin Klein", modelName: "Stretch Solid Shirt" },
    { brandName: "Zara", modelName: "Oxford Button-Up Shirt" },
    { brandName: "H&M", modelName: "Premium Cotton Shirt" },
  ],
  SNEAKERS: [
    { brandName: "Nike", modelName: "Air Force 1 '07" },
    { brandName: "Nike", modelName: "Air Max 90" },
    { brandName: "Adidas", modelName: "Stan Smith" },
    { brandName: "Adidas", modelName: "Forum Low" },
    { brandName: "Puma", modelName: "Suede Classic XXI" },
    { brandName: "Reebok", modelName: "Classic Leather" },
    { brandName: "New Balance", modelName: "574" },
    { brandName: "New Balance", modelName: "550" },
    { brandName: "Under Armour", modelName: "Charged Assert 10" },
    { brandName: "Nike", modelName: "Dunk Low" },
  ],
  KIDS_BOYS: [
    { brandName: "Nike", modelName: "Kids Sportswear Set" },
    { brandName: "Adidas", modelName: "Kids Essentials 3-Stripes Set" },
    { brandName: "Puma", modelName: "Kids Minicats Tee & Shorts Set" },
    { brandName: "H&M", modelName: "2-piece Printed Set" },
    { brandName: "Zara", modelName: "Boys Cotton Matching Set" },
    { brandName: "Mango", modelName: "Kids Casual Set" },
    { brandName: "Under Armour", modelName: "Boys Rival Set" },
    { brandName: "Reebok", modelName: "Kids Active Set" },
    { brandName: "Nike", modelName: "Kids Club Fleece Set" },
    { brandName: "Adidas", modelName: "Kids Badge of Sport Set" },
  ],
  KIDS_GIRLS: [
    { brandName: "Nike", modelName: "Girls Sportswear Set" },
    { brandName: "Adidas", modelName: "Girls Essentials Set" },
    { brandName: "Puma", modelName: "Girls Active Set" },
    { brandName: "H&M", modelName: "2-piece Jersey Set" },
    { brandName: "Zara", modelName: "Girls Knit Matching Set" },
    { brandName: "Mango", modelName: "Girls Casual Outfit Set" },
    { brandName: "Reebok", modelName: "Girls Training Set" },
    { brandName: "Under Armour", modelName: "Girls Rival Logo Set" },
    { brandName: "Nike", modelName: "Girls Club Fleece Set" },
    { brandName: "Adidas", modelName: "Girls 3-Stripes Set" },
  ],
  BAG: [
    { brandName: "Nike", modelName: "Brasilia Backpack" },
    { brandName: "Adidas", modelName: "Classic Backpack" },
    { brandName: "Puma", modelName: "Phase Backpack" },
    { brandName: "Tommy Hilfiger", modelName: "Essential Reporter Bag" },
    { brandName: "Calvin Klein", modelName: "Monogram Crossbody Bag" },
    { brandName: "Zara", modelName: "City Mini Crossbody Bag" },
    { brandName: "Mango", modelName: "Shopper Tote Bag" },
    { brandName: "H&M", modelName: "Shoulder Bag" },
    { brandName: "Nike", modelName: "Heritage Backpack" },
    { brandName: "Adidas", modelName: "Linear Duffel Bag" },
  ],
  ACCESSORY: [
    { brandName: "Calvin Klein", modelName: "Reversible Leather Belt" },
    { brandName: "Tommy Hilfiger", modelName: "Flag Leather Belt" },
    { brandName: "Levi's", modelName: "Classic Batwing Cap" },
    { brandName: "Nike", modelName: "Sportswear Heritage86 Cap" },
    { brandName: "Adidas", modelName: "Baseball Cap" },
    { brandName: "Puma", modelName: "Ess Logo Cap" },
    { brandName: "H&M", modelName: "Leather Wallet" },
    { brandName: "Zara", modelName: "Textured Card Holder" },
    { brandName: "Mango", modelName: "Metal Buckle Belt" },
    { brandName: "Tommy Hilfiger", modelName: "Essential Flag Wallet" },
  ],
  FURNITURE: [
    { brandName: "Ikea", modelName: "KALLAX Shelf Unit" },
    { brandName: "Ikea", modelName: "LACK Coffee Table" },
    { brandName: "Ikea", modelName: "MALM Chest of Drawers" },
    { brandName: "Ikea", modelName: "HEMNES TV Unit" },
    { brandName: "Ikea", modelName: "BILLY Bookcase" },
    { brandName: "Ikea", modelName: "POÄNG Armchair" },
    { brandName: "Ikea", modelName: "LISABO Table" },
    { brandName: "Ikea", modelName: "BRIMNES Cabinet" },
    { brandName: "Ikea", modelName: "KLEPPSTAD Wardrobe Frame" },
    { brandName: "Ikea", modelName: "MICKE Desk" },
  ],
  KITCHEN: [
    { brandName: "Bosch", modelName: "Serie 4 Dishwasher" },
    { brandName: "Bosch", modelName: "Serie 6 Built-in Oven" },
    { brandName: "Siemens", modelName: "iQ300 Dishwasher" },
    { brandName: "Siemens", modelName: "iQ500 Built-in Oven" },
    { brandName: "Arçelik", modelName: "Inverter Refrigerator 270560EI" },
    { brandName: "Beko", modelName: "ExpertFry Air Fryer" },
    { brandName: "Vestel", modelName: "NF52101 Refrigerator" },
    { brandName: "Tefal", modelName: "Easy Fry & Grill Precision" },
    { brandName: "Philips", modelName: "Airfryer 5000 Series" },
    { brandName: "Dyson", modelName: "V12 Detect Slim" },
  ],
  DECOR: [
    { brandName: "Ikea", modelName: "FEJKA Artificial Potted Plant" },
    { brandName: "Ikea", modelName: "RÅSKOG Utility Cart" },
    { brandName: "Ikea", modelName: "MOLNART LED Bulb" },
    { brandName: "Ikea", modelName: "VILJESTARK Vase" },
    { brandName: "Philips Hue", modelName: "Hue Go Portable Table Lamp" },
    { brandName: "Philips Hue", modelName: "Hue Lightstrip Plus" },
    { brandName: "Zara", modelName: "Home Scented Candle" },
    { brandName: "Mango", modelName: "Home Ceramic Vase" },
    { brandName: "H&M", modelName: "Home Cotton Cushion Cover" },
    { brandName: "Ikea", modelName: "EKTORP Cushion Cover" },
  ],
  BED: [
    { brandName: "Ikea", modelName: "MALM Bed Frame" },
    { brandName: "Ikea", modelName: "BRIMNES Bed Frame with Storage" },
    { brandName: "Ikea", modelName: "HEMNES Day-bed Frame" },
    { brandName: "Ikea", modelName: "SLATTUM Upholstered Bed Frame" },
    { brandName: "Ikea", modelName: "SONGESAND Bed Frame" },
    { brandName: "Ikea", modelName: "IDANÄS Upholstered Bed Frame" },
    { brandName: "Ikea", modelName: "TUFJORD Upholstered Bed Frame" },
    { brandName: "Ikea", modelName: "NEIDEN Bed Frame" },
    { brandName: "Ikea", modelName: "NORDLI Bed with Headboard" },
    { brandName: "Ikea", modelName: "GLADSTAD Upholstered Bed" },
  ],
  WARDROBE: [
    { brandName: "Ikea", modelName: "PAX Wardrobe Frame" },
    { brandName: "Ikea", modelName: "BRIMNES Wardrobe with 3 Doors" },
    { brandName: "Ikea", modelName: "KLEPPSTAD Wardrobe with 3 Doors" },
    { brandName: "Ikea", modelName: "SONGESAND Wardrobe" },
    { brandName: "Ikea", modelName: "PLATSA Wardrobe Combination" },
    { brandName: "Ikea", modelName: "IDANÄS Wardrobe" },
    { brandName: "Ikea", modelName: "HAUGA Wardrobe with Sliding Doors" },
    { brandName: "Ikea", modelName: "VISKAFORS Wardrobe" },
    { brandName: "Ikea", modelName: "NORDKISA Open Wardrobe" },
    { brandName: "Ikea", modelName: "RAKKESTAD Wardrobe" },
  ],
  MATTRESS: [
    { brandName: "Ikea", modelName: "ÅBYGDA Foam Mattress" },
    { brandName: "Ikea", modelName: "VESTERÖY Pocket Spring Mattress" },
    { brandName: "Ikea", modelName: "VALEVÅG Pocket Spring Mattress" },
    { brandName: "Ikea", modelName: "MORGEDAL Foam Mattress" },
    { brandName: "Ikea", modelName: "HÖVÅG Pocket Spring Mattress" },
    { brandName: "Ikea", modelName: "HAMARVIK Spring Mattress" },
    { brandName: "Ikea", modelName: "HYLLSTAD Pocket Spring Mattress" },
    { brandName: "Ikea", modelName: "VÅGSTRANDA Pocket Spring Mattress" },
    { brandName: "Ikea", modelName: "MEISTERVIK Foam Mattress" },
    { brandName: "Ikea", modelName: "MALFORS Foam Mattress" },
  ],
  LIGHTING: [
    { brandName: "Philips Hue", modelName: "Hue White Ambiance E27 Bulb" },
    { brandName: "Philips Hue", modelName: "Hue Play Light Bar" },
    { brandName: "Philips Hue", modelName: "Hue Go Portable Lamp" },
    { brandName: "Philips Hue", modelName: "Hue Ceiling Light Aurelle" },
    { brandName: "Ikea", modelName: "HEKTAR Floor Lamp" },
    { brandName: "Ikea", modelName: "NOT Table Lamp" },
    { brandName: "Ikea", modelName: "RANARP Work Lamp" },
    { brandName: "Ikea", modelName: "FADO Table Lamp" },
    { brandName: "Philips", modelName: "LED Ceiling Lamp Moire" },
    { brandName: "Panasonic", modelName: "LED Desk Lamp HHLT0339" },
  ],
  FITNESS: [
    { brandName: "Nike", modelName: "Training Mat 2.0" },
    { brandName: "Adidas", modelName: "Training Mat" },
    { brandName: "Puma", modelName: "Training Duffel Bag" },
    { brandName: "Under Armour", modelName: "Project Rock Training Gloves" },
    { brandName: "Reebok", modelName: "Fitness Gloves" },
    { brandName: "Xiaomi", modelName: "Mi Smart Scale 2" },
    { brandName: "Huawei", modelName: "Band 8" },
    { brandName: "Samsung", modelName: "Galaxy Fit3" },
    { brandName: "Sony", modelName: "Float Run" },
    { brandName: "Philips", modelName: "Massage Gun PPM7323" },
  ],
  RUNNING: [
    { brandName: "Nike", modelName: "Air Zoom Pegasus 40" },
    { brandName: "Nike", modelName: "Winflo 11" },
    { brandName: "Adidas", modelName: "Supernova Rise" },
    { brandName: "Adidas", modelName: "Duramo SL" },
    { brandName: "Puma", modelName: "Velocity Nitro 3" },
    { brandName: "New Balance", modelName: "Fresh Foam X 1080v13" },
    { brandName: "Under Armour", modelName: "Charged Pursuit 3" },
    { brandName: "Reebok", modelName: "Floatride Energy 5" },
    { brandName: "Huawei", modelName: "Watch Fit 3" },
    { brandName: "Samsung", modelName: "Galaxy Watch6" },
  ],
  CAMPING: [
    { brandName: "Bosch", modelName: "GLI 18V-300 Work Light" },
    { brandName: "Philips", modelName: "LED Camping Lantern" },
    { brandName: "Panasonic", modelName: "Eneloop Pro AA Pack" },
    { brandName: "Xiaomi", modelName: "Mi Portable Electric Air Compressor 2" },
    { brandName: "Xiaomi", modelName: "Mi Power Bank 3 20000mAh" },
    { brandName: "Sony", modelName: "ICF-P26 Portable Radio" },
    { brandName: "LG", modelName: "XBOOM Go PL5" },
    { brandName: "Tefal", modelName: "Travel Mug 0.36L" },
    { brandName: "Philips", modelName: "LED Flashlight SFL1234" },
    { brandName: "Panasonic", modelName: "LED Lantern BF-BG01" },
  ],
  CYCLING: [
    { brandName: "Sigma", modelName: "BC 16.16 STS" },
    { brandName: "Sigma", modelName: "BC 10.0 WR" },
    { brandName: "Bosch", modelName: "Purion 200 eBike Display" },
    { brandName: "Bosch", modelName: "PowerTube 500 Battery" },
    { brandName: "Xiaomi", modelName: "Mi Portable Electric Air Compressor 2" },
    { brandName: "Panasonic", modelName: "Eneloop Pro AA Pack" },
    { brandName: "Philips", modelName: "Bike Light Set SafeRide" },
    { brandName: "Sony", modelName: "Action Cam HDR-AS50" },
    { brandName: "Thrustmaster", modelName: "T300 RS GT Edition" },
    { brandName: "Logitech", modelName: "C920 HD Pro Webcam" },
  ],
  FOOTBALL: [
    { brandName: "Nike", modelName: "Mercurial Vapor 15 Club" },
    { brandName: "Nike", modelName: "Academy Team Football" },
    { brandName: "Adidas", modelName: "Predator Accuracy.4" },
    { brandName: "Adidas", modelName: "UCL Training Ball" },
    { brandName: "Puma", modelName: "Future Play TT" },
    { brandName: "Puma", modelName: "Orbita 6 MS Ball" },
    { brandName: "Under Armour", modelName: "Magnetico Select 3 FG" },
    { brandName: "Reebok", modelName: "Training Shin Guards" },
    { brandName: "Nike", modelName: "Park 7 Jersey" },
    { brandName: "Adidas", modelName: "Tiro 23 League Shorts" },
  ],
  BASKETBALL: [
    { brandName: "Nike", modelName: "Precision 7" },
    { brandName: "Nike", modelName: "Elite Competition Basketball" },
    { brandName: "Adidas", modelName: "Own The Game 2.0" },
    { brandName: "Adidas", modelName: "All-Court 3.0 Basketball" },
    { brandName: "Puma", modelName: "Playmaker Pro" },
    { brandName: "Under Armour", modelName: "Jet '23" },
    { brandName: "Reebok", modelName: "BB 4000 II" },
    { brandName: "Nike", modelName: "Dri-FIT Basketball Shorts" },
    { brandName: "Adidas", modelName: "Pro Bounce Team Jersey" },
    { brandName: "Puma", modelName: "TRC Blaze Court" },
  ],
  VOLLEYBALL: [
    { brandName: "Adidas", modelName: "Stabil 16 Indoor Shoes" },
    { brandName: "Nike", modelName: "React Hyperset 2" },
    { brandName: "Puma", modelName: "Solarflash III Indoor" },
    { brandName: "Under Armour", modelName: "HOVR Highlight Ace" },
    { brandName: "Reebok", modelName: "Indoor Court Grip Knee Pad" },
    { brandName: "Nike", modelName: "Dri-FIT Volleyball Jersey" },
    { brandName: "Adidas", modelName: "Team Sleeve Knee Pads" },
    { brandName: "Puma", modelName: "Indoor Court Shorts" },
    { brandName: "Under Armour", modelName: "Team Volleyball Shorts" },
    { brandName: "Reebok", modelName: "Training Court Tee" },
  ],
  MAKEUP: [
    { brandName: "L'Oréal", modelName: "True Match Foundation" },
    {
      brandName: "Maybelline",
      modelName: "Fit Me Matte + Poreless Foundation",
    },
    { brandName: "Maybelline", modelName: "Lash Sensational Mascara" },
    { brandName: "L'Oréal", modelName: "Telescopic Mascara" },
    { brandName: "Maybelline", modelName: "SuperStay Matte Ink" },
    { brandName: "L'Oréal", modelName: "Infallible 24H Fresh Wear Foundation" },
    { brandName: "Nivea", modelName: "Lip Care Cherry Shine" },
    { brandName: "Garnier", modelName: "Micellar Cleansing Water" },
    { brandName: "Dove", modelName: "Beauty Cream Bar" },
    { brandName: "L'Oréal", modelName: "Color Riche Lipstick" },
  ],
  SKINCARE: [
    { brandName: "Nivea", modelName: "Soft Moisturizing Cream" },
    { brandName: "Nivea", modelName: "Q10 Anti-Wrinkle Day Cream" },
    { brandName: "L'Oréal", modelName: "Revitalift Filler Day Cream" },
    { brandName: "Garnier", modelName: "Vitamin C Brightening Serum" },
    { brandName: "Garnier", modelName: "Hyaluronic Aloe Serum" },
    { brandName: "Dove", modelName: "Body Love Intensive Care Lotion" },
    { brandName: "Maybelline", modelName: "Baby Skin Instant Pore Eraser" },
    { brandName: "Nivea", modelName: "MicellAIR Rose Water Cleanser" },
    { brandName: "L'Oréal", modelName: "Hydra Genius Aloe Water" },
    { brandName: "Garnier", modelName: "Micellar Gel Wash" },
  ],
  HAIRCARE: [
    { brandName: "Pantene", modelName: "Pro-V Repair & Protect Shampoo" },
    { brandName: "Pantene", modelName: "Pro-V Aqua Light Conditioner" },
    { brandName: "L'Oréal", modelName: "Elseve Dream Long Shampoo" },
    { brandName: "L'Oréal", modelName: "Elseve Hyaluron Plump Conditioner" },
    { brandName: "Garnier", modelName: "Fructis Hair Food Banana Mask" },
    { brandName: "Garnier", modelName: "Fructis Hydra Aloe Shampoo" },
    { brandName: "Nivea", modelName: "Micellar Purifying Shampoo" },
    { brandName: "Dove", modelName: "Intensive Repair Shampoo" },
    { brandName: "Dove", modelName: "Nutritive Solutions Conditioner" },
    { brandName: "Pantene", modelName: "Pro-V Keratin Protect Mask" },
  ],
  PERFUME: [
    { brandName: "Calvin Klein", modelName: "CK One Eau de Toilette" },
    {
      brandName: "Calvin Klein",
      modelName: "Eternity for Men Eau de Toilette",
    },
    { brandName: "Tommy Hilfiger", modelName: "Tommy Eau de Toilette" },
    { brandName: "Tommy Hilfiger", modelName: "Tommy Girl Eau de Toilette" },
    { brandName: "Zara", modelName: "Red Temptation Eau de Parfum" },
    { brandName: "Zara", modelName: "Vibrant Leather Eau de Parfum" },
    { brandName: "Mango", modelName: "Blue Spirit Eau de Toilette" },
    { brandName: "Mango", modelName: "Magnetic Musk Eau de Parfum" },
    { brandName: "H&M", modelName: "Sunray Eau de Toilette" },
    { brandName: "H&M", modelName: "T-Shirt Eau de Toilette" },
  ],
  SHAVING: [
    { brandName: "Gillette", modelName: "Fusion5 Razor" },
    { brandName: "Gillette", modelName: "Mach3 Turbo Razor" },
    { brandName: "Gillette", modelName: "SkinGuard Sensitive Razor" },
    { brandName: "Philips", modelName: "OneBlade QP2724/10" },
    { brandName: "Philips", modelName: "Shaver Series 5000 S5885/10" },
    { brandName: "Panasonic", modelName: "ER-GB37 Trimmer" },
    { brandName: "Panasonic", modelName: "ER-GB80 Trimmer" },
    { brandName: "Nivea", modelName: "Men Sensitive Shaving Gel" },
    { brandName: "Nivea", modelName: "Men Sensitive After Shave Balm" },
    { brandName: "Gillette", modelName: "Fusion5 Shave Gel" },
  ],
  ORALCARE: [
    { brandName: "Oral-B", modelName: "Vitality Pro Electric Toothbrush" },
    { brandName: "Oral-B", modelName: "Pro 3 Electric Toothbrush" },
    { brandName: "Oral-B", modelName: "iO 5 Electric Toothbrush" },
    { brandName: "Oral-B", modelName: "iO 4 Electric Toothbrush" },
    { brandName: "Oral-B", modelName: "iO 6 Electric Toothbrush" },
    { brandName: "Philips", modelName: "Sonicare ProtectiveClean 4300" },
    { brandName: "Philips", modelName: "Sonicare 3100 Series" },
    { brandName: "Philips", modelName: "Sonicare C2 Brush Heads 2-Pack" },
    { brandName: "Oral-B", modelName: "Essential Floss" },
    { brandName: "Oral-B", modelName: "Pro-Expert Mouthwash" },
  ],
  BODYCARE: [
    { brandName: "Dove", modelName: "Deeply Nourishing Body Wash" },
    { brandName: "Dove", modelName: "Original Beauty Cream Bar" },
    { brandName: "Nivea", modelName: "Rich Nourishing Body Lotion" },
    { brandName: "Nivea", modelName: "Creme 150ml" },
    { brandName: "Garnier", modelName: "Body Superfood Cocoa Cream" },
    {
      brandName: "L'Oréal",
      modelName: "Men Expert Hydra Energetic Shower Gel",
    },
    { brandName: "Gillette", modelName: "Clear Gel Antiperspirant" },
    { brandName: "Pantene", modelName: "Pro-V Hair & Body Mist" },
    { brandName: "Dove", modelName: "Invisible Dry Deodorant Spray" },
    { brandName: "Nivea", modelName: "Pearl & Beauty Deodorant" },
  ],
};

const getProductTypeKeyByLeafCategoryName = (leafCategoryName: string) => {
  const name = leafCategoryName.trim();

  if (name === "Android Phones") {
    return "PHONE_ANDROID";
  }

  if (name === "iPhones") {
    return "PHONE_IPHONE";
  }

  if (name === "Feature Phones") {
    return "PHONE_FEATURE";
  }

  if (name === "Gaming Laptops") {
    return "LAPTOP_GAMING";
  }

  if (name === "Ultrabooks") {
    return "LAPTOP_ULTRABOOK";
  }

  if (name === "Business Laptops") {
    return "LAPTOP_BUSINESS";
  }

  if (name === "Tablets") {
    return "TABLET";
  }

  if (name === "Smart Watches") {
    return "WATCH";
  }

  if (name === "Headphones") {
    return "HEADPHONES";
  }

  if (name === "Monitors") {
    return "MONITOR";
  }

  if (name === "Gaming Consoles") {
    return "CONSOLE";
  }

  if (name === "Dresses") {
    return "DRESS";
  }

  if (name === "T-Shirts") {
    return "TSHIRT";
  }

  if (name === "Jeans") {
    return "JEANS";
  }

  if (name === "Shoes") {
    return "SHOES";
  }

  if (name === "Shirts") {
    return "SHIRT";
  }

  if (name === "Sneakers") {
    return "SNEAKERS";
  }

  if (name === "Boys Clothing") {
    return "KIDS_BOYS";
  }

  if (name === "Girls Clothing") {
    return "KIDS_GIRLS";
  }

  if (name === "Bags") {
    return "BAG";
  }

  if (name === "Accessories") {
    return "ACCESSORY";
  }

  if (name === "Furniture") {
    return "FURNITURE";
  }

  if (name === "Kitchen") {
    return "KITCHEN";
  }

  if (name === "Home Decoration") {
    return "DECOR";
  }

  if (name === "Beds") {
    return "BED";
  }

  if (name === "Wardrobes") {
    return "WARDROBE";
  }

  if (name === "Mattresses") {
    return "MATTRESS";
  }

  if (name === "Lighting") {
    return "LIGHTING";
  }

  if (name === "Fitness") {
    return "FITNESS";
  }

  if (name === "Running") {
    return "RUNNING";
  }

  if (name === "Camping") {
    return "CAMPING";
  }

  if (name === "Cycling") {
    return "CYCLING";
  }

  if (name === "Football") {
    return "FOOTBALL";
  }

  if (name === "Basketball") {
    return "BASKETBALL";
  }

  if (name === "Volleyball") {
    return "VOLLEYBALL";
  }

  if (name === "Makeup") {
    return "MAKEUP";
  }

  if (name === "Skincare") {
    return "SKINCARE";
  }

  if (name === "Hair Care") {
    return "HAIRCARE";
  }

  if (name === "Perfume") {
    return "PERFUME";
  }

  if (name === "Shaving") {
    return "SHAVING";
  }

  if (name === "Oral Care") {
    return "ORALCARE";
  }

  if (name === "Body Care") {
    return "BODYCARE";
  }

  return "GENERIC";
};

const getProductConfigByLeafCategoryName = (
  leafCategoryName: string,
): ProductTypeConfig => {
  const typeKey = getProductTypeKeyByLeafCategoryName(leafCategoryName);

  if (
    typeKey === "PHONE_ANDROID" ||
    typeKey === "PHONE_IPHONE" ||
    typeKey === "PHONE_FEATURE"
  ) {
    return {
      typeKey,
      priceMin: typeKey === "PHONE_FEATURE" ? 799 : 10999,
      priceMax: typeKey === "PHONE_FEATURE" ? 7999 : 99999,
    };
  }

  if (typeKey === "LAPTOP_GAMING") {
    return { typeKey, priceMin: 45999, priceMax: 189999 };
  }

  if (typeKey === "LAPTOP_ULTRABOOK") {
    return { typeKey, priceMin: 34999, priceMax: 159999 };
  }

  if (typeKey === "LAPTOP_BUSINESS") {
    return { typeKey, priceMin: 32999, priceMax: 169999 };
  }

  if (typeKey === "TABLET") {
    return { typeKey, priceMin: 6999, priceMax: 89999 };
  }

  if (typeKey === "WATCH") {
    return { typeKey, priceMin: 2499, priceMax: 49999 };
  }

  if (typeKey === "HEADPHONES") {
    return { typeKey, priceMin: 699, priceMax: 24999 };
  }

  if (typeKey === "MONITOR") {
    return { typeKey, priceMin: 3999, priceMax: 69999 };
  }

  if (typeKey === "CONSOLE") {
    return { typeKey, priceMin: 14999, priceMax: 49999 };
  }

  if (
    typeKey === "DRESS" ||
    typeKey === "TSHIRT" ||
    typeKey === "JEANS" ||
    typeKey === "SHOES" ||
    typeKey === "SHIRT" ||
    typeKey === "SNEAKERS" ||
    typeKey === "KIDS_BOYS" ||
    typeKey === "KIDS_GIRLS" ||
    typeKey === "BAG" ||
    typeKey === "ACCESSORY"
  ) {
    return {
      typeKey,
      priceMin:
        typeKey === "TSHIRT" ||
        typeKey === "KIDS_BOYS" ||
        typeKey === "KIDS_GIRLS"
          ? 249
          : typeKey === "ACCESSORY"
            ? 149
            : 699,
      priceMax:
        typeKey === "DRESS"
          ? 8999
          : typeKey === "TSHIRT"
            ? 2499
            : typeKey === "JEANS"
              ? 6999
              : typeKey === "SNEAKERS" || typeKey === "SHOES"
                ? 19999
                : typeKey === "BAG"
                  ? 29999
                  : 9999,
    };
  }

  if (
    typeKey === "FURNITURE" ||
    typeKey === "KITCHEN" ||
    typeKey === "DECOR" ||
    typeKey === "BED" ||
    typeKey === "WARDROBE" ||
    typeKey === "MATTRESS" ||
    typeKey === "LIGHTING"
  ) {
    return {
      typeKey,
      priceMin:
        typeKey === "DECOR"
          ? 199
          : typeKey === "LIGHTING"
            ? 249
            : typeKey === "KITCHEN"
              ? 399
              : 2999,
      priceMax:
        typeKey === "BED" || typeKey === "WARDROBE"
          ? 169999
          : typeKey === "MATTRESS"
            ? 69999
            : typeKey === "FURNITURE"
              ? 129999
              : typeKey === "KITCHEN"
                ? 49999
                : typeKey === "LIGHTING"
                  ? 24999
                  : 15999,
    };
  }

  if (
    typeKey === "FITNESS" ||
    typeKey === "RUNNING" ||
    typeKey === "CAMPING" ||
    typeKey === "CYCLING" ||
    typeKey === "FOOTBALL" ||
    typeKey === "BASKETBALL" ||
    typeKey === "VOLLEYBALL"
  ) {
    return {
      typeKey,
      priceMin:
        typeKey === "CYCLING" ? 2499 : typeKey === "CAMPING" ? 699 : 199,
      priceMax:
        typeKey === "CYCLING"
          ? 199999
          : typeKey === "CAMPING"
            ? 89999
            : typeKey === "RUNNING"
              ? 19999
              : 14999,
    };
  }

  if (
    typeKey === "MAKEUP" ||
    typeKey === "SKINCARE" ||
    typeKey === "HAIRCARE" ||
    typeKey === "PERFUME" ||
    typeKey === "SHAVING" ||
    typeKey === "ORALCARE" ||
    typeKey === "BODYCARE"
  ) {
    return {
      typeKey,
      priceMin: typeKey === "PERFUME" ? 699 : 149,
      priceMax: typeKey === "PERFUME" ? 19999 : 8999,
    };
  }

  return {
    typeKey: "GENERIC",
    priceMin: 199,
    priceMax: 9999,
  };
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
    leafName === "Android Phones" ||
    leafName === "iPhones" ||
    leafName === "Feature Phones"
  ) {
    return joinSentences([
      `${productName} delivers a balanced smartphone experience with a clear display, smooth navigation, and dependable everyday performance.`,
      `It is a practical choice for calls, messaging, social apps, and routine daily tasks without feeling complicated to use.`,
      `The overall hardware and software combination is designed to stay responsive in typical use and support a comfortable day-to-day workflow.`,
      `For shoppers looking for a reliable device in this segment, it offers a sensible mix of usability, durability, and value.`,
    ]);
  }

  if (
    leafName === "Gaming Laptops" ||
    leafName === "Ultrabooks" ||
    leafName === "Business Laptops"
  ) {
    return joinSentences([
      `${productName} is a strong laptop option built around a practical balance of performance, portability, and day-to-day reliability.`,
      `It handles multitasking, long work sessions, and common productivity use with a smooth experience and stable overall behavior.`,
      `The design, keyboard feel, and display quality support comfortable use at home, in the office, or while traveling.`,
      `In its class, it stands out as a dependable choice for users who want long-term usability without sacrificing a premium feel.`,
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
      `${productName} is designed to provide a comfortable and consistent user experience in everyday use.`,
      `Its category-appropriate features focus on practical performance, ease of use, and long-term comfort rather than unnecessary complexity.`,
      `The overall build quality and product tuning make it suitable for both regular daily use and longer sessions when needed.`,
      `It is a well-rounded option for buyers who want a dependable product with a balanced feature set in this segment.`,
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
      `${productName} is a versatile fashion item that blends everyday comfort with a clean and modern look.`,
      `Its fit and material feel are suitable for regular wear, making it easy to use in both casual outfits and more polished combinations.`,
      `The design stays flexible and easy to pair with other wardrobe pieces, which makes styling simple across different occasions.`,
      `For buyers in this category, it offers a practical balance of appearance, comfort, and repeat-use value.`,
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
      `${productName} is a home-focused product built around everyday functionality and a clean, timeless design approach.`,
      `It is designed to support practical daily use while keeping setup, placement, and long-term usability straightforward.`,
      `The overall look works well with different interior styles, so it can fit easily into both modern and classic spaces.`,
      `This makes it a dependable choice for anyone looking for a balanced combination of utility, comfort, and design consistency.`,
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
      `${productName} is a category-appropriate sports or outdoor product built with a focus on practical comfort and regular use.`,
      `Its design supports consistent training or activity sessions by keeping handling simple and the overall experience user-friendly.`,
      `The materials and construction feel suitable for repeated use, which helps it stay reliable over time in active routines.`,
      `For this segment, it is a solid option for buyers who want dependable performance and straightforward usability.`,
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
      `${productName} is suitable for daily personal care routines and is designed to be easy to use on a regular basis.`,
      `Its formula or product structure focuses on practical, repeatable use, which makes it convenient for busy schedules.`,
      `The brand familiarity in this category and the product’s straightforward usage profile add confidence for long-term use.`,
      `It is a well-rounded choice for buyers who want a reliable personal care product with consistent everyday performance.`,
    ]);
  }

  return joinSentences([
    `${productName} is a dependable product designed for everyday use with a practical and user-friendly approach.`,
    `It focuses on delivering the core experience expected from its category without making the overall usage complicated.`,
    `The design and build aim to support long-term use while keeping comfort and simplicity at the center.`,
    `For buyers comparing similar options, it offers a balanced mix of usability, consistency, and overall value.`,
  ]);
};

const getRealCatalogItemsForLeafCategory = (leafCategoryName: string) => {
  const typeKey = getProductTypeKeyByLeafCategoryName(leafCategoryName);

  if (REAL_PRODUCTS_BY_TYPE[typeKey]?.length) {
    return REAL_PRODUCTS_BY_TYPE[typeKey];
  }

  return [] as RealCatalogItem[];
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

  const sellers = await prisma.user.findMany({
    where: { role: USER_ROLE.SELLER },
    select: { id: true },
  });

  if (!sellers.length) {
    throw new Error("❌ No sellers found. Run seedUsers first.");
  }

  const sellerIds = sellers.map((seller) => seller.id);

  const leafCategories = categories.filter((category) => {
    return !categories.some((candidate) => {
      return candidate.parentId === category.id;
    });
  });

  const brandByNameMap = new Map(brands.map((brand) => [brand.name, brand]));

  for (const category of leafCategories) {
    const config = getProductConfigByLeafCategoryName(category.name);
    const catalogItems = getRealCatalogItemsForLeafCategory(category.name);

    if (!catalogItems.length) {
      throw new Error(
        `❌ No real product catalog items mapped for leaf category: ${category.name}`,
      );
    }

    const usableCatalogItems = catalogItems.filter((catalogItem) => {
      return brandByNameMap.has(catalogItem.brandName);
    });

    if (usableCatalogItems.length < 10) {
      throw new Error(
        `❌ Category ${category.name} has only ${usableCatalogItems.length} usable catalog items. At least 10 are required.`,
      );
    }

    for (let productIndex = 0; productIndex < 10; productIndex++) {
      const catalogItem = usableCatalogItems[productIndex];
      const brand = brandByNameMap.get(catalogItem.brandName)!;
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

      const product = await prisma.product.create({
        data: {
          name: productName,
          description: descriptionText,
          stockCount,
          price: tryPrice as unknown as number,
          brandId: brand.id,
          categoryId: category.id,
          currencyId: defaultCurrency.id,
          sellerId: rand(sellerIds),
          status: PRODUCT_STATUS.APPROVED,
        },
      });

      for (let imageIndex = 0; imageIndex < DUMMY_IMAGES.length; imageIndex++) {
        const imageData = isProd
          ? await uploadToCloudinary(
              DUMMY_IMAGES[imageIndex],
              product.id,
              imageIndex,
            )
          : await createProductImages(
              DUMMY_IMAGES[imageIndex],
              product.id,
              imageIndex,
            );

        await prisma.productImage.create({
          data: {
            productId: product.id,
            ...imageData,
            isPrimary: imageIndex === 0,
          },
        });
      }
    }
  }

  console.log("✅ Product seeding completed");
};
