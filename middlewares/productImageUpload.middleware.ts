import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const makeUploader = (folder: string, fieldName: string, maxCount: number) => {
  let storage: multer.StorageEngine;

  if (isProd) {
    // 🔥 PROD → MEMORY (Cloudinary için)
    storage = multer.memoryStorage();
  } else {
    // 🟢 LOCAL → DISK
    const uploadDir = path.join(__dirname, "..", "uploads", folder, "original");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
      },
    });
  }

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
      fileSize: 10 * 1024 * 1024,
      files: maxCount,
    },
  }).array(fieldName, maxCount);
};

export const uploadProductImages = makeUploader("products", "images", 10);

export const uploadNewProductImages = makeUploader(
  "products",
  "newAddedImages",
  10
);
