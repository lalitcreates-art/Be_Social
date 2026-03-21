import { useState } from "react";

export function PostCard({ post, onLike, onComment, onDelete }) {
  const [comment, setComment] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const rawImages = Array.isArray(post.imageUrls) && post.imageUrls.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const images = rawImages.map((imageUrl) => (imageUrl.startsWith("data:") ? imageUrl : `${import.meta.env.VITE_ASSET_URL || "http://localhost:5000"}${imageUrl}`));
  const activeImage = images[activeImageIndex] || "";

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
    setZoom(1);
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
      {images.length ? (
        <div className="carousel">
          <button className="carousel-image-button" type="button" onClick={() => setViewerOpen(true)}>
            <img className="post-image" src={activeImage} alt={`Post image ${activeImageIndex + 1}`} />
          </button>
          {images.length > 1 ? (
            <div className="carousel-controls">
              <button className="secondary-button" type="button" onClick={() => goToImage(activeImageIndex - 1)}>
                Prev
              </button>
              <span>
                {activeImageIndex + 1} / {images.length}
              </span>
              <button className="secondary-button" type="button" onClick={() => goToImage(activeImageIndex + 1)}>
                Next
              </button>
            </div>
          ) : null}
          {images.length > 1 ? (
            <div className="carousel-thumbs">
              {images.map((imageSrc, index) => (
                <button
                  key={`${imageSrc}-${index}`}
                  className={index === activeImageIndex ? "carousel-thumb is-active" : "carousel-thumb"}
                  type="button"
                  onClick={() => goToImage(index)}
                >
                  <img src={imageSrc} alt={`Thumbnail ${index + 1}`} />
                </button>
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
              <button className="secondary-button" type="button" onClick={() => setZoom((current) => Math.max(1, current - 0.25))}>
                Zoom out
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button className="secondary-button" type="button" onClick={() => setZoom((current) => Math.min(3, current + 0.25))}>
                Zoom in
              </button>
              <button className="secondary-button" type="button" onClick={() => setViewerOpen(false)}>
                Close
              </button>
            </div>
            <div className="image-viewer-stage">
              <img
                className="image-viewer-image"
                src={activeImage}
                alt={`Fullscreen image ${activeImageIndex + 1}`}
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            {images.length > 1 ? (
              <div className="carousel-controls">
                <button className="secondary-button" type="button" onClick={() => goToImage(activeImageIndex - 1)}>
                  Prev
                </button>
                <span>
                  {activeImageIndex + 1} / {images.length}
                </span>
                <button className="secondary-button" type="button" onClick={() => goToImage(activeImageIndex + 1)}>
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
