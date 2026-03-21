import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function PostCard({ post, onLike, onComment, onDelete }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchMoved = useRef(false);
  const rawImages = Array.isArray(post.imageUrls) && post.imageUrls.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const images = rawImages.map((imageUrl) => (imageUrl.startsWith("data:") ? imageUrl : `${import.meta.env.VITE_ASSET_URL || "http://localhost:5000"}${imageUrl}`));
  const activeImage = images[activeImageIndex] || "";
  const authorAvatarUrl = post.author.id === user?.id && user?.avatarUrl ? user.avatarUrl : post.author.avatarUrl;
  const profilePath = post.author.id === user?.id ? "/profile" : `/profile/${post.author.id}`;
  const videoUrl = post.videoUrl?.startsWith("data:") || !post.videoUrl ? post.videoUrl : `${import.meta.env.VITE_ASSET_URL || "http://localhost:5000"}${post.videoUrl}`;

  async function submitComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    await onComment(post.id, comment);
    setComment("");
  }

  function goToImage(nextIndex) {
    const total = images.length;
    if (!total) return;
    setActiveImageIndex((nextIndex + total) % total);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0]?.clientX || 0;
    touchMoved.current = false;
  }

  function handleTouchEnd(event) {
    const endX = event.changedTouches[0]?.clientX || 0;
    const deltaX = endX - touchStartX.current;

    if (Math.abs(deltaX) < 35) {
      touchMoved.current = false;
      return;
    }

    touchMoved.current = true;
    if (deltaX < 0) goToImage(activeImageIndex + 1);
    else goToImage(activeImageIndex - 1);
  }

  function openViewer() {
    if (touchMoved.current) {
      touchMoved.current = false;
      return;
    }
    setViewerOpen(true);
  }

  function renderLinkedText(text) {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, index) =>
      /^https?:\/\//.test(part) ? (
        <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer" className="post-link">
          {part}
        </a>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      )
    );
  }

  return (
    <article className="card post-card">
      <div className="post-head">
        <Link className="user-link" to={profilePath}>
          <div className="avatar-shell">
            {authorAvatarUrl ? <img src={authorAvatarUrl} alt={`${post.author.name} profile`} /> : post.author.initials}
          </div>
        </Link>
        <div className="post-head-copy">
          <Link className="user-link post-author-link" to={profilePath}>
            <strong>{post.author.name}</strong>
          </Link>
        </div>
      </div>
      <p className="post-copy">{renderLinkedText(post.content)}</p>
      {videoUrl ? <video className="post-video" src={videoUrl} controls playsInline preload="metadata" /> : null}
      {images.length ? (
        <div className="carousel">
          <button
            className="carousel-image-button"
            type="button"
            onClick={openViewer}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img className="post-image" src={activeImage} alt={`Post image ${activeImageIndex + 1}`} />
          </button>
          {images.length > 1 ? (
            <div className="carousel-dots" role="tablist" aria-label="Image carousel">
              {images.map((imageSrc, index) => (
                <button
                  key={`${imageSrc}-${index}`}
                  className={index === activeImageIndex ? "carousel-dot is-active" : "carousel-dot"}
                  type="button"
                  onClick={() => goToImage(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
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
      {viewerOpen ? (
        <div className="image-viewer" onClick={() => setViewerOpen(false)}>
          <div className="image-viewer-panel" onClick={(event) => event.stopPropagation()}>
            <div className="image-viewer-toolbar">
              <span>Pinch to zoom</span>
              <button className="secondary-button" type="button" onClick={() => setViewerOpen(false)}>
                Close
              </button>
            </div>
            <div className="image-viewer-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <img className="image-viewer-image" src={activeImage} alt={`Fullscreen image ${activeImageIndex + 1}`} />
            </div>
            {images.length > 1 ? (
              <div className="carousel-dots" role="tablist" aria-label="Fullscreen image carousel">
                {images.map((imageSrc, index) => (
                  <button
                    key={`${imageSrc}-${index}-viewer`}
                    className={index === activeImageIndex ? "carousel-dot is-active" : "carousel-dot"}
                    type="button"
                    onClick={() => goToImage(index)}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
