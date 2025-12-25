import type { ProductImage } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";
import { prisma } from "../config/prisma";

const UPLOAD_ROOT = path.join(__dirname, "..", "uploads", "products");
const isProd = process.env.NODE_ENV === "production";

/* ===========================
   LOCAL IMPLEMENTATION
=========================== */

const localProcessImages = async (
  productId: number,
  files: Express.Multer.File[]
): Promise<void> => {
  const folders = ["original", "thumb", "medium", "large"] as const;

  for (const f of folders) {
    await fs.mkdir(path.join(UPLOAD_ROOT, f), { recursive: true });
  }

  for (const file of files) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const originalPath = path.join(UPLOAD_ROOT, "original", filename);
    const thumbPath = path.join(UPLOAD_ROOT, "thumb", filename);
    const mediumPath = path.join(UPLOAD_ROOT, "medium", filename);
    const largePath = path.join(UPLOAD_ROOT, "large", filename);

    await fs.rename(file.path, originalPath);

    await sharp(originalPath).resize(200).toFile(thumbPath);
    await sharp(originalPath).resize(600).toFile(mediumPath);
    await sharp(originalPath).resize(1200).toFile(largePath);

    await prisma.productImage.create({
      data: {
        productId,
        originalUrl: `/uploads/products/original/${filename}`,
        thumbUrl: `/uploads/products/thumb/${filename}`,
        mediumUrl: `/uploads/products/medium/${filename}`,
        largeUrl: `/uploads/products/large/${filename}`,
        isPrimary: false,
      },
    });
  }
};

/* ===========================
   PRODUCTION IMPLEMENTATION
=========================== */

const prodProcessImages = async (
  productId: number,
  files: Express.Multer.File[]
): Promise<void> => {
  for (const file of files) {
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        })
        .end(file.buffer);
    });

    const { secure_url, public_id } = uploadResult;

    await prisma.productImage.create({
      data: {
        productId,
        originalUrl: secure_url,
        thumbUrl: cloudinary.url(public_id, { width: 200, crop: "scale" }),
        mediumUrl: cloudinary.url(public_id, { width: 600, crop: "scale" }),
        largeUrl: cloudinary.url(public_id, { width: 1200, crop: "scale" }),
        publicId: public_id,
        isPrimary: false,
      },
    });
  }
};

/* ===========================
   PUBLIC API — CREATE / UPDATE
=========================== */

export const processProductImages = async (
  productId: number,
  files: Express.Multer.File[]
): Promise<void> => {
  if (!files?.length) return;

  if (isProd) {
    await prodProcessImages(productId, files);
  } else {
    await localProcessImages(productId, files);
  }

  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { id: "asc" },
  });

  if (images.length && !images.some((i) => i.isPrimary)) {
    await prisma.productImage.update({
      where: { id: images[0].id },
      data: { isPrimary: true },
    });
  }
};

/* ===========================
   DELETE (LOCAL + PROD)
=========================== */

const deleteLocalImages = async (image: ProductImage): Promise<void> => {
  const urls = [
    image.originalUrl,
    image.thumbUrl,
    image.mediumUrl,
    image.largeUrl,
  ];

  for (const url of urls) {
    try {
      await fs.unlink(path.join(__dirname, "..", url));
    } catch {}
  }
};

const deleteProdImages = async (image: ProductImage): Promise<void> => {
  if (!image.publicId) return;

  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", image.publicId);
  }
};

export const deleteProductImages = async (
  images: ProductImage[]
): Promise<void> => {
  if (!images.length) return;

  for (const img of images) {
    if (isProd) {
      await deleteProdImages(img);
    } else {
      await deleteLocalImages(img);
    }
  }
};
