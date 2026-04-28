import { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
} from "../../../api/auth.api";
import { DEV_MODE } from "../../../config/devMode";
import { mockUser, mockToken } from "../../../api/mocks/mockData";

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else if (DEV_MODE) {
        // Auto-login in DEV_MODE
        try {
          await apiLogin({
            email: "admin@example.com",
            senha: "password123",
          });
          setIsAuthenticated(true);
          setUser(mockUser);
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await apiLogin({ email, senha });

      const { token, usuario } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      setUser(usuario);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || "Erro no login",
      };
    }
  };

  const register = async (nome, email, senha, telefone) => {
    try {
      await apiRegister({ nome, email, senha, telefone });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || "Erro no cadastro",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);

    if (!DEV_MODE) {
      window.location.href = "/login";
    }
  };

  const getUser = () => user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
