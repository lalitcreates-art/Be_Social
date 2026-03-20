import { useAuth } from "../context/AuthContext.jsx";

export function ProfilePage() {
  const { user } = useAuth();

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
        <article className="card">
          <h3>Bio</h3>
          <p>{user?.bio}</p>
        </article>
        <article className="card stat-card">
          <strong>{user?.followersCount ?? 0}</strong>
          <span>Followers</span>
        </article>
        <article className="card stat-card">
          <strong>{user?.followingCount ?? 0}</strong>
          <span>Following</span>
        </article>
      </div>
    </section>
  );
}
