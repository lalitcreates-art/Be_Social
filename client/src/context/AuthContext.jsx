import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("be-social-token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.auth
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("be-social-token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const data = await api.auth.login(credentials);
    localStorage.setItem("be-social-token", data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const data = await api.auth.register(payload);
    localStorage.setItem("be-social-token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("be-social-token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
