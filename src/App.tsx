import React from 'react';
import ThemeToggle from './components/ThemeToggle';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateAssistantPage from './pages/CreateAssistantPage';
import EditAssistantPage from './pages/EditAssistantPage';
import ChatPage from './pages/ChatPage';
import VectorStoreFilesPage from './pages/VectorStoreFilesPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import RequireAdmin from './routes/RequireAdmin';
import AdminUsers from './pages/AdminUsers';
import AdminDepartments from './pages/AdminDepartments.jsx';

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/assistants" replace />} />
        <Route path="/assistants" element={<HomePage />} />
        <Route path="/assistants/new" element={<CreateAssistantPage />} />
        <Route path="/assistants/:id/edit" element={<EditAssistantPage />} />
        <Route path="/assistants/:id" element={<ChatPage />} />
        <Route path="/assistants/:id/vector-store" element={<VectorStoreFilesPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
        </Route>
      </Route>
    </Routes>
    <ThemeToggle />
    </>
  );
}
