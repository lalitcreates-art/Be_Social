export function TopBar({ title, subtitle, actions }) {
  return (
    <header className="top-bar">
      <div>
        {subtitle ? <p className="eyebrow">{subtitle}</p> : null}
        <h1>{title}</h1>
      </div>
      <div className="top-bar-actions">{actions}</div>
    </header>
  );
}
