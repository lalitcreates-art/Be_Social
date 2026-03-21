import { Router } from "express";
import { addComment, createPost, deletePost, getFeed, toggleLike } from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getFeed);
router.post("/", createPost);
router.post("/:postId/like", toggleLike);
router.post("/:postId/comments", addComment);
router.delete("/:postId", deletePost);

export default router;
