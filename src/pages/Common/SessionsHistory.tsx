import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useSessions } from '../../api/hooks/useSessions';
import { Clock, Phone, MessageSquare, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SessionsHistory = () => {
  const navigate = useNavigate();
  const { getSessionsHistory } = useSessions();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 15;

  const fetchSessions = async (offset = 0) => {
    try {
      const res = await getSessionsHistory(LIMIT, offset);
      const items = res?.sessions ?? [];
      if (offset === 0) setSessions(items);
      else setSessions(prev => [...prev, ...items]);
      setHasMore(items.length === LIMIT);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(0); }, []);

  const getDuration = (start: string, end: string) => {
    if (!start || !end) return '--';
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60;
    return `${Math.round(diff)} min`;
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Session History" />

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : sessions.length === 0 ? (
        <EmptyState title="No sessions yet" description="Your past sessions will appear here." icon={<Clock size={22} />} />
      ) : (
        <div className="space-y-3">
          {sessions.map((session: any) => (
            <GlassCard
              key={session.id}
              hover
              padding="md"
              rounded="2xl"
              onClick={() => navigate(`session/${session.id}/feedback`, { state: { session } })}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center flex-shrink-0 text-gray-400">
                  {session.type === 'call' ? <Phone size={18} /> : <MessageSquare size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white capitalize">
                      {session.type === 'call' ? 'Voice Call' : 'Chat'} Session
                    </p>
                    <Badge variant={session.status === 'completed' ? 'success' : session.status === 'cancelled' ? 'error' : 'default'} size="sm">
                      {session.status}
                    </Badge>
                  </div>
                  {session.listener && (
                    <p className="text-xs text-gray-500">with {session.listener?.displayName || 'Listener'}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">{getDuration(session.startedAt, session.endedAt)}</span>
                    {session.rating && (
                      <span className="text-xs text-yellow-400 flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> {session.rating}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-600">{new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <ChevronRight size={14} className="text-gray-500 ml-auto mt-1" />
                </div>
              </div>
            </GlassCard>
          ))}

          {hasMore && (
            <Button variant="glass" fullWidth onClick={() => { const next = page + 1; setPage(next); fetchSessions(next * LIMIT); }}>
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
