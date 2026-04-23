import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useCalls } from '../../api/hooks/useCalls';
import { useChat } from '../../api/hooks/useChat';
import { Phone, MessageSquare, Clock, Star } from 'lucide-react';

type Tab = 'voice' | 'messages';

interface SessionItem {
  id: string;
  name: string;
  duration: string;
  time: string;
  preview?: string;
  status?: string;
}


const LIMIT = 10;

export const SessionsHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isToday) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    if (isYesterday) return t('Common.yesterday');
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const { getCalls } = useCalls();
  const { getConversations } = useChat();

  const [activeTab, setActiveTab] = useState<Tab>('voice');

  // Voice state
  const [calls, setCalls] = useState<SessionItem[]>([]);
  const [callsLoading, setCallsLoading] = useState(true);
  const [callsOffset, setCallsOffset] = useState(0);
  const [hasMoreCalls, setHasMoreCalls] = useState(true);
  const [callsLoaded, setCallsLoaded] = useState(false);

  // Messages state
  const [chats, setChats] = useState<SessionItem[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsOffset, setChatsOffset] = useState(0);
  const [hasMoreChats, setHasMoreChats] = useState(true);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  const fetchCalls = useCallback(async (offset = 0) => {
    setCallsLoading(true);
    try {
      const res = await getCalls(LIMIT, offset);
      const mapped: SessionItem[] = (res?.calls || []).map((c: any) => ({
        id: c.id,
        name: c.otherParticipant?.anonymousName || c.otherParticipant?.displayName || t('VenterCall.callEntry.name'),
        duration: `${Math.round((c.duration || c.durationSeconds || 0) / 60)} min`,
        time: formatTime(c.createdAt),
        status: c.status,
      }));
      if (offset === 0) setCalls(mapped);
      else setCalls(prev => [...prev, ...mapped]);
      setCallsOffset(offset + mapped.length);
      setHasMoreCalls(mapped.length === LIMIT);
    } catch {
    } finally {
      setCallsLoading(false);
      setCallsLoaded(true);
    }
  }, []);

  const fetchChats = useCallback(async (offset = 0) => {
    setChatsLoading(true);
    try {
      const res = await getConversations(undefined, LIMIT, offset);
      const mapped: SessionItem[] = (res?.conversations || []).map((c: any) => ({
        id: c.id,
        name: c.otherParticipant?.anonymousName || c.otherParticipant?.displayName || t('VenterMessages.chatEntry.name'),
        duration: `${c.durationMinutes || 0} min`,
        time: formatTime(c.createdAt),
        preview: c.lastMessage?.content,
        status: c.status,
      }));
      if (offset === 0) setChats(mapped);
      else setChats(prev => [...prev, ...mapped]);
      setChatsOffset(offset + mapped.length);
      setHasMoreChats(mapped.length === LIMIT);
    } catch {
    } finally {
      setChatsLoading(false);
      setChatsLoaded(true);
    }
  }, []);

  // Load voice on mount
  useEffect(() => { fetchCalls(0); }, []);

  // Lazy-load messages when tab first opened
  useEffect(() => {
    if (activeTab === 'messages' && !chatsLoaded) {
      fetchChats(0);
    }
  }, [activeTab, chatsLoaded]);

  const tabs: { key: Tab; label: string; icon: typeof Phone }[] = [
    { key: 'voice',    label: t('SessionsHistory.call', 'Voice'),    icon: Phone },
    { key: 'messages', label: t('SessionsHistory.chat', 'Messages'), icon: MessageSquare },
  ];

  const renderItem = (item: SessionItem, type: Tab) => (
    <GlassCard
      key={item.id}
      padding="md"
      rounded="2xl"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center flex-shrink-0 text-gray-400">
          {type === 'voice' ? <Phone size={18} /> : <MessageSquare size={18} />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
            {item.status && (
              <Badge
                variant={item.status === 'completed' ? 'success' : item.status === 'cancelled' ? 'error' : 'default'}
                size="sm"
              >
                {item.status}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">{item.duration}</p>
          {item.preview && (
            <p className="text-xs text-gray-600 truncate mt-0.5">{item.preview}</p>
          )}
        </div>

        {/* Time */}
        <p className="text-xs text-gray-600 flex-shrink-0">{item.time}</p>
      </div>
    </GlassCard>
  );

  const isLoading = activeTab === 'voice' ? callsLoading : chatsLoading;
  const data = activeTab === 'voice' ? calls : chats;
  const hasMore = activeTab === 'voice' ? hasMoreCalls : hasMoreChats;
  const handleLoadMore = () => {
    if (activeTab === 'voice') fetchCalls(callsOffset);
    else fetchChats(chatsOffset);
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader title={t('Profile.yourSessions', 'Your Sessions')} onBack={() => navigate(-1)} />

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-2xl mb-5">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-accent/15 text-accent border border-accent/20'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading && data.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-[76px] rounded-2xl" />)}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title={t('SessionsHistory.emptyState', 'No past sessions yet')}
          description={t('SessionsHistory.emptyStateDescription', 'Your session history will appear here')}
          icon={<Clock size={22} />}
        />
      ) : (
        <div className="space-y-3">
          {data.map(item => renderItem(item, activeTab))}

          {hasMore && (
            <Button
              variant="glass"
              fullWidth
              loading={isLoading}
              onClick={handleLoadMore}
            >
              {t('Common.loadMore')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
