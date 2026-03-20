import { useState } from "react";

export function Composer({ onSubmit, busy }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim() && !file) return;
    await onSubmit({ content, file });
    setContent("");
    setFile(null);
    event.target.reset();
  }

  return (
    <form className="card composer" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share what’s happening on Be Social"
        rows={4}
      />
      <div className="composer-actions">
        <label className="chip-button">
          Add photo
          <input type="file" accept="image/*" hidden onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
