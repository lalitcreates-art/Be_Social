import { useState } from "react";

export function PostCard({ post, onLike, onComment, onDelete }) {
  const [comment, setComment] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
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
            <div className="image-viewer-stage">
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
