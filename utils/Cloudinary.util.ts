import cloudinary from "../config/cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  filename: string,
): Promise<{ secureUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "products",
          public_id: filename,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Cloudinary upload failed"));
          }

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      )
      .end(buffer);
  });
};
