import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // Backend e token verify korar jnno API call
    API.get('/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setIsAuthenticated(true);
    })
    .catch(() => {
      // টোকেন বা ইউজার ডেটা ভুল বা এক্সপায়ার্ড হলে সবকিছু পুরোপুরি মুছে ফেলা
      localStorage.clear(); // অথবা localStorage.removeItem('token'); localStorage.removeItem('user');
      setIsAuthenticated(false);
    });
  }, [token]);

  if (isAuthenticated === null) {
    return <div className="text-center py-20">Loading security check...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}