import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { useChat } from '../../api/hooks/useChat';
import { User, Clock, AlertTriangle, ArrowLeft, Download } from 'lucide-react';

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
  const [sessionInfo, setSessionInfo] = useState({
    venterId: '',
    listenerId: '',
    startTime: '',
    duration: '',
    status: '',
  });

  useEffect(() => {
    const fetchChat = async () => {
      if (!sessionId) return;
      try {
        const data = await getChatHistory(sessionId);
        setMessages(data?.messages || []);
        setSessionInfo(data?.sessionInfo || sessionInfo);
      } catch (error) {
        console.error('Failed to fetch chat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [sessionId]);

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
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.viewChat', 'View Chat')}
        subtitle={sessionId ? `${t('Admin.sessionId', 'Session')} #${sessionId}` : ''}
        onBack={() => navigate(-1)}
      />

      {/* Session Info */}
      <GlassCard className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('Admin.venter', 'Venter')}</p>
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="text-sm text-white">{sessionInfo.venterId || 'Anonymous'}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('Admin.listener', 'Listener')}</p>
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="text-sm text-white">{sessionInfo.listenerId || 'Unknown'}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('Admin.startTime', 'Start Time')}</p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span className="text-sm text-white">{sessionInfo.startTime || '-'}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('Admin.status', 'Status')}</p>
            <Badge variant={sessionInfo.status === 'active' ? 'success' : 'default'}>
              {sessionInfo.status || 'ended'}
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Chat Messages */}
      <div className="space-y-3 mb-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <GlassCard className="text-center py-8">
            <p className="text-gray-400">{t('Admin.noMessages', 'No messages found')}</p>
          </GlassCard>
        ) : (
          messages.map((msg) => (
            <GlassCard
              key={msg.id}
              className={`${msg.isFlagged ? 'border-warning/30' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'venter' ? 'bg-primary/15' : 'bg-accent/15'
                }`}>
                  <User size={14} className={msg.sender === 'venter' ? 'text-primary' : 'text-accent'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400 capitalize">{msg.sender}</span>
                    <span className="text-xs text-gray-600">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.isFlagged && (
                      <AlertTriangle size={12} className="text-warning" />
                    )}
                  </div>
                  <p className="text-sm text-white break-words">{msg.message}</p>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="flex-1"
          leftIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          {t('Common.back', 'Back')}
        </Button>
        <Button
          variant="glass"
          size="lg"
          className="flex-1"
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
