import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setTokens, registerAuthHooks, clearTokens } from '../api/axios';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(() => localStorage.getItem('refresh'));

  const syncApiTokens = (acc, ref) => {
    setTokens(acc, ref);
  };

  useEffect(() => {
    registerAuthHooks({ updateAccess: setAccess, logout });
  }, []);

  useEffect(() => {
    syncApiTokens(access, refresh);
  }, [access, refresh]);

  const login = async (username, password) => {
    const { data } = await api.post('/api/token/', { username, password });
    setAccess(data.access);
    setRefresh(data.refresh);
    localStorage.setItem('refresh', data.refresh);
    const me = await api.get('/api/users/me/');
    setUser(me.data);
  };

  const logout = () => {
    setUser(null);
    setAccess(null);
    setRefresh(null);
    clearTokens();
    localStorage.removeItem('refresh');
  };

  useEffect(() => {
    if (!refresh) return;
    (async () => {
      try {
        const { data } = await api.post('/api/token/refresh/', { refresh });
        setAccess(data.access);
        const me = await api.get('/api/users/me/');
        setUser(me.data);
      } catch {
        logout();
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken: access, refreshToken: refresh, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
