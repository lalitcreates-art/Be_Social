import asyncHandler from "express-async-handler";
import { toPublicUpload } from "../middleware/upload.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  res.status(201).json({ imageUrl: toPublicUpload(req.file.filename) });
});
