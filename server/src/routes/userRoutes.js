import { Router } from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

router.use(protect);

router.get(
  "/suggestions",
  asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).limit(8);
    res.json({ users: users.map((user) => user.toSafeObject()) });
  })
);

router.put(
  "/me",
  asyncHandler(async (req, res) => {
    const { name, headline, bio, avatarUrl, coverUrl } = req.body;

    if (typeof name === "string" && name.trim()) req.user.name = name.trim();
    if (typeof headline === "string") req.user.headline = headline.trim();
    if (typeof bio === "string") req.user.bio = bio.trim();
    if (typeof avatarUrl === "string") req.user.avatarUrl = avatarUrl;
    if (typeof coverUrl === "string") req.user.coverUrl = coverUrl;

    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ user: user.toSafeObject() });
  })
);

export default router;
