// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api/axios.config.js";

const AuthContext = createContext(null);

// ─── Token helpers (sessionStorage preferred over localStorage for JWTs) ──────
// sessionStorage is cleared when the tab closes, reducing token theft window.
// For production, prefer httpOnly cookies set by the server (most secure).
const TOKEN_KEY = "auth_token";
const storeToken = (t) => sessionStorage.setItem(TOKEN_KEY, t);
const readToken = () => sessionStorage.getItem(TOKEN_KEY);
const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate the stored token and fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = readToken();
      if (!token) { setLoading(false); return; }

      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data?.user || res.data);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = useCallback((token, userData) => {
    storeToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
