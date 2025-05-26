import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SplitLayout from '../components/SplitLayout';
import { SidebarProvider, useSidebar } from '../components/Sidebar';
import ChatPane from '../components/ChatPane';

export interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
}

export default function HomePage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);


  const fetchAssistants = async () => {
    try {
      const res = await fetch('/api/assistants/');
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      const data = await res.json();
      setAssistants(data);
    } catch {
      // ignore errors
    }
  };


  useEffect(() => {
    void fetchAssistants();
  }, []);


  const visible = assistants;

  const params = useParams<{ id?: string }>();

  function ChatPaneWrapper() {
    const { selectedId } = useSidebar();
    return <ChatPane assistantId={selectedId} />;
  }

  return (
    <SplitLayout>
      <SidebarProvider assistants={visible} initialSelectedId={params.id || null}>
        <ChatPaneWrapper />
      </SidebarProvider>
    </SplitLayout>
  );
}
