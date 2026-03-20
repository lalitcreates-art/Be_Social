import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function buildAuthResponse(user) {
  return {
    token: generateToken(user._id.toString()),
    user: user.toSafeObject()
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(buildAuthResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});
