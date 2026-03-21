import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
    imageUrls: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema]
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
