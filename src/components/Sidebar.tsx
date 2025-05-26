import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Assistant } from '../pages/HomePage';

interface SidebarContextValue {
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('SidebarContext not found');
  }
  return ctx;
}

interface SidebarProps {
  assistants: Assistant[];
  initialSelectedId?: string | null;
  children: React.ReactNode;
}

export function SidebarProvider({ assistants, initialSelectedId = null, children }: SidebarProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    if (selectedId) {
      navigate(`/assistants/${selectedId}`);
    }
  }, [selectedId, navigate]);

  return (
    <SidebarContext.Provider value={{ selectedId, setSelectedId }}>
      <aside className="sidebar w-72 border-r overflow-y-auto flex flex-col">
        <h1 className="p-4 text-xl font-bold">Assistants</h1>
        <nav className="grid gap-2 p-2 flex-grow">
          {assistants.map((a) => (
            <button
              key={a.id}
              className={`text-left p-2 rounded hover:bg-grey90 ${selectedId === a.id ? 'bg-grey90 font-semibold' : ''}`}
              onClick={() => setSelectedId(a.id)}
            >
              {a.name}
            </button>
          ))}
        </nav>
        <button
          className="m-2 p-2 bg-accent text-white rounded"
          onClick={() => navigate('/assistants/new')}
        >
          New Assistant
        </button>
      </aside>
      {children}
    </SidebarContext.Provider>
  );
}
