import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", headline: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      headline: user?.headline || "",
      bio: user?.bio || ""
    });
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.users.updateMe(form);
      setUser(response.user);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="avatar-shell large">{user?.initials}</div>
        <div>
          <p className="eyebrow">Profile</p>
          <h2>{user?.name}</h2>
          <p>{user?.headline}</p>
        </div>
      </div>
      <div className="profile-grid">
        <form className="card profile-form" onSubmit={handleSubmit}>
          <h3>Edit profile</h3>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" />
          <input value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} placeholder="Headline" />
          <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} rows={4} placeholder="Bio" />
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
        <article className="card">
          <h3>Bio</h3>
          <p>{user?.bio}</p>
        </article>
      </div>
    </section>
  );
}
