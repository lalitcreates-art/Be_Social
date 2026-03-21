import { Router } from "express";
import { uploadImage, uploadMedia } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import { upload, uploadMediaMiddleware } from "../middleware/upload.js";

const router = Router();

router.post("/image", protect, upload.single("image"), uploadImage);
router.post("/media", protect, uploadMediaMiddleware.single("media"), uploadMedia);

export default router;
