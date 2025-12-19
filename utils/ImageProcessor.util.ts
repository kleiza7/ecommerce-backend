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
  const baseDir = path.join(__dirname, "..", "uploads", folder);

  const thumbDir = path.join(baseDir, "thumb");
  const mediumDir = path.join(baseDir, "medium");
  const largeDir = path.join(baseDir, "large");

  [thumbDir, mediumDir, largeDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const thumbPath = path.join(thumbDir, filename);
  const mediumPath = path.join(mediumDir, filename);
  const largePath = path.join(largeDir, filename);

  await sharp(filePath).resize(200).toFile(thumbPath);

  await sharp(filePath).resize(600).toFile(mediumPath);

  await sharp(filePath).resize(1200).toFile(largePath);

  return {
    originalUrl: `/uploads/${folder}/original/${filename}`,
    thumbUrl: `/uploads/${folder}/thumb/${filename}`,
    mediumUrl: `/uploads/${folder}/medium/${filename}`,
    largeUrl: `/uploads/${folder}/large/${filename}`,
  };
};
