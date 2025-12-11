// src/context/UserContext.jsx
import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const auth = useAuth(); // Sử dụng hook đã tạo

  return (
    <UserContext.Provider value={auth}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};