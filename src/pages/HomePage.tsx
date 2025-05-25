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
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Assistants</h1>
      <div className="grid gap-4">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50 flex items-start"
            onClick={() => navigate(`/assistants/${assistant.id}`)}
          >
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{assistant.name}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {assistant.description}
              </p>
              <p className="text-sm text-gray-500">Model: {assistant.model}</p>
            </div>
            <button
              className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
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
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate('/assistants/new')}
      >
        New Assistant
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
