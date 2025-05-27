import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin() {
  const { user } = useAuth();
  if (!user?.is_staff) {
    return <p>403 Forbidden</p>;
  }
  return <Outlet />;
}
