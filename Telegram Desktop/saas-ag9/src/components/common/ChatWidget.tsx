import React, { useEffect, useMemo, useRef, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
};

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const sessionId = useMemo(() => {
    // lightweight session id using time+random
    return 'sess_' + Math.random().toString(36).slice(2) + Date.now();
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages.length]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    const now = new Date().toISOString();
    const userMsg: ChatMessage = { id: 'm_' + Math.random().toString(36).slice(2), role: 'user', text: trimmed, timestamp: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const lang = document.documentElement.lang || 'en';
      // Derive backend base URL similar to authClient/statusClient
      const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
      const baseUrl = envBase && envBase.trim().length > 0
        ? envBase.trim()
        : (typeof window !== 'undefined'
          ? (/^localhost$|^127\.0\.0\.1$|^192\.168\./.test(window.location?.hostname || '')
              ? 'http://127.0.0.1:8001'
              : (window.location.origin || 'https://v9-api.azurewebsites.net'))
          : 'http://127.0.0.1:8001');
      const tenantId = localStorage.getItem('tenant_id') || 'demo';
      const res = await fetch(`${baseUrl}/agent/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, lang, session_id: sessionId, tenant_id: tenantId }),
      });
      const data = await res.json() as { reply?: string };
      const botMsg: ChatMessage = {
        id: 'm_' + Math.random().toString(36).slice(2),
        role: 'bot',
        text: (data && data.reply) ? data.reply : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { id: 'm_err', role: 'bot', text: 'Network error. Please try again later.', timestamp: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 shadow-lg p-3"
      >
        {open ? (
          <span className="font-medium">×</span>
        ) : (
          <span className="text-xs">Chat</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-16 right-4 z-40 w-80 max-w-[90vw] rounded-lg border border-white/20 bg-black/80 backdrop-blur shadow-xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <div className="text-sm font-medium text-white">Customer Service</div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">×</button>
          </div>

          <div ref={listRef} className="max-h-80 overflow-y-auto px-3 py-2 space-y-2">
            {messages.length === 0 && (
              <div className="text-xs text-white/70">Hi! Ask us anything about pricing, trials, or support.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`text-xs ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-2 py-1 rounded ${m.role === 'user' ? 'bg-white/20 text-white' : 'bg-white text-black'}`}>{m.text}</div>
              </div>
            ))}
            {sending && (
              <div className="text-left text-xs">
                <div className="inline-block px-2 py-1 rounded bg-white text-black">Typing…</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="flex-1 rounded bg-white/10 text-white placeholder-white/50 px-2 py-2 text-xs outline-none border border-white/20"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="rounded bg-white text-black text-xs font-medium px-3 py-2 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;