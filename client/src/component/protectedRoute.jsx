// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId")

  return isAuth || userId ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
