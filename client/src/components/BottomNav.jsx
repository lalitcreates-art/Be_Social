import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Feed", icon: "F" },
  { to: "/messages", label: "Chats", icon: "C" },
  { to: "/profile", label: "Profile", icon: "P" }
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className="bottom-nav-link">
          <span>{item.icon}</span>
          <small>{item.label}</small>
        </NavLink>
      ))}
    </nav>
  );
}
