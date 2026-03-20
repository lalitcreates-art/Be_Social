export function TopBar({ title, subtitle, actions }) {
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <div className="top-bar-actions">{actions}</div>
    </header>
  );
}
