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
