import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from "../../../api/auth.api";

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await apiLogin({ email, senha });

      const { token, usuario } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      setUser(usuario);
      setIsAuthenticated(true);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro no login'
      };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      await apiRegister({ nome, email, senha });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro no cadastro'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getUser = () => user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      getUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};