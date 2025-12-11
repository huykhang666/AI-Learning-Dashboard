// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';

const useAuth = () => {
  const [user, setUser] = useState(userService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await userService.login(username, password);
      setUser(userData);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await userService.logout();
    setUser(null);
    setIsLoading(false);
  };

  return { user, isLoading, error, login, logout, isAuthenticated: !!user };
};

export default useAuth;