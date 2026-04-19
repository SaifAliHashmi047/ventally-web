import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { useChat } from '../../api/hooks/useChat';
import { useWallet } from '../../api/hooks/useWallet';
import { setSessionType, setReturnToSession } from '../../store/slices/callSlice';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastError } from '../../utils/toast';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatTimeAgo = (dateStr: string, t: any): string => {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return t('Common.time.justNow');
  if (mins < 60) return t('VenterMessages.chatEntry.minutesAgo', { minutes: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('VenterMessages.chatEntry.hoursAgo', { hours: hrs });
  return new Date(dateStr).toLocaleDateString();
};

// ─── Start Chat Card ───────────────────────────────────────────────────────────
const StartChatCard = ({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) => (
  <button
    onClick={onPress}
    className="w-full text-left glass rounded-2xl px-5 py-5 flex items-center gap-4 hover:bg-white/5 transition-all duration-200 active:scale-[0.99]"
  >
    <div className="w-14 h-14 rounded-full glass flex items-center justify-center flex-shrink-0">
      <MessageSquare size={24} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-lg font-semibold text-white mb-0.5">{title}</p>
      <p className="text-sm text-white/60">{subtitle}</p>
    </div>
  </button>
);

// ─── Chat Entry ────────────────────────────────────────────────────────────────
const ChatEntry = ({
  name,
  lastMessage,
  timeAgo,
  isActive,
  onPress,
}: {
  name: string;
  lastMessage: string;
  timeAgo: string;
  isActive?: boolean;
  onPress: () => void;
}) => (
  <button
    onClick={onPress}
    className="w-full text-left glass-bordered rounded-2xl px-4 py-4 flex items-center gap-3 hover:bg-white/5 transition-all duration-200 mb-3"
  >
    <div className="w-11 h-11 rounded-full glass border border-white/20 flex items-center justify-center flex-shrink-0">
      <MessageSquare size={18} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-sm font-medium text-white truncate flex-1 mr-2">{name}</p>
        <span className="text-xs text-white/60 flex-shrink-0 flex items-center gap-1.5">
          {isActive ? (
            <>
              <span className="text-white/80">{timeAgo}</span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft flex-shrink-0" />
            </>
          ) : (
            timeAgo
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/70 truncate flex-1 mr-2">{lastMessage || '--'}</p>
        <ChevronRight size={16} className="text-white/50 flex-shrink-0" />
      </div>
    </div>
  </button>
);

// ─── Main screen ───────────────────────────────────────────────────────────────
export const VenterMessages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stable refs to API functions — avoids them being deps that change every render
  const chatHook = useChat();
  const walletHook = useWallet();
  const getConversationsRef = useRef(chatHook.getConversations);
  const getMySubscriptionRef = useRef(walletHook.getMySubscription);

  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletDetails, setWalletDetails] = useState<any>(null);

  // Fetch ONCE on mount — empty deps, no loop
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [chatsRes, subRes] = await Promise.allSettled([
          getConversationsRef.current(undefined, 5, 0),
          getMySubscriptionRef.current(),
        ]);
        if (cancelled) return;
        if (chatsRes.status === 'fulfilled') {
          setRecentChats(chatsRes.value?.conversations ?? []);
        }
        if (subRes.status === 'fulfilled') {
          setWalletDetails(subRes.value);
        }
      } catch {
        if (!cancelled) toastError(t('Common.errors.fetchingData'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty: fetch once on mount only

  const handleStartChat = () => {
    dispatch(setSessionType('chat'));
    const remaining = walletDetails?.subscription?.remainingMinutes ?? 999;
    if (remaining < 1) {
      dispatch(setReturnToSession(true));
      navigate('/venter/no-credit');
    } else {
      navigate('/venter/finding-listener', { state: { type: 'chat' } });
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Start Chat Card */}
      <StartChatCard
        title={t('VenterMessages.startChat.title')}
        subtitle={t('VenterMessages.startChat.subtitle')}
        onPress={handleStartChat}
      />

      {/* Separator */}
      <div className="w-full h-px bg-white/20 my-1" />

      {/* Section title */}
      <p className="text-base font-medium text-white">{t('VenterMessages.recentChat')}</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : recentChats.length === 0 ? (
        <EmptyState
          title={t('VenterMessages.noChats')}
          description={t('VenterMessages.noChatsDescription')}
          icon={<MessageSquare size={22} />}
        />
      ) : (
        <div>
          {recentChats.map((chat: any) => (
            <ChatEntry
              key={chat.id}
              name={chat.otherParticipant?.anonymousName || t('VenterMessages.chatEntry.name')}
              lastMessage={
                chat.lastMessage?.content ||
                chat.last_message ||
                t('VenterMessages.chatEntry.lastMessage')
              }
              timeAgo={formatTimeAgo(
                chat.lastMessage?.createdAt || chat.updatedAt || chat.createdAt,
                t
              )}
              isActive={chat.status === 'active'}
              onPress={() => navigate(`/venter/chat/${chat.id}`, { state: { chat } })}
            />
          ))}
        </div>
      )}

      {recentChats.length > 0 && (
        <button
          onClick={() => navigate('/venter/all-chats')}
          className="w-full glass rounded-2xl py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          {t('VenterMessages.viewAll')}
        </button>
      )}
    </div>
  );
};
