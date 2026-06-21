import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (token) {
      setUser({ token, name, email });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userName', res.data.user.name);
    localStorage.setItem('userEmail', res.data.user.email);
    setUser({ token: res.data.token, ...res.data.user });
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userName', res.data.user.name);
    localStorage.setItem('userEmail', res.data.user.email);
    setUser({ token: res.data.token, ...res.data.user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
