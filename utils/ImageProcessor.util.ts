import fs from "fs";
import path from "path";
import sharp from "sharp";

interface ProcessedImages {
  originalUrl: string;
  thumbUrl: string;
  mediumUrl: string;
  largeUrl: string;
}

export const processImage = async (
  filePath: string,
  folder: string,
  filename: string
): Promise<ProcessedImages> => {
  // Base upload directory
  const baseDir = path.join(__dirname, "..", "uploads", folder);

  // Output directories
  const thumbDir = path.join(baseDir, "thumb");
  const mediumDir = path.join(baseDir, "medium");
  const largeDir = path.join(baseDir, "large");

  // Ensure directories exist
  [thumbDir, mediumDir, largeDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Paths for resized images
  const thumbPath = path.join(thumbDir, filename);
  const mediumPath = path.join(mediumDir, filename);
  const largePath = path.join(largeDir, filename);

  // 1️⃣ Generate THUMB (200px)
  await sharp(filePath).resize(200).toFile(thumbPath);

  // 2️⃣ Generate MEDIUM (600px)
  await sharp(filePath).resize(600).toFile(mediumPath);

  // 3️⃣ Generate LARGE (1200px)
  await sharp(filePath).resize(1200).toFile(largePath);

  // Return relative URLs (FE uses these)
  return {
    originalUrl: `/uploads/${folder}/original/${filename}`,
    thumbUrl: `/uploads/${folder}/thumb/${filename}`,
    mediumUrl: `/uploads/${folder}/medium/${filename}`,
    largeUrl: `/uploads/${folder}/large/${filename}`,
  };
};
