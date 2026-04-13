import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, BookOpen, TrendingUp, ChevronRight, PenLine, Sparkles } from 'lucide-react';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MoodSelector, type MoodType } from '../../components/ui/MoodSelector';
import { EmptyState } from '../../components/ui/EmptyState';
import { useMood } from '../../api/hooks/useMood';
import { useReflections } from '../../api/hooks/useReflections';
import { MoodBarChart } from '../../components/charts/MoodBarChart';

export const VenterDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user as any);
  const { getTodayMood, getMoodStats } = useMood();
  const { getTodayReflection, getReflectionHistory } = useReflections();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [happyDays, setHappyDays] = useState(0);
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });
  const [reflection, setReflection] = useState<any>(null);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Greeting.goodMorning');
    if (hour < 17) return t('Greeting.goodAfternoon');
    return t('Greeting.goodEvening');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const daysInMonth = new Date().getDate();
        const [moodRes, statsRes, reflectionRes, historyRes] = await Promise.allSettled([
          getTodayMood(),
          getMoodStats(daysInMonth),
          getTodayReflection(),
          getReflectionHistory(3, 0),
        ]);

        if (moodRes.status === 'fulfilled' && moodRes.value?.mood) {
          const mood = moodRes.value.mood;
          setTodayMood(mood);
          const today = new Date().toLocaleDateString();
          if (new Date(mood.updated_at).toLocaleDateString() === today) {
            setSelectedMood(mood.mood_type?.toLowerCase() as MoodType);
          }
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.mood_distribution) {
          const allMoods = ['happy', 'neutral', 'sad', 'anxious', 'mad'];
          const moodMap: Record<string, number> = {};
          statsRes.value.mood_distribution.forEach((d: any) => {
            if (d.mood_type) moodMap[d.mood_type.toLowerCase()] = parseInt(d.count, 10);
          });
          const mapped = allMoods.map(m => ({ value: moodMap[m] || 0, label: m }));
          setChartData(mapped);
          setHappyDays(moodMap['happy'] || 0);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value?.streaks) {
          setStreaks(statsRes.value.streaks);
        }

        if (reflectionRes.status === 'fulfilled' && reflectionRes.value?.saved) {
          const r = reflectionRes.value.reflection;
          const today = new Date().toLocaleDateString();
          if (r && new Date(r.updated_at).toLocaleDateString() === today) {
            setReflection(r);
          }
        }

        if (historyRes.status === 'fulfilled' && historyRes.value?.reflections) {
          setReflections(historyRes.value.reflections);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    if (todayMood) {
      navigate('/venter/mood/log', { state: { editMode: true, selectedMood: mood, item: todayMood } });
    } else {
      navigate('/venter/mood/log', { state: { selectedMood: mood } });
    }
  };

  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{greeting()},</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">{firstName} 👋</h1>
          <p className="text-gray-500 mt-1 text-sm">{t('VenterHome.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/venter/notifications')}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <span className="relative">
              <Sparkles size={18} />
            </span>
          </button>
        </div>
      </div>

      {/* Reflection Button */}
      <GlassCard
        hover
        onClick={() => navigate(reflection ? `/venter/reflections/${reflection.id}` : '/venter/reflections/add')}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl glass-accent flex items-center justify-center">
              <PenLine size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {reflection ? t('VenterHome.todaysReflection') : t('VenterHome.addReflection')}
              </p>
              {reflection && (
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{reflection.reflection_text}</p>
              )}
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>
      </GlassCard>

      {/* Let's Vent */}
      <div>
        <h2 className="section-title mb-3">{t('VenterHome.letsVent')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="glass"
            size="lg"
            fullWidth
            leftIcon={<Phone size={18} />}
            onClick={() => navigate('/venter/finding-listener', { state: { type: 'call' } })}
            className="justify-center"
          >
            {t('VenterHome.call')}
          </Button>
          <Button
            variant="glass"
            size="lg"
            fullWidth
            leftIcon={<MessageSquare size={18} />}
            onClick={() => navigate('/venter/finding-listener', { state: { type: 'chat' } })}
            className="justify-center"
          >
            {t('VenterHome.chat')}
          </Button>
        </div>
      </div>

      {/* Mood Check-In */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('VenterHome.moodCheckIn')}</h2>
          <button
            onClick={() => navigate('/venter/mood')}
            className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
          >
            {t('VenterHome.seeAll')} <ChevronRight size={12} />
          </button>
        </div>
        <MoodSelector
          selected={selectedMood}
          onSelect={handleMoodSelect}
          disabled={loading}
        />
      </div>

      {/* Streak + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GlassCard className="sm:col-span-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">😊</span>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('VenterHome.happyDays')}</p>
              <p className="text-xl font-bold text-white">{happyDays}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-gray-500 mb-1">{t('VenterHome.currentStreak')}</p>
          <p className="text-xl font-bold text-white">{streaks.current}</p>
          <p className="text-xs text-gray-500 mt-1">{t('VenterHome.days')} {t('VenterHome.fire')}</p>
        </GlassCard>
      </div>

      {/* Mood Chart */}
      {chartData.length > 0 && (
        <div>
          <h2 className="section-title mb-3">{t('VenterHome.moodOverTime')}</h2>
          <GlassCard>
            <MoodBarChart data={chartData} />
          </GlassCard>
        </div>
      )}

      {/* Recent Reflections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('VenterHome.reflections')}</h2>
          <button
            onClick={() => navigate('/venter/reflections')}
            className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
          >
            {t('VenterHome.seeAll')} <ChevronRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton flex-shrink-0 w-56 h-24 rounded-2xl" />
            ))}
          </div>
        ) : reflections.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {reflections.map((r: any) => (
              <GlassCard
                key={r.id}
                hover
                onClick={() => navigate(`/venter/reflections/${r.id}`, { state: { reflection: r } })}
                className="flex-shrink-0 w-56"
                padding="sm"
                rounded="2xl"
              >
                <p className="text-sm text-white font-medium truncate-2 mb-2">{r.reflection_text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(r.reflection_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('VenterHome.noReflections')}
            description={t('VenterHome.noReflectionsDesc')}
            icon={<BookOpen size={22} />}
            action={
              <Button variant="accent" size="sm" onClick={() => navigate('/venter/reflections/add')}>
                {t('VenterHome.addReflection')}
              </Button>
            }
          />
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-3">{t('VenterHome.quickAccess')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { labelKey: 'VenterRecovery.dashboard.title', icon: TrendingUp, path: '/venter/recovery' },
            { labelKey: 'VenterHome.moodTrends', icon: TrendingUp, path: '/venter/mood/trends' },
            { labelKey: 'Navigation.tabs.wallet', icon: MessageSquare, path: '/venter/wallet' },
            { labelKey: 'Subscription.title', icon: Sparkles, path: '/venter/subscription' },
          ].map(({ labelKey, icon: Icon, path }) => (
            <GlassCard
              key={path}
              hover
              onClick={() => navigate(path)}
              padding="sm"
              rounded="2xl"
              className="flex flex-col items-center gap-2 py-5 cursor-pointer"
            >
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-primary">
                <Icon size={18} />
              </div>
              <p className="text-xs font-medium text-gray-400 text-center">{t(labelKey)}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
