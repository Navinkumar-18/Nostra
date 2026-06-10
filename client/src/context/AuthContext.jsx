import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = api.getUser();
    if (storedUser && api.isLoggedIn()) {
      setUserState(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    api.setToken(data.token);
    api.setUser(data.user);
    setUserState(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api.auth.register(name, email, password);
    api.setToken(data.token);
    api.setUser(data.user);
    setUserState(data.user);
    return data.user;
  };

  const logout = () => {
    api.removeToken();
    api.removeUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
