import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
        const response = await api.get("/uzytkownicy/me", {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Błąd pobierania danych użytkownika:", error);
      logout(); // bezpieczeństwo
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const autoLogin = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        await login(savedToken);
      } else {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        rola: user?.rola || null,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
