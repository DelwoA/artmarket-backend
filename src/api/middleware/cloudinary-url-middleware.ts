import cloudinary from "../../infrastructure/cloudinary";

/**
 * Generates an optimized Cloudinary URL for images with auto quality and format
 * @param publicId - The public ID of the image in Cloudinary
 * @param options - Optional transformation parameters
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string;
    fetchFormat?: string;
  }
): string {
  const {
    width = 1200,
    height = 1200,
    quality = "auto",
    fetchFormat = "auto",
  } = options || {};

  return cloudinary.url(publicId, {
    transformation: [
      {
        quality,
        fetch_format: fetchFormat,
      },
      {
        width,
        height,
      },
    ],
  });
}
