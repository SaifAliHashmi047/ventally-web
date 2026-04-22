import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { useChat } from '../../api/hooks/useChat';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'venter' | 'listener';
  message: string;
  timestamp: string;
  isFlagged?: boolean;
}

export const AdminViewChat = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  
  const { getChatHistory } = useChat();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChat = useCallback(async () => {
    if (!sessionId || sessionId === 'undefined') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await getChatHistory(sessionId);
      setMessages(data?.messages || []);
    } catch (error) {
      console.error('Failed to fetch chat:', error);
    } finally {
      setLoading(false);
    }
  }, [getChatHistory, sessionId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  const handleExport = () => {
    const chatText = messages
      .map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.sender}: ${m.message}`)
      .join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${sessionId}.txt`;
    a.click();
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto h-screen flex flex-col">
      <PageHeader
        title={t('Admin.moderation.chat.title', 'Moderation Chat')}
        subtitle={t('Admin.chat.safeAndAnonymous', 'Safe & Anonymous')}
        onBack={() => navigate(-1)}
        centered
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-10 pb-10 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <p className="text-white/40 text-sm animate-pulse">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center mx-4">
            <p className="text-white/40 font-medium">{t('Admin.noMessages', 'No messages found')}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isListener = msg.sender === 'listener';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isListener ? 'items-end' : 'items-start'} px-2`}
              >
                {/* Sender Info - Matches Native Screen exactly */}
                <span className={`text-[12px] font-bold text-white mb-0.5 ${isListener ? 'text-right' : 'text-left'}`}>
                  {isListener ? 'User 2' : 'User 1'}
                </span>
                <span className={`text-[10px] text-white/50 mb-3 ${isListener ? 'text-right' : 'text-left'}`}>
                  {isListener ? 'listener@ventally.co' : 'venter@ventally.co'}
                </span>

                {/* Message Bubble - Native Glass radius & padding */}
                <div 
                  className={`max-w-[85%] px-5 py-3.5 border border-white/10 ${
                    isListener 
                      ? 'bg-white/[0.08] rounded-[22px] rounded-tr-none' 
                      : 'bg-white/[0.015] rounded-[22px] rounded-tl-none'
                  }`}
                >
                  <p className="text-[17px] text-white leading-relaxed break-words font-medium">{msg.message}</p>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] font-bold text-white/40 mt-1.5 uppercase tracking-widest px-1">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 flex gap-4 bg-transparent backdrop-blur-sm pb-10">
        <Button
          variant="glass"
          fullWidth
          className="rounded-full h-14 font-bold uppercase tracking-widest text-xs border-white/10"
          onClick={() => navigate(-1)}
        >
          {t('Common.back', 'Back')}
        </Button>
        <Button
          variant="accent"
          fullWidth
          className="rounded-full h-14 font-bold uppercase tracking-widest text-xs shadow-lg shadow-accent/20"
          onClick={handleExport}
          disabled={messages.length === 0}
        >
          {t('Admin.exportChat', 'Export')}
        </Button>
      </div>
    </div>
  );
};
