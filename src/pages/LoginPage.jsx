import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const from = location.state?.from?.pathname || '/assistants';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="space-y-1">
          <label className="block">
            Username
            <input
              className="border p-2 w-full rounded focus:outline focus:outline-2 focus:outline-accent"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className="space-y-1">
          <label className="block">
            Password
            <input
              className="border p-2 w-full rounded focus:outline focus:outline-2 focus:outline-accent"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded" type="submit">
          Login
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
