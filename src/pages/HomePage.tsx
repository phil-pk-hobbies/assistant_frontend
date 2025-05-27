import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAssistants } from '../hooks/useAssistants';
import AssistantCard from '../components/AssistantCard';

export interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
}

export default function HomePage() {
  const { data: assistants, isLoading } = useAssistants();
  const [status, setStatus] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [messagesByAssistant, setMessagesByAssistant] = useState<Record<string, Message[]>>({});
  const navigate = useNavigate();
  const qc = useQueryClient();

  const deleteAssistant = async (id: string) => {
    if (!confirm('Delete this assistant?')) {
      return;
    }
    try {
      await api.delete(`/api/assistants/${id}/`);
      qc.invalidateQueries({ queryKey: ['assistants'] });
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const fetchMessagesForAssistant = async (id: string) => {
    if (messagesByAssistant[id]) {
      return;
    }
    try {
      const res = await api.get(`/api/messages/?assistant=${id}`);
      setMessagesByAssistant((m) => ({ ...m, [id]: res.data }));
    } catch {
      // ignore errors
    }
  };


  useEffect(() => {
    if (search.trim() !== '') {
      assistants.forEach((a) => {
        void fetchMessagesForAssistant(a.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, assistants]);

  const list = assistants ?? [];
  const visible = list.filter((a) => {
    if (filter !== 'all' && a.model !== filter) {
      return false;
    }
    const q = search.trim().toLowerCase();
    if (q === '') {
      return true;
    }
    if (a.name.toLowerCase().includes(q) || a.model.toLowerCase().includes(q)) {
      return true;
    }
    const msgs = messagesByAssistant[a.id] || [];
    return msgs.some((m) => m.content.toLowerCase().includes(q));
  });

  return (
    <div className="p-4 space-y-4 max-w-[640px] mx-auto relative">
      <h1 className="text-xl font-bold">Assistants</h1>
      <div className="flex gap-2" role="group" aria-label="model filter">
        {['all', 'gpt-4o', 'o3-mini'].map((m) => (
          <label key={m} className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="filter"
              value={m}
              checked={filter === m}
              onChange={() => setFilter(m)}
            />
            {m === 'all' ? 'All' : m}
          </label>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        className="border p-1 rounded w-full"
        aria-label="Search"
      />
      <div className="grid gap-4">
        {isLoading && (
          <div className="animate-pulse space-y-2">
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        )}
        {!isLoading && visible.map((assistant) => (
          <AssistantCard key={assistant.id} assistant={assistant as any} onDelete={deleteAssistant} />
        ))}
        {!isLoading && visible.length === 0 && (
          <div className="text-center text-gray-500">No assistants yet – create or request access</div>
        )}
      </div>
      <button
        className="bg-accent text-white px-4 py-2 rounded-full fixed bottom-6 right-6 focus:outline focus:outline-2 focus:outline-accent"
        onClick={() => navigate('/assistants/new')}
        aria-label="New Assistant"
      >
        +
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
