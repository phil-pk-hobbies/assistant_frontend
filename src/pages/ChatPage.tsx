import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Assistant } from './HomePage';
import Markdown from '../components/Markdown';

interface Message {
  id: string;
  role: string;
  content: string;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

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
      // The backend exposes messages through the read-only `/api/messages/`
      // endpoint. Filter by assistant id to retrieve the history for the
      // current assistant.
      const res = await fetch(`/api/messages/?assistant=${id}`);
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

  const clearChat = async () => {
    if (waiting) {
      return;
    }
    setStatus(null);
    try {
      const res = await fetch(`/api/assistants/${id}/reset/`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      setMessages([]);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const sendMessage = async () => {
    if (waiting || input.trim().length === 0) {
      return;
    }
    try {
      const content = input;
      setInput('');
      // Optimistically show the user's message
      setMessages((msgs) => [
        ...msgs,
        { id: `tmp-${Date.now()}`, role: 'user', content },
      ]);
      setWaiting(true);

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
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="p-4 space-y-4 flex flex-col h-screen w-full mx-auto">
      <div className="flex space-x-2">
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={waiting}
          onClick={clearChat}
        >
          Clear Chat
        </button>
      </div>
      <h1 className="text-xl font-bold">
        Chat with {assistant ? assistant.name : id}
      </h1>
      <div className="border p-2 flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded px-3 py-2 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <Markdown text={msg.content} />
            </div>
          </div>
        ))}
        {waiting && (
          <div className="flex justify-start">
            <div className="rounded px-3 py-2 bg-gray-200">
              <span className="loading-dots text-gray-500">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          className="border p-2 flex-grow"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim().length > 0 && !waiting) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Type a message"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={waiting}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}
