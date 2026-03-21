import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const { userId } = useParams();
  const isOwnProfile = !userId || userId === user?.id;
  const [profile, setProfile] = useState(user);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOwnProfile) {
      setProfile(user);
      return;
    }

    api.users.getById(userId).then((response) => setProfile(response.user)).catch(console.error);
  }, [isOwnProfile, user, userId]);

  useEffect(() => {
    const source = isOwnProfile ? user : profile;
    setForm({
      name: source?.name || "",
      bio: source?.bio || ""
    });
  }, [isOwnProfile, profile, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isOwnProfile) return;
    setError("");
    setSaving(true);
    try {
      const response = await api.users.updateMe(form);
      setUser(response.user);
      setProfile(response.user);
    } catch (err) {
      setError(err.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file || !isOwnProfile) return;

    setError("");
    setUploadingAvatar(true);
    try {
      const upload = await api.uploads.image(file);
      const response = await api.users.updateMe({ avatarUrl: upload.imageUrl });
      setUser(response.user);
      setProfile(response.user);
    } catch (err) {
      setError(err.message || "Could not upload profile picture");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="avatar-shell large">
          {profile?.avatarUrl ? <img src={profile.avatarUrl} alt={`${profile.name} profile`} /> : profile?.initials}
        </div>
        <div>
          <p className="eyebrow">Profile</p>
          <h2>{profile?.name}</h2>
        </div>
      </div>
      <div className="profile-grid">
        <form className="card profile-form" onSubmit={handleSubmit}>
          <h3>{isOwnProfile ? "Edit profile" : "Profile details"}</h3>
          {isOwnProfile ? (
            <label className="chip-button profile-upload">
              {uploadingAvatar ? "Uploading photo..." : "Change profile picture"}
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </label>
          ) : null}
          {error ? <p className="error-copy">{error}</p> : null}
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Name"
            disabled={!isOwnProfile}
          />
          <textarea
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
            rows={4}
            placeholder="Bio"
            disabled={!isOwnProfile}
          />
          {isOwnProfile ? (
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </button>
          ) : null}
        </form>
        <article className="card">
          <h3>Bio</h3>
          <p>{profile?.bio}</p>
        </article>
      </div>
    </section>
  );
}
