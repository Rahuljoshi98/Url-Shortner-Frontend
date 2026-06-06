'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout } from '@/lib/api';

const AuthContext = createContext(null);

// Decode JWT payload without a library (base64 decode middle segment)
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { userId, email }
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      setToken(storedToken);
      setUser(decoded ? { userId: decoded.userId, email: decoded.email } : null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    // Backend returns: { data: { token } } — no user object
    const { token: newToken } = res.data.data;
    const decoded = parseJwt(newToken);
    const newUser = decoded ? { userId: decoded.userId, email: decoded.email } : { email };

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch (_) {}
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
