import multer from "multer";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (imageTypes.has(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
  },
  limits: { fileSize: 2 * 1024 * 1024 }
});
