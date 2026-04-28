import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { useChat } from '../../api/hooks/useChat';
import { useWallet } from '../../api/hooks/useWallet';
import { setSessionType, setReturnToSession } from '../../store/slices/callSlice';
import { EmptyState } from '../../components/ui/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
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
  <GlassCard
    bordered
    hover
    onClick={onPress}
    padding="lg"
    rounded="2xl"
    className="w-full text-left cursor-pointer active:scale-[0.99] transition-transform shadow-lg shadow-black/10"
  >
    <div className="flex items-center gap-4 lg:gap-5">
      <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center flex-shrink-0 border border-white/10">
        <MessageSquare size={24} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base lg:text-lg font-semibold text-white mb-0.5">{title}</p>
        <p className="text-sm text-white/60 leading-snug">{subtitle}</p>
      </div>
    </div>
  </GlassCard>
);

// ─── Chat Entry ────────────────────────────────────────────────────────────────
const ChatEntry = ({
  name,
  lastMessage,
  timeAgo,
  isActive,
  isLast,
  onPress,
}: {
  name: string;
  lastMessage: string;
  timeAgo: string;
  isActive?: boolean;
  isLast?: boolean;
  onPress: () => void;
}) => (
  <button
    type="button"
    onClick={onPress}
    className={`w-full text-left flex items-center gap-3 px-4 sm:px-5 py-4 transition-colors hover:bg-white/[0.04] ${
      isLast !== true ? 'border-b border-white/8' : ''
    }`}
  >
    <div className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center flex-shrink-0">
      <MessageSquare size={18} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-medium text-white truncate">{name}</p>
        <span className="text-xs text-white/60 flex-shrink-0 flex items-center gap-1.5 tabular-nums">
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
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-white/70 truncate">{lastMessage}</p>
        <ChevronRight size={16} className="text-white flex-shrink-0" />
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
  const getWalletRef = useRef(walletHook.getWallet);

  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletDetails, setWalletDetails] = useState<any>(null);

  // Fetch ONCE on mount — empty deps, no loop
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [chatsRes, walletRes] = await Promise.allSettled([
          getConversationsRef.current(undefined, 5, 0),
          getWalletRef.current(),
        ]);
        if (cancelled) return;
        if (chatsRes.status === 'fulfilled') {
          setRecentChats(chatsRes.value?.conversations ?? []);
        }
        if (walletRes.status === 'fulfilled') {
          setWalletDetails(walletRes.value);
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
    const messages = walletDetails?.balance?.messages ?? 0;
    const currency = walletDetails?.balance?.currency ?? 0;
    const SESSION_COST = 10;
    
    // Check if they have enough messages OR enough generic currency
    if (messages < SESSION_COST && currency < SESSION_COST) {
      dispatch(setReturnToSession(true));
      navigate('/venter/no-credit');
    } else {
      navigate('/venter/finding-listener', { state: { type: 'chat' } });
    }
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <div className="w-full lg:max-w-3xl xl:max-w-4xl lg:mx-auto">
        <header className="mb-6 text-center lg:text-left lg:mb-8">
          <h1 className="text-lg font-semibold text-white tracking-tight lg:text-2xl lg:font-bold">
            {t('VenterMessages.title')}
          </h1>
          <p className="mt-1.5 text-sm text-white/80 max-w-md mx-auto lg:mx-0">
            {t('VenterMessages.subtitle')}
          </p>
        </header>

        <div className="space-y-6 lg:space-y-8">
          <StartChatCard
            title={t('VenterMessages.startChat.title')}
            subtitle={t('VenterMessages.startChat.subtitle')}
            onPress={handleStartChat}
          />

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">
              {t('VenterMessages.recentChat')}
            </h2>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />)}
              </div>
            ) : recentChats.length === 0 ? (
              <GlassCard bordered rounded="2xl" className="py-2">
                <EmptyState
                  title={t('VenterMessages.noChats')}
                  description={t('VenterMessages.noChatsDescription')}
                  icon={<MessageSquare size={22} />}
                />
              </GlassCard>
            ) : (
              <GlassCard padding="none" rounded="2xl" className="overflow-hidden">
                {recentChats.map((chat: any, index: number) => {
                  const other = chat.otherParticipant || chat.listener;
                  return (
                    <ChatEntry
                      key={chat.id}
                      name={other?.anonymousName || other?.displayName || other?.firstName || 'User'}
                      lastMessage={chat.lastMessage?.content || chat.last_message}
                      timeAgo={formatTimeAgo(
                        chat.lastMessage?.createdAt || chat.updatedAt || chat.createdAt,
                        t
                      )}
                      isActive={chat.status === 'active'}
                      isLast={index === recentChats.length - 1}
                      onPress={() => navigate(`/venter/chat/${chat.id}`, { state: { chat } })}
                    />
                  );
                })}
              </GlassCard>
            )}
          </section>

          {recentChats.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/venter/chat/all')}
              className="w-full max-w-sm mx-auto lg:max-w-none glass rounded-2xl py-3.5 text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-colors"
            >
              {t('VenterMessages.viewAll')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
