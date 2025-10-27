import { logoutUser, refreshToken } from "#api/authApi";
import { AuthContext } from "#context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout error:", err);
    }
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { accessToken } = await refreshToken();
        login(accessToken);
      } catch {
        logout();
      }
    };

    if (!token) tryRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
