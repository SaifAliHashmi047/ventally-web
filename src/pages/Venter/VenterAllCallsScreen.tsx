import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useCalls, type Call } from '../../api/hooks/useCalls';
import { Phone, Loader2, ChevronDown, Clock, User } from 'lucide-react';

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} d ago`;
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const VenterAllCallsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getCalls } = useCalls();

  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchCalls = async (pageIndex: number, isLoadingMore = false) => {
    if (isLoadingMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await getCalls(LIMIT, pageIndex * LIMIT);
      const newCalls = res?.calls || [];

      if (isLoadingMore) {
        setCalls(prev => [...prev, ...newCalls]);
      } else {
        setCalls(newCalls);
      }

      setHasMore(res?.pagination?.has_more || newCalls.length === LIMIT);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      if (isLoadingMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCalls(nextPage, true);
  };

  const handleCallPress = (callId: string) => {
    navigate(`/venter/chat/${callId}`);
  };

  return (
    <div className="page-wrapper animate-fade-in pb-24">
      <PageHeader 
        title={t('VenterCall.allCallsTitle', 'All Calls')} 
        subtitle={t('VenterCall.allCallsSubtitle', 'Your call history')}
        onBack={() => navigate(-1)} 
      />

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-3xl" />
          ))}
        </div>
      ) : calls.length === 0 ? (
        <EmptyState
          title={t('VenterCall.noRecentCalls', 'No recent calls')}
          description={t('VenterCall.noRecentCallsDescription', 'Your call history will appear here')}
          icon={<Phone size={22} />}
          action={
            <Button variant="accent" size="sm" onClick={() => navigate('/venter/finding-listener')}>
              {t('VenterHome.findListener', 'Find a Listener')}
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <GlassCard
              key={call.id}
              hover
              padding="md"
              rounded="2xl"
              onClick={() => handleCallPress(call.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {call.otherParticipant?.anonymousName ||
                       t('Common.anonymous', 'Anonymous')}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {call.createdAt ? formatTimeAgo(call.createdAt) : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={12} />
                      {t('VenterCall.callEntry.lastCall', 'Last call')}
                    </span>
                    {call.durationSeconds !== undefined && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDuration(call.durationSeconds)}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      call.status === 'completed' ? 'bg-success/20 text-success' :
                      call.status === 'cancelled' ? 'bg-error/20 text-error' :
                      'bg-warning/20 text-warning'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-2 rounded-full glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ChevronDown size={16} />
                )}
                {loadingMore ? t('Common.loading', 'Loading...') : t('Common.loadMore', 'Load More')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
