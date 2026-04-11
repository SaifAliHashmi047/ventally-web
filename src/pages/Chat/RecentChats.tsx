import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { MessageSquare, Clock, ChevronRight } from 'lucide-react';
import apiInstance from '../../api/apiInstance';

export const RecentChats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiInstance.get('chat/recent')
      .then(res => setChats(res.data?.chats ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Messages" />

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-18 rounded-2xl" />)}</div>
      ) : chats.length === 0 ? (
        <EmptyState title="No messages yet" description="Start a session to chat with a listener." icon={<MessageSquare size={22} />} />
      ) : (
        <div className="space-y-2">
          {chats.map((chat: any) => {
            const other = chat.venter || chat.listener;
            const hasUnread = (chat.unreadCount ?? 0) > 0;
            return (
              <GlassCard
                key={chat.id}
                hover
                padding="md"
                rounded="2xl"
                onClick={() => navigate(`chat/${chat.id}`, { state: { chat } })}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-lg font-bold text-white">
                      {(other?.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                    {other?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-bg-deep" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
                        {other?.displayName || other?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 flex-shrink-0">
                        {chat.lastMessage?.createdAt
                          ? new Date(chat.lastMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className={`text-xs truncate ${hasUnread ? 'text-gray-300' : 'text-gray-500'}`}>
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      {hasUnread && (
                        <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold flex-shrink-0 ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
