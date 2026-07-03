import fs from "fs/promises";
import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import env from "../env";
import path from "path";

export const initCloudinary = () => {
  cloudinary.config({
    cloud_name: env.cloudinary_cloud_name,
    api_key: env.cloudinary_api_key,
    api_secret: env.cloudinary_api_secret,
  });
  console.log("🚀 Cloudinary Initialized Successfully!");
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "/backend/product/uploads"); // আপলোডের জন্য একটি টেম্পোরারি ফোল্ডার
  },
  filename: (_req, file, cb) => {
    // ফাইলের একটি ইউনিক নাম তৈরি করবে
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ২ এমবি (MB) লিমিট
  },
});

export const uploadFilesToCloudinary = async (files: Express.Multer.File[] = [], folder: string) => {
  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          public_id: file.filename,
        });

        await fs.unlink(file.path); // লোকাল ফাইল ডিলিট

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }),
    );

    return uploadedFiles;
  } catch (error) {
    // যদি কোনো এরর হয়, সব লোকাল ফাইল ডিলিট করার চেষ্টা করবে
    await Promise.all(
      files.map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch {}
      }),
    );
    throw error;
  }
};
