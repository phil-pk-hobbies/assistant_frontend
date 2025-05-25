import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Assistant {
  id: string;
  name: string;
  description: string;
}

export default function HomePage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

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
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/assistants/${assistant.id}`)}
          >
            <h2 className="text-lg font-semibold">{assistant.name}</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {assistant.description}
            </p>
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
