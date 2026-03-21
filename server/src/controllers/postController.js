import asyncHandler from "express-async-handler";
import { Post } from "../models/Post.js";

function mapPost(post, currentUserId) {
  return {
    id: post._id.toString(),
    authorId: post.author._id.toString(),
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    likesCount: post.likes.length,
    likedByMe: post.likes.some((userId) => userId.toString() === currentUserId),
    canDelete: post.author._id.toString() === currentUserId,
    author: {
      id: post.author._id.toString(),
      name: post.author.name,
      headline: post.author.headline,
      avatarUrl: post.author.avatarUrl,
      initials: post.author.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("")
    },
    comments: post.comments.map((comment) => ({
      id: comment._id.toString(),
      text: comment.text,
      createdAt: comment.createdAt,
      author: {
        id: comment.author._id.toString(),
        name: comment.author.name,
        avatarUrl: comment.author.avatarUrl,
        initials: comment.author.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("")
      }
    }))
  };
}

export const getFeed = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "name headline avatarUrl")
    .populate("comments.author", "name avatarUrl");

  res.json({ posts: posts.map((post) => mapPost(post, req.user._id.toString())) });
});

export const createPost = asyncHandler(async (req, res) => {
  const content = (req.body.content || "").trim();
  const imageUrl = req.body.imageUrl || "";

  if (!content && !imageUrl) {
    res.status(400);
    throw new Error("Post content or image is required");
  }

  const post = await Post.create({
    author: req.user._id,
    content,
    imageUrl
  });

  const hydrated = await Post.findById(post._id)
    .populate("author", "name headline avatarUrl")
    .populate("comments.author", "name avatarUrl");

  const payload = mapPost(hydrated, req.user._id.toString());
  req.app.get("io").emit("post:new", { post: payload });
  res.status(201).json({ post: payload });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate("author", "name headline avatarUrl")
    .populate("comments.author", "name avatarUrl");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const currentUserId = req.user._id.toString();
  const existing = post.likes.findIndex((userId) => userId.toString() === currentUserId);

  if (existing >= 0) post.likes.splice(existing, 1);
  else post.likes.push(req.user._id);

  await post.save();
  const payload = mapPost(post, currentUserId);
  req.app.get("io").emit("post:update", { post: payload });
  res.json({ post: payload });
});

export const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  post.comments.push({ author: req.user._id, text: req.body.text });
  await post.save();

  const hydrated = await Post.findById(post._id)
    .populate("author", "name headline avatarUrl")
    .populate("comments.author", "name avatarUrl");

  const payload = mapPost(hydrated, req.user._id.toString());
  req.app.get("io").emit("post:update", { post: payload });
  res.status(201).json({ post: payload });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).populate("author", "name headline avatarUrl");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.author._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own posts");
  }

  await Post.findByIdAndDelete(post._id);
  req.app.get("io").emit("post:delete", { postId: post._id.toString() });
  res.json({ success: true });
});
