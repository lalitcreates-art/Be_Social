import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BottomNav } from "./BottomNav.jsx";
import { TopBar } from "./TopBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Shell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const titles = {
    "/": { title: "Be Social", subtitle: "" },
    "/messages": { title: "Messages", subtitle: "Direct conversations" },
    "/profile": { title: "Profile", subtitle: "Your personal details" }
  };

  const current = titles[location.pathname] || titles["/"];

  return (
    <div className="app-shell">
      <TopBar
        title={current.title}
        subtitle={current.subtitle}
        actions={
          <>
            <div className="user-pill">
              <span className="avatar-shell tiny">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name} profile`} /> : user?.initials || "BS"}
              </span>
              <strong>{user?.name}</strong>
            </div>
            <button
              className="ghost-button"
              onClick={() => {
                logout();
                navigate("/auth");
              }}
            >
              Logout
            </button>
          </>
        }
      />
      <main className="content-grid">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
