import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, setAuthToken } from "../api/authApi";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    const interval = setInterval(() => {
      const lastActivity = Number(localStorage.getItem("lastActivity"));
      if (token && lastActivity && Date.now() - lastActivity > 30 * 60 * 1000) {
        logout();
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
      getCurrentUser(savedToken).catch(() => logout());
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("lastActivity", Date.now().toString());
    setToken(newToken);
    setAuthToken(newToken);
    navigate("/patients");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity");
    setToken(null);
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
