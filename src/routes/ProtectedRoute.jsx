import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      <header className="p-2 border-b flex justify-between items-center">
        <span className="text-sm text-gray-700">Logged in as {user.username}</span>
        <button
          className="text-accentBlue underline"
          onClick={logout}
        >
          Log out
        </button>
      </header>
      <Outlet />
    </>
  );
}
