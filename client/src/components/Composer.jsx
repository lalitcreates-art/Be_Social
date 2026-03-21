import { useState } from "react";

export function Composer({ onSubmit, busy }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim() && !files.length) return;
    await onSubmit({ content, files });
    setContent("");
    setFiles([]);
    setPreviews([]);
    event.target.reset();
  }

  function isVideoFile(file) {
    return file.type.startsWith("video/");
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const selectedVideo = selectedFiles.find((file) => isVideoFile(file));
    const nextFiles = selectedVideo ? [selectedVideo] : [...files.filter((file) => !isVideoFile(file)), ...selectedFiles].slice(0, 5);
    setFiles(nextFiles);
    setPreviews(
      nextFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: isVideoFile(file) ? "video" : "image"
      }))
    );
    event.target.value = "";
  }

  return (
    <form className="card composer" onSubmit={handleSubmit}>
      <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What you want to share ?" rows={4} />
      {previews.length ? (
        <div className="composer-preview">
          <div className="composer-preview-grid">
            {previews.map((preview, index) =>
              preview.type === "video" ? (
                <video key={`${preview.url}-${index}`} src={preview.url} className="composer-thumb" controls playsInline />
              ) : (
                <img key={`${preview.url}-${index}`} src={preview.url} alt={`Post preview ${index + 1}`} className="composer-thumb" />
              )
            )}
          </div>
          <div className="composer-preview-actions">
            <span>{previews[0]?.type === "video" ? "1 video selected" : `${previews.length} of 5 photos selected`}</span>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setFiles([]);
                setPreviews([]);
              }}
            >
              Remove media
            </button>
          </div>
        </div>
      ) : null}
      <div className="composer-actions">
        <label className="chip-button">
          Add up to 5 photos or 1 video
          <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple hidden onChange={handleFileChange} />
        </label>
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
