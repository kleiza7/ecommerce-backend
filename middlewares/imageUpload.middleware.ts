import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

// 🔥 Dynamic Multer builder
const makeUploader = (folder: string, fieldName: string, maxCount: number) => {
  const uploadDir = path.join(__dirname, "..", "uploads", folder, "original");

  // Ensure folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
    },
  });

  // Allow only image file types
  const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, or WEBP images allowed!"), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: maxCount,
    },
  }).array(fieldName, maxCount);
};

// 🟩 EXPORT TWO SEPARATE MIDDLEWARES

// CREATE → images[]
export const uploadProductImages = makeUploader("products", "images", 10);

// UPDATE → newAddedImages[]
export const uploadNewProductImages = makeUploader(
  "products",
  "newAddedImages",
  10
);
