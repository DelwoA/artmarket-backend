import cloudinary from "../../infrastructure/cloudinary";
import type { RequestHandler } from "express";

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

// Direct upload signature (client -> Cloudinary)
export const signUpload: RequestHandler = async (req, res, next) => {
  try {
    const { folder } = (req.body as any) || {};
    const validFolder =
      typeof folder === "string" && folder.startsWith("artmarket/")
        ? folder
        : "artmarket/others";
    const timestamp = Math.round(Date.now() / 1000);
    // Signature uses the same cloudinary instance config
    const paramsToSign: any = { timestamp, folder: validFolder };
    // @ts-ignore
    const signature = (cloudinary as any).utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );
    res.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: validFolder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    next(err);
  }
};
