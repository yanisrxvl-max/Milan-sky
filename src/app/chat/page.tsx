'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  sender: 'USER' | 'MILAN';
  createdAt: string;
}

const QUICK_REPLIES = [
  'Salut Milan !',
  'C\'est quoi le prochain drop ?',
  'Comment devenir ICON ?',
  'J\'adore ton contenu !',
];

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dailyLimit, setDailyLimit] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) fetchMessages();
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function fetchMessages() {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setRemaining(data.remaining);
        setDailyLimit(data.dailyLimit);
      }
    } catch {
      // Silent fail
    }
  }

  async function sendMessage(text?: string) {
    const messageContent = text || input.trim();
    if (!messageContent || sending) return;

    if (remaining !== null && remaining <= 0) {
      toast.error('Limite de messages quotidienne atteinte');
      return;
    }

    setSending(true);
    setInput('');

    // Optimistic user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender: 'USER',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      const data = await res.json();

      if (res.ok) {
        // Replace temp message with real ones
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.userMessage,
          data.milanMessage,
        ]);
        setRemaining(data.remaining);
      } else {
        // Remove optimistic message
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        toast.error(data.error || 'Erreur');
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      toast.error('Erreur réseau');
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!session) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <span className="text-5xl mb-4 block">💬</span>
          <h1 className="font-serif text-3xl gold-text mb-3">Chat avec Milan</h1>
          <p className="text-white/40 mb-6">Connectez-vous pour accéder au chat.</p>
          <Link href="/login?callbackUrl=/chat" className="btn-gold">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col h-[calc(100dvh-4rem)] max-w-3xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center text-black font-bold text-sm">
          M
        </div>
        <div>
          <p className="text-cream font-medium text-sm">Milan</p>
          <p className="text-green-400 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            En ligne
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white/20 text-xs">
            {remaining !== null ? `${remaining}/${dailyLimit} messages restants` : ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">💬</span>
            <p className="text-white/30 text-sm">Commencez la conversation avec Milan</p>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-gold/20 text-cream rounded-br-sm'
                  : 'glass text-white/80 rounded-bl-sm'
              }`}
            >
              {msg.content}
              <p className={`text-[10px] mt-1 ${msg.sender === 'USER' ? 'text-gold/40' : 'text-white/20'}`}>
                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => sendMessage(reply)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs text-gold/60 border border-gold/20 hover:bg-gold/10 transition-colors whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        {remaining !== null && remaining <= 0 ? (
          <div className="text-center py-3">
            <p className="text-white/40 text-sm mb-2">Limite quotidienne atteinte</p>
            <Link href="/subscriptions" className="text-gold text-sm hover:text-gold-light transition-colors">
              Upgrader pour plus de messages
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire un message..."
              className="input-field flex-1 !rounded-xl"
              maxLength={500}
              disabled={sending}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="btn-gold !py-2 !px-5 !rounded-xl"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m12 19 9 2-9-18-9 18 9-2Zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
