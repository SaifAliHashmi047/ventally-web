import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchChat = async () => {
      if (!sessionId || sessionId === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        const data = await getChatHistory(sessionId);
        setMessages(data?.messages || []);
      } catch (error) {
        console.error('Failed to fetch chat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [sessionId, getChatHistory]);

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
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-8 pb-10">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin text-accent" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-gray-400">{t('Admin.noMessages', 'No messages found')}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isListener = msg.sender === 'listener';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isListener ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Info - Native Style */}
                <span className={`text-[12px] font-bold text-white/60 mb-1 ${isListener ? 'text-right' : 'text-left'}`}>
                  {isListener ? 'User 2' : 'User 1'}
                </span>
                <span className="text-[10px] text-white/50 mb-2">abc@gmail.com</span>

                {/* Message Bubble - Native GlassWrapper Style */}
                <div 
                  className={`max-w-[80%] px-5 py-3 rounded-[1.2rem] border border-white/10 ${
                    isListener 
                      ? 'bg-white/[0.09] rounded-tr-none' 
                      : 'bg-white/[0.015] rounded-tl-none'
                  }`}
                >
                  <p className="text-[16px] text-white leading-relaxed break-words">{msg.message}</p>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] font-medium text-white/40 mt-1 uppercase tracking-tighter">
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 flex gap-3 pb-8">
        <Button
          variant="ghost"
          fullWidth
          className="rounded-full bg-white/5 h-12"
          leftIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          {t('Common.back', 'Back')}
        </Button>
        <Button
          variant="glass"
          fullWidth
          className="rounded-full h-12 border-white/10"
          leftIcon={<Download size={18} />}
          onClick={handleExport}
          disabled={messages.length === 0}
        >
          {t('Admin.exportChat', 'Export')}
        </Button>
      </div>
    </div>
  );
};
