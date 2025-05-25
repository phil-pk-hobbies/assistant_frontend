import React, { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

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
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 space-y-2 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Create Assistant</h1>
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
      {status && <p>{status}</p>}
    </div>
  );
}
