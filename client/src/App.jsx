import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { Shell } from "./components/Shell.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { FeedPage } from "./pages/FeedPage.jsx";
import { MessagesPage } from "./pages/MessagesPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";

function Protected() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading Be Social...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <Shell />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<Protected />}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
