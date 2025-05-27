import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import TextArea from '../components/ui/TextArea';
import type { Assistant } from './HomePage';
import { useAssistant, NotAllowedError } from '../hooks/useAssistant';
import Markdown from '../components/Markdown';
import ShareAssistantModal from '../components/ShareAssistantModal';

interface Message {
  id: string;
  role: string;
  content: string;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: assistant, error } = useAssistant(id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error instanceof NotAllowedError) {
      alert('Assistant not available');
      navigate('/assistants');
    }
  }, [error, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('share')) {
      setShowShare(true);
    }
  }, [location.search]);

  const fetchMessages = async () => {
    try {
      // The backend exposes messages through the read-only `/api/messages/`
      // endpoint. Filter by assistant id to retrieve the history for the
      // current assistant.
      const res = await api.get(`/api/messages/?assistant=${id}`);
      setMessages(res.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void fetchMessages();
  }, [id]);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages]);

  const clearChat = async () => {
    if (waiting) {
      return;
    }
    setStatus(null);
    try {
      await api.post(`/api/assistants/${id}/reset/`);
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

      const { data: reply } = await api.post(`/api/assistants/${id}/chat/`, {
        content,
      });
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
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/assistants/${id}/vector-store`)}>
          Files
        </Button>
        {assistant?.owner && (
          <Button variant="secondary" size="sm" onClick={() => setShowShare(true)}>
            Share
          </Button>
        )}
        <Button variant="danger" size="sm" disabled={waiting} onClick={clearChat}>
          Clear Chat
        </Button>
      </div>
      <h1 className="text-xl font-bold">
        Chat with {assistant ? assistant.name : id}
      </h1>
      <div
        ref={listRef}
        className="border p-2 flex-1 overflow-y-auto space-y-4"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-grey90'}`}
            >
              <Markdown text={msg.content} />
            </div>
          </div>
        ))}
        {waiting && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2 bg-grey90">
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
        <TextArea
          ref={inputRef}
          rows={1}
          className="flex-grow resize-none overflow-hidden"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={() => {
            const el = inputRef.current;
            if (el) {
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 6 * 24)}px`;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Type a message"
        />
        <Button disabled={waiting} onClick={sendMessage}>
          Send
        </Button>
      </div>
      {status && <p>{status}</p>}
      <ShareAssistantModal
        id={id || ''}
        open={showShare}
        onClose={() => setShowShare(false)}
        owner={!!assistant?.owner}
      />
    </div>
  );
}
