import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { MOOD_CONFIG, type MoodType } from '../../components/ui/MoodSelector';
import { useMood } from '../../api/hooks/useMood';
import { ChevronRight, Calendar } from 'lucide-react';
import happyIcon from '../../assets/icons/happy.png';

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(dateStr)
  );

export const VenterMoods = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getMoodHistory } = useMood();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getMoodHistoryRef = useRef(getMoodHistory);

  // Fetch 5 recent moods — once on mount
  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getMoodHistoryRef.current(5, 0);
        if (!cancelled) setItems(res?.moods ?? []);
      } catch { /* ignore */ } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader
        title={t('VenterYourMood.title')}
        onBack={() => navigate(-1)}
        rightContent={
          <button
            onClick={() => navigate('/venter/mood/monthly')}
            className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
          >
            <Calendar size={18} />
          </button>
        }
      />

      {/* Today's Mood — matches RN SettingsItem "Today's Mood" */}
      <GlassCard
        bordered
        hover
        onClick={() => navigate('/venter/mood/log')}
        className="cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center justify-between py-1">
          <p className="text-sm font-medium text-white">{t('VenterYourMood.todaysMood')}</p>
          <ChevronRight size={16} className="text-white/60" />
        </div>
      </GlassCard>

      {/* Recent Moods section */}
      <p className="text-sm font-medium text-white">{t('VenterYourMood.recentMoods')}</p>

      <GlassCard bordered style={{ background: 'rgba(0,0,0,0.2)' }}>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={t('VenterMoodHistory.noMoods')}
            description={t('VenterMoodHistory.noMoodsDescription')}
            icon={
              <img src={happyIcon} alt="mood" className="w-8 h-8 object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            }
          />
        ) : (
          <div>
            {items.map((item: any, index: number) => {
              const moodKey = item.mood_type?.toLowerCase() as MoodType;
              const config = MOOD_CONFIG[moodKey];
              return (
                <div
                  key={item.id || index}
                  className={`flex items-center justify-between py-3 ${
                    index < items.length - 1 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <span className="text-sm text-white">
                    {formatDate(item.logged_date || item.created_at)}
                  </span>
                  <span
                    className="text-sm font-medium capitalize"
                    style={{ color: config?.text || '#aaa' }}
                  >
                    {item.mood_type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Mood History button — matches RN footer Button */}
      <Button
        variant="glass"
        size="lg"
        fullWidth
        onClick={() => navigate('/venter/mood/history')}
      >
        {t('VenterYourMood.moodHistory')}
      </Button>
    </div>
  );
};
