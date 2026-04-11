import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import type { RootState } from '../../store/store';
import apiInstance from '../../api/apiInstance';
import { Send, Phone } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ChatScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const chat = location.state?.chat;
  const currentUser = useSelector((state: RootState) => state.user.user as any);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiInstance.get(`chat/${id}/messages`)
      .then(res => setMessages(res.data?.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !id) return;
    const msg = { id: Date.now().toString(), content: input.trim(), senderId: currentUser?.id, createdAt: new Date().toISOString(), status: 'sending' };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setSending(true);
    try {
      await apiInstance.post(`chat/${id}/messages`, { content: msg.content });
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const other = chat?.venter || chat?.listener;
  const title = other?.displayName || other?.firstName || 'Chat';

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Header */}
      <div className="glass border-b border-white/8 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors">
          ←
        </button>
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center font-semibold text-white">
          {(title[0] || 'U').toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{title}</p>
          {other?.isOnline && <p className="text-xs text-success">Online</p>}
        </div>
        <button className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors">
          <Phone size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Start the conversation!
          </div>
        ) : (
          messages.map((msg: any) => {
            const isOwn = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm',
                    isOwn
                      ? 'bg-primary text-white rounded-br-md'
                      : 'glass text-white rounded-bl-md'
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn('text-xs mt-1', isOwn ? 'text-blue-200' : 'text-gray-500')}>
                    {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-white/8 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          className="flex-1 input-field"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-hover transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
