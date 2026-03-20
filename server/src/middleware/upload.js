import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env.js";

if (!fs.existsSync(env.uploadPath)) {
  fs.mkdirSync(env.uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadPath),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  }
});

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (imageTypes.has(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

export function toPublicUpload(fileName) {
  return `/uploads/${path.basename(fileName)}`;
}
