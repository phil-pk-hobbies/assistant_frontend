import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Assistant } from './HomePage';

interface Message {
  id: string;
  role: string;
  content: string;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const fetchAssistant = async () => {
    try {
      const res = await fetch(`/api/assistants/${id}/`);
      if (res.ok) {
        const data = await res.json();
        setAssistant(data);
      }
    } catch {
      // ignore errors
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/assistants/${id}/messages/`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void fetchAssistant();
    void fetchMessages();
  }, [id]);

  const sendMessage = async () => {
    try {
      const content = input;
      setInput('');
      // Optimistically show the user's message
      setMessages((msgs) => [
        ...msgs,
        { id: `tmp-${Date.now()}`, role: 'user', content },
      ]);

      const res = await fetch(`/api/assistants/${id}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }

      const reply = await res.json();
      setMessages((msgs) => [...msgs, reply]);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">
        Chat with {assistant ? assistant.name : id}
      </h1>
      <div className="border p-2 h-64 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg.id}>
            <span className="font-semibold">{msg.role}: </span>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          className="border p-2 flex-grow"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}
