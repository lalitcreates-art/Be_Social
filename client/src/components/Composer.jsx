import { useState } from "react";

export function Composer({ onSubmit, busy }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim() && !file) return;
    await onSubmit({ content, file });
    setContent("");
    setFile(null);
    setPreviewUrl("");
    event.target.reset();
  }

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : "");
  }

  return (
    <form className="card composer" onSubmit={handleSubmit}>
      <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Share what's happening on Be Social" rows={4} />
      {previewUrl ? (
        <div className="composer-preview">
          <img src={previewUrl} alt="Post preview" className="post-image" />
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              setFile(null);
              setPreviewUrl("");
            }}
          >
            Remove photo
          </button>
        </div>
      ) : null}
      <div className="composer-actions">
        <label className="chip-button">
          Add photo
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </label>
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
