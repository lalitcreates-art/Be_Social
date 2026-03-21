import asyncHandler from "express-async-handler";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  res.status(201).json({ imageUrl });
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Media file is required");
  }

  const mediaUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
  res.status(201).json({ mediaUrl, mediaType });
});
