import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Assistant } from './HomePage';

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
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <button
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h1 className="text-2xl font-bold">
        Chat with {assistant ? assistant.name : id}
      </h1>
      <div className="border p-4 h-64 overflow-y-auto space-y-3 bg-white rounded-lg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.role === 'user'
                ? 'flex justify-end'
                : 'flex justify-start'
            }
          >
            <div
              className={
                'px-3 py-2 rounded-lg max-w-xs break-words ' +
                (msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900')
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {waiting && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-500">
              <span className="loading-dots">
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
          className="border p-2 flex-grow rounded"
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={waiting}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      {status && <p className="text-red-600">{status}</p>}
    </div>
  );
}
