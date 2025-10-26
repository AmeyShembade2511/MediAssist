// frontend/src/auth/AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import { loginUser, refreshAccessToken, logout as apiLogout } from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));

  useEffect(() => {
    // If refreshToken exists, try refresh on startup
    async function tryRefresh() {
      if (refreshToken) {
        const data = await refreshAccessToken(refreshToken);
        if (data && data.accessToken) {
          setAccessToken(data.accessToken);
        } else {
          // invalid refresh
          localStorage.removeItem("refreshToken");
          setRefreshToken(null);
        }
      }
    }
    tryRefresh();
  }, []);

  async function login({ email, password }) {
    const data = await loginUser({ email, password });
    if (data && data.accessToken) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      return { ok: true, user: data.user };
    } else {
      return { ok: false, error: data.error || "Login failed" };
    }
  }

  async function register({ email, password, full_name }) {
    const data = await fetch(`${process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000"}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name }),
    }).then(r => r.json());
    return data;
  }

  async function doLogout() {
    if (refreshToken) {
      await apiLogout(refreshToken);
      localStorage.removeItem("refreshToken");
    }
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  // helper to call protected endpoints with automatic refresh fallback could be added
  const value = { accessToken, user, login, register, logout: doLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
