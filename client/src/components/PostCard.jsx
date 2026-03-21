import { useState } from "react";

export function PostCard({ post, onLike, onComment, onDelete }) {
  const [comment, setComment] = useState("");
  const imageSrc = post.imageUrl.startsWith("data:") ? post.imageUrl : `${import.meta.env.VITE_ASSET_URL || "http://localhost:5000"}${post.imageUrl}`;

  async function submitComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    await onComment(post.id, comment);
    setComment("");
  }

  return (
    <article className="card post-card">
      <div className="post-head">
        <div className="avatar-shell">{post.author.initials}</div>
        <div>
          <strong>{post.author.name}</strong>
          <p>{post.author.headline}</p>
        </div>
      </div>
      <p className="post-copy">{post.content}</p>
      {post.imageUrl ? <img className="post-image" src={imageSrc} alt="" /> : null}
      <div className="post-stats">
        <span>{post.likesCount} likes</span>
        <span>{post.comments.length} comments</span>
      </div>
      <div className="post-actions">
        <button className={post.likedByMe ? "secondary-button active" : "secondary-button"} onClick={() => onLike(post.id)}>
          {post.likedByMe ? "Liked" : "Like"}
        </button>
        {post.canDelete ? (
          <button className="secondary-button" onClick={() => onDelete(post.id)}>
            Delete
          </button>
        ) : null}
      </div>
      <div className="comment-list">
        {post.comments.map((item) => (
          <div key={item.id} className="comment-item">
            <strong>{item.author.name}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={submitComment}>
        <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment" />
      </form>
    </article>
  );
}
