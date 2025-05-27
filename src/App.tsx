import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateAssistantPage from './pages/CreateAssistantPage';
import EditAssistantPage from './pages/EditAssistantPage';
import ChatPage from './pages/ChatPage';
import VectorStoreFilesPage from './pages/VectorStoreFilesPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/assistants" replace />} />
        <Route path="/assistants" element={<HomePage />} />
        <Route path="/assistants/new" element={<CreateAssistantPage />} />
        <Route path="/assistants/:id/edit" element={<EditAssistantPage />} />
        <Route path="/assistants/:id" element={<ChatPage />} />
        <Route path="/assistants/:id/vector-store" element={<VectorStoreFilesPage />} />
      </Route>
    </Routes>
  );
}
