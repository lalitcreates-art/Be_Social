import { Router } from "express";
import { addComment, createPost, getFeed, toggleLike } from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getFeed);
router.post("/", createPost);
router.post("/:postId/like", toggleLike);
router.post("/:postId/comments", addComment);

export default router;
