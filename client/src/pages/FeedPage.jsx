import { useEffect, useState } from "react";
import { Composer } from "../components/Composer.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { api } from "../lib/api.js";
import { getSocket } from "../lib/socket.js";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [feed, suggestions] = await Promise.all([api.posts.list(), api.users.suggestions()]);
    setPosts(feed.posts);
    setPeople(suggestions.users);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("be-social-token");
    const socket = getSocket(token);
    if (!socket) return;

    const onNew = ({ post }) => {
      setPosts((current) => (current.some((item) => item.id === post.id) ? current : [post, ...current]));
    };

    const onUpdate = ({ post }) => {
      setPosts((current) => current.map((item) => (item.id === post.id ? post : item)));
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
  }, []);

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
    <>
      <section className="feed-column">
        <div className="hero-card">
          <p className="eyebrow">Mobile-first community</p>
          <h2>Be Social feels natural on Android and scales to the desktop.</h2>
        </div>
        <Composer onSubmit={handleCreate} busy={busy} />
        <div className="feed-stack">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} onDelete={handleDelete} />
          ))}
        </div>
      </section>
      <aside className="side-column">
        <section className="card">
          <p className="eyebrow">Suggested people</p>
          <h3>Grow your network</h3>
          <div className="suggestion-list">
            {people.map((person) => (
              <div key={person.id} className="person-row">
                <div className="avatar-shell">{person.initials}</div>
                <div>
                  <strong>{person.name}</strong>
                  <p>{person.headline}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </>
  );
}
