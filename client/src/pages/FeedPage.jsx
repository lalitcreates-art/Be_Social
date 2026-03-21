import { useEffect, useState } from "react";
import { Composer } from "../components/Composer.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import { getSocket } from "../lib/socket.js";

export function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const feed = await api.posts.list();
    setPosts(feed.posts);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("be-social-token");
    const socket = getSocket(token);
    if (!socket) return;

    const mergeSharedPost = (incomingPost) => ({
      ...incomingPost,
      canDelete: incomingPost.authorId === user?.id,
      likedByMe: false
    });

    const onNew = ({ post }) => {
      setPosts((current) => (current.some((item) => item.id === post.id) ? current : [mergeSharedPost(post), ...current]));
    };

    const onUpdate = ({ post }) => {
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                ...post,
                canDelete: post.authorId === user?.id,
                likedByMe: item.likedByMe
              }
            : item
        )
      );
    };

    const onDelete = ({ postId }) => {
      setPosts((current) => current.filter((item) => item.id !== postId));
    };

    socket.on("post:new", onNew);
    socket.on("post:update", onUpdate);
    socket.on("post:delete", onDelete);

    return () => {
      socket.off("post:new", onNew);
      socket.off("post:update", onUpdate);
      socket.off("post:delete", onDelete);
    };
  }, [user]);

  async function handleCreate({ content, file }) {
    setBusy(true);
    try {
      let imageUrl = "";
      if (file) {
        const upload = await api.uploads.image(file);
        imageUrl = upload.imageUrl;
      }
      const response = await api.posts.create({ content, imageUrl });
      setPosts((current) => (current.some((item) => item.id === response.post.id) ? current : [response.post, ...current]));
    } finally {
      setBusy(false);
    }
  }

  async function handleLike(postId) {
    const response = await api.posts.like(postId);
    setPosts((current) => current.map((post) => (post.id === postId ? response.post : post)));
  }

  async function handleComment(postId, text) {
    const response = await api.posts.comment(postId, { text });
    setPosts((current) => current.map((post) => (post.id === postId ? response.post : post)));
  }

  async function handleDelete(postId) {
    await api.posts.remove(postId);
    setPosts((current) => current.filter((post) => post.id !== postId));
  }

  return (
    <section className="feed-column">
      <div className="hero-card">
        <p className="eyebrow">Private social space</p>
        <h2>A simple place for your family and friends to post, chat, and stay connected.</h2>
      </div>
      <Composer onSubmit={handleCreate} busy={busy} />
      <div className="feed-stack">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} onDelete={handleDelete} />
        ))}
      </div>
    </section>
  );
}
