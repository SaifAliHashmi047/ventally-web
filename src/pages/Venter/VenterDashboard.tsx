import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, ChevronRight, Bell } from 'lucide-react';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MoodSelector, type MoodType } from '../../components/ui/MoodSelector';
import { EmptyState } from '../../components/ui/EmptyState';
import { useMood } from '../../api/hooks/useMood';
import { useReflections } from '../../api/hooks/useReflections';
import { MoodBarChart } from '../../components/charts/MoodBarChart';
import happyIcon from '../../assets/icons/happy.png';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';
import i18n from '../../locales/i18n';

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
  const [reflection, setReflection] = useState<any>(null);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          const allMoods = ['happy', 'neutral', 'sad', 'anxious', 'mad'] as const;
          const moodMap: Record<string, number> = {};
          statsRes.value.mood_distribution.forEach((d: any) => {
            if (d.mood_type) moodMap[d.mood_type.toLowerCase()] = parseInt(d.count, 10);
          });
          const mapped = allMoods.map(m => ({ value: moodMap[m] || 0, label: t(`VenterHome.moods.${m}`) }));
          setChartData(mapped);
          setHappyDays(moodMap['happy'] || 0);
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
      navigate('/venter/mood/log', {
        state: {
          editMode: true,
          selectedMood: mood,
          item: {
            mood: todayMood.mood_type,
            note: todayMood.notes,
            categories: todayMood.category ? [todayMood.category.toLowerCase()] : [],
          },
        },
      });
    } else {
      navigate('/venter/mood/log', { state: { selectedMood: mood } });
    }
  };

  const handleCall = () => {
    navigate('/venter/calls');
  };

  const handleChat = () => {
    navigate('/venter/chat');
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <div className="w-full lg:max-w-5xl xl:max-w-6xl lg:mx-auto">
        {/* Header — matches RN HomeHeader with logo + notification icon */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <AppBrandIcon className="w-9 h-9 rounded-[0.65rem] sm:w-10 sm:h-10 sm:rounded-2xl" />
            <span className="text-lg lg:text-xl font-bold text-white tracking-tight">
              {t('Home.title')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/venter/notifications')}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Bell size={18} />
          </button>
        </div>

        {/* Mobile: single column (unchanged order). Desktop: actions | insights */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-10 lg:items-start">
          <div className="min-w-0 space-y-6">
            {/* Your Reflection Button */}
            <Button
              variant="glass"
              size="md"
              fullWidth
              onClick={() => {
                if (reflection) {
                  navigate(`/venter/reflections/${reflection.id}`, { state: { reflection } });
                } else {
                  navigate('/venter/reflections/add');
                }
              }}
              className="!mb-0"
            >
              {t('VenterHome.yourReflection')}
            </Button>

            {/* Let's Vent Section */}
            <div>
              <p className="text-sm font-semibold text-white mb-3 lg:mb-3.5">{t('VenterHome.letsVent')}</p>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <Button
                  variant="glass"
                
                  fullWidth
                  leftIcon={<Phone size={18} />}
                  onClick={handleCall}
                               className="justify-center !w-full  "

                >
                  {t('VenterHome.call')}
                </Button>
                <Button
                  variant="glass"
                  fullWidth
                  leftIcon={<MessageSquare size={18} />}
                  onClick={handleChat}
                  className="justify-center !w-full"
                >
                  {t('VenterHome.chat')}
                </Button>
              </div>
            </div>

            {/* Mood Check In */}
            <div>
              <p className="text-sm font-semibold text-white mb-3 lg:mb-3.5">{t('VenterHome.moodCheckIn')}</p>
              <MoodSelector
                selected={selectedMood}
                onSelect={handleMoodSelect}
                disabled={loading}
              />
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            {/* Reflections Section */}
            <div>
              <div className="flex items-center justify-between mb-3 lg:mb-3.5">
                <p className="text-sm font-semibold text-white">{t('VenterHome.reflections')}</p>
              </div>

              {loading ? (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:grid lg:grid-cols-1 min-[1100px]:grid-cols-2 lg:overflow-visible lg:pb-0">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton flex-shrink-0 w-56 min-[1100px]:min-w-0 lg:w-full h-24 rounded-2xl" />
                  ))}
                </div>
              ) : reflections.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:grid lg:grid-cols-1 min-[1100px]:grid-cols-2 lg:overflow-visible lg:pb-0">
                  {reflections.map((r: any) => (
                    <GlassCard
                      key={r.id}
                      hover
                      bordered
                      onClick={() => navigate(`/venter/reflections/${r.id}`, { state: { reflection: r } })}
                      className="flex-shrink-0 w-56 min-[1100px]:min-w-0 lg:w-full cursor-pointer"
                      padding="sm"
                      rounded="2xl"
                    >
                      <p className="text-sm text-white font-medium line-clamp-2 mb-2">{r.reflection_text}</p>
                      <p className="text-xs text-white/80">
                        {new Date(r.reflection_date).toLocaleDateString(i18n.language, { month: 'long', day: 'numeric' })}
                      </p>
                      <div className="flex justify-end mt-1">
                        <ChevronRight size={14} className="text-white/80" />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t('VenterHome.noReflections')}
                  description={t('VenterHome.noReflectionsDescription')}
                  icon={<MessageSquare size={22} />}
                />
              )}

              {/* Streak / Happy Days Card */}
              <GlassCard bordered className="mt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{t('VenterHome.moods.happy')}</p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {happyDays === 1
                        ? t('VenterHome.streakCard.totalHappyDays_one', { days: happyDays })
                        : t('VenterHome.streakCard.totalHappyDays_other', { days: happyDays })}
                    </p>
                  </div>
                  <img
                    src={happyIcon}
                    alt="happy"
                    className="w-8 h-8 object-contain"
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }}
                  />
                </div>
              </GlassCard>
            </div>

            {/* Mood Chart Section */}
            {chartData.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-white mb-3 lg:mb-3.5">{t('VenterHome.moodOverTime')}</p>
                <GlassCard>
                  <MoodBarChart data={chartData} />
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
