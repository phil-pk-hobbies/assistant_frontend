import React, { useEffect, useState } from 'react';

interface Assistant {
  id: string;
  name: string;
}

export default function App() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

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

  const createAssistant = async () => {
    try {
      const res = await fetch('/api/assistants/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      setStatus('Assistant created successfully');
      setName('');
      void fetchAssistants();
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Assistants</h1>
      <ul className="space-y-1">
        {assistants.map((assistant) => (
          <li key={assistant.id} className="border p-2 rounded">
            {assistant.name}
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <h2 className="text-lg font-bold">Create Assistant</h2>
        <input
          className="border p-2 w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Assistant name"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={createAssistant}
        >
          Create
        </button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}
