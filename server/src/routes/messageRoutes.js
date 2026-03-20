import { Router } from "express";
import { createConversation, getConversations, getMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);

export default router;
