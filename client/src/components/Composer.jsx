import { useState } from "react";

export function Composer({ onSubmit, busy }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim() && !files.length) return;
    await onSubmit({ content, files });
    setContent("");
    setFiles([]);
    setPreviewUrls([]);
    event.target.reset();
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    const combinedFiles = [...files, ...selectedFiles].slice(0, 5);
    setFiles(combinedFiles);
    setPreviewUrls(combinedFiles.map((file) => URL.createObjectURL(file)));
    event.target.value = "";
  }

  return (
    <form className="card composer" onSubmit={handleSubmit}>
      <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Share what's happening on Be Social" rows={4} />
      {previewUrls.length ? (
        <div className="composer-preview">
          <div className="composer-preview-grid">
            {previewUrls.map((previewUrl, index) => (
              <img key={`${previewUrl}-${index}`} src={previewUrl} alt={`Post preview ${index + 1}`} className="composer-thumb" />
            ))}
          </div>
          <div className="composer-preview-actions">
            <span>{previewUrls.length} of 5 photos selected</span>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                setFiles([]);
                setPreviewUrls([]);
              }}
            >
              Remove photos
            </button>
          </div>
        </div>
      ) : null}
      <div className="composer-actions">
        <label className="chip-button">
          Add up to 5 photos
          <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
        </label>
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
