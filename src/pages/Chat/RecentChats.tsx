import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { useChat } from '../../api/hooks/useChat';

interface ChatItem {
  id: string;
  venter?: { firstName?: string; displayName?: string; isOnline?: boolean };
  listener?: { firstName?: string; displayName?: string; isOnline?: boolean };
  unreadCount?: number;
  lastMessage?: { content?: string; createdAt?: string };
}

export const RecentChats = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getConversations } = useChat();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const chatBasePath = useMemo(
    () => (pathname.startsWith('/listener') ? '/listener' : '/venter'),
    [pathname]
  );

  const loadConversations = useCallback(async () => {
    try {
      const res = await getConversations(undefined, 20, 0);
      setChats(res.conversations ?? []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [getConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <div className="w-full lg:max-w-3xl xl:max-w-4xl lg:mx-auto">
        <div className="mb-6 lg:mb-8">
          <PageHeader title={t('VenterMessages.title', 'Messages')} />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <GlassCard bordered rounded="2xl" className="py-2">
            <EmptyState
              title={t('VenterMessages.noChats', 'No messages yet')}
              description={t(
                'VenterMessages.noChatsDescription',
                'Start a session to chat with a listener.'
              )}
              icon={<MessageSquare size={22} />}
            />
          </GlassCard>
        ) : (
          <GlassCard padding="none" rounded="2xl" className="overflow-hidden">
            {chats.map((chat: any, index: number) => {
              const other = chat.venter || chat.listener;
              const hasUnread = (chat.unreadCount ?? 0) > 0;
              const isLast = index === chats.length - 1;
              return (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => navigate(`${chatBasePath}/chat/${chat.id}`, { state: { chat } })}
                  className={`w-full text-left flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 transition-colors hover:bg-white/[0.04] ${
                    !isLast ? 'border-b border-white/8' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-base font-bold text-white">
                      {(other?.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                    {other?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-[var(--bg-deep)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-semibold truncate ${
                          hasUnread ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {other?.displayName || other?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 flex-shrink-0 tabular-nums">
                        {chat.lastMessage?.createdAt
                          ? new Date(chat.lastMessage.createdAt).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p
                        className={`text-xs truncate ${hasUnread ? 'text-gray-300' : 'text-gray-500'}`}
                      >
                        {chat.lastMessage?.content ||
                          t('VenterMessages.chatEntry.noMessages', 'No messages yet')}
                      </p>
                      {hasUnread && (
                        <span className="w-5 h-5 rounded-full bg-primary/90 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/35 flex-shrink-0" />
                </button>
              );
            })}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
