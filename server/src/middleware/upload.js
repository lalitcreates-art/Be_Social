import multer from "multer";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const mediaTypes = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (imageTypes.has(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
  },
  limits: { fileSize: 8 * 1024 * 1024 }
});

export const uploadMediaMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (mediaTypes.has(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, WEBP, MP4, WEBM, and MOV files are allowed"));
  },
  limits: { fileSize: 20 * 1024 * 1024 }
});
