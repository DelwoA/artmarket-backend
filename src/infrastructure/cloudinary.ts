import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions } from "cloudinary";
import "dotenv/config";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  throw new Error(
    "Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
  );
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export async function uploadImage(file: string | Buffer, publicId?: string) {
  const options: UploadApiOptions = {
    folder: "artmarket/artists",
  };
  if (publicId !== undefined) {
    options.public_id = publicId;
  }
  return cloudinary.uploader.upload(file as any, options);
}

export function optimizedUrl(publicId: string) {
  return cloudinary.url(publicId, { fetch_format: "auto", quality: "auto" });
}

export function squareCropUrl(publicId: string) {
  return cloudinary.url(publicId, {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });
}

export default cloudinary;
