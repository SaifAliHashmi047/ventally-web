import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useMood } from '../../api/hooks/useMood';
import { MOOD_CONFIG, type MoodType } from '../../components/ui/MoodSelector';
import { ChevronDown, Loader2 } from 'lucide-react';

export const VenterMoodHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getMoodHistory } = useMood();
  
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchHistory = async (pageIndex: number, isLoadingMore = false) => {
    if (isLoadingMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await getMoodHistory(LIMIT, pageIndex * LIMIT);
      const newMoods = res?.moods || [];
      
      if (isLoadingMore) {
        setMoods(prev => [...prev, ...newMoods]);
      } else {
        setMoods(newMoods);
      }
      
      setHasMore(newMoods.length === LIMIT);
    } catch { 
      // handle error
    } finally {
      if (isLoadingMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(0);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage, true);
  };

  // Group by month based on correct date property
  const grouped: Record<string, any[]> = {};
  moods.forEach(m => {
    const rawDate = m.logged_date || m.created_at || m.updated_at;
    const dateObj = new Date(rawDate);
    const key = dateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <div className="page-wrapper animate-fade-in pb-24">
      <PageHeader title={t('VenterMoodHistory.title')} subtitle={t('VenterMoods.history', 'Your complete mood log')} />

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}</div>
      ) : moods.length === 0 ? (
        <EmptyState 
          title={t('VenterMoodHistory.noMoods')} 
          description={t('VenterMoodHistory.noMoodsDescription')} 
          action={<Button variant="accent" size="sm" onClick={() => navigate('/venter/mood/log')}>{t('VenterMoodLog.logMood', 'Log Mood')}</Button>} 
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, entries]) => (
            <div key={month}>
              <p className="section-label mb-3">{month}</p>
              <div className="space-y-2">
                {entries.map((m: any) => {
                  const moodKey = m.mood_type?.toLowerCase() as MoodType;
                  const config = MOOD_CONFIG[moodKey] || { emoji: '😶', label: m.mood_type, bg: '#333', text: '#aaa' };
                  const dateObj = new Date(m.logged_date || m.created_at || m.updated_at);
                  
                  return (
                    <GlassCard
                      key={m.id}
                      hover
                      padding="sm"
                      rounded="2xl"
                      // Web currently doesnt have VenterMoodDetails port, so navigate to edit mode log
                      onClick={() => navigate('/venter/mood/log', { state: { editMode: true, selectedMood: moodKey, item: m } })}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{config.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold capitalize" style={{ color: config.text }}>{config.label}</p>
                                {m.category && (
                                <span className="text-[10px] text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{m.category}</span>
                                )}
                            </div>
                            <p className="text-xs font-medium text-white/50">{dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>
                          </div>
                          {m.notes && <p className="text-xs text-gray-400 truncate mt-1 max-w-[85%]">{m.notes}</p>}
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          ))}

          {hasMore && (
             <div className="flex justify-center mt-6">
               <button 
                 onClick={handleLoadMore}
                 disabled={loadingMore}
                 className="flex items-center gap-2 px-6 py-2 rounded-full glass border border-white/10 text-sm text-gray-400 hover:text-white transition-all disabled:opacity-50"
               >
                 {loadingMore ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                 {loadingMore ? t('Common.loading', 'Loading...') : t('Common.loadMore', 'Load More')}
               </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
