import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
}

export default function HomePage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const deleteAssistant = async (id: string) => {
    if (!confirm('Delete this assistant?')) {
      return;
    }
    try {
      const res = await fetch(`/api/assistants/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      setAssistants((list) => list.filter((a) => a.id !== id));
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const fetchAssistants = async () => {
    try {
      const res = await fetch('/api/assistants/');
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      const data = await res.json();
      setAssistants(data);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    void fetchAssistants();
  }, []);

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assistants</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => navigate('/assistants/new')}
        >
          New Assistant
        </button>
      </div>
      <div className="grid gap-4">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="border rounded-lg p-4 cursor-pointer bg-white hover:shadow-md transition flex items-start"
            onClick={() => navigate(`/assistants/${assistant.id}`)}
          >
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-gray-900">
                {assistant.name}
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-line mb-1">
                {assistant.description}
              </p>
              <p className="text-xs text-gray-500">Model: {assistant.model}</p>
            </div>
            <button
              className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                void deleteAssistant(assistant.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {status && <p className="text-red-600">{status}</p>}
    </div>
  );
}
