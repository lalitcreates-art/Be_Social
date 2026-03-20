import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: "New to Be Social." },
    headline: { type: String, default: "Sharing moments and ideas." },
    avatarUrl: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    bio: this.bio,
    headline: this.headline,
    avatarUrl: this.avatarUrl,
    coverUrl: this.coverUrl,
    followersCount: this.followers.length,
    followingCount: this.following.length,
    initials: this.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("")
  };
};

export const User = mongoose.model("User", userSchema);
