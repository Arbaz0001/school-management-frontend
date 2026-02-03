import { createContext, useState } from "react";

// ✅ NAMED EXPORT
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Refresh user profile from server (populates student when available)
  const refreshUser = async (api) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !api) return null;
      const res = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("refreshUser failed", err);
      return null;
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
