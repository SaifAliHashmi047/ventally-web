import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { MoodBarChart } from '../../components/charts/MoodBarChart';
import { useMood } from '../../api/hooks/useMood';
import { ChevronRight } from 'lucide-react';

type TabType = '7' | '30' | 'custom';

const parseMoodDistribution = (res: any) => {
  if (!res?.mood_distribution) return [];
  const moods = ['happy', 'neutral', 'sad', 'anxious', 'mad'];
  const map: Record<string, number> = {};
  res.mood_distribution.forEach((d: any) => {
    if (d.mood_type) map[d.mood_type.toLowerCase()] = parseInt(d.count, 10) || 0;
  });
  return moods.map(m => ({ label: m, value: map[m] || 0 }));
};

export const VenterMoodTrends = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getMoodStats } = useMood();

  const [activeTab, setActiveTab] = useState<TabType>('7');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<{ label: string; value: number }[]>([]);

  const fetchStats = useCallback(async (days: number) => {
    setLoading(true);
    try {
      const res = await getMoodStats(days);
      setMoodData(parseMoodDistribution(res));
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === '7') fetchStats(7);
    else if (activeTab === '30') fetchStats(30);
  }, [activeTab, fetchStats]);

  const handleCustomSearch = () => {
    if (!startDate || !endDate) return;
    const s = new Date(startDate.replace(/\//g, '-'));
    const e = new Date(endDate.replace(/\//g, '-'));
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return;
    const diffDays = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    fetchStats(diffDays);
  };

  const TABS: { key: TabType; label: string }[] = [
    { key: '7',      label: t('VenterJourney.moodTrends.tabs.7days',  '7 Days')  },
    { key: '30',     label: t('VenterJourney.moodTrends.tabs.30days', '30 Days') },
    { key: 'custom', label: t('VenterJourney.moodTrends.tabs.custom', 'Custom')  },
  ];

  // variation is always "Moderate" in the native app (not returned from API)
  const variation = t('VenterJourney.moodVariation.moderate', 'Moderate');

  return (
    <div className="page-wrapper animate-fade-in pb-10">
      <PageHeader
        title={t('VenterJourney.moodTrends.title', 'Your Mood')}
        onBack={() => navigate(-1)}
      />

      {/* ── 3-tab selector — matches native tabContainer ── */}
      <div
        className="flex rounded-3xl p-1 mb-8"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2.5 rounded-[22px] text-sm font-medium transition-all"
            style={
              activeTab === tab.key
                ? { background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,1)' }
                : { color: 'rgba(255,255,255,0.5)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Custom date range pickers ── */}
      {activeTab === 'custom' && (
        <>
          <div className="flex gap-4 mb-4">
            {/* Start Date */}
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">
                {t('VenterJourney.moodTrends.startDate', 'Start Date')}
              </p>
              <input
                type="date"
                value={startDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setStartDate(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm text-white border outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', colorScheme: 'dark' }}
                placeholder={t('VenterJourney.moodTrends.placeholder', 'yyyy/mm/dd')}
              />
            </div>
            {/* End Date */}
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">
                {t('VenterJourney.moodTrends.endDate', 'End Date')}
              </p>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setEndDate(e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm text-white border outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', colorScheme: 'dark' }}
                placeholder={t('VenterJourney.moodTrends.placeholder', 'yyyy/mm/dd')}
              />
            </div>
          </div>
          <Button
            variant="glass"
            size="sm"
            fullWidth
            loading={loading}
            onClick={handleCustomSearch}
            className="mb-8"
          >
            {t('Common.search', 'Search')}
          </Button>
        </>
      )}

      {/* ── Mood Over Time chart — matches native MoodChart inside GlassView ── */}
      <div className="mb-8">
        {loading ? (
          <div className="skeleton rounded-3xl h-52" />
        ) : (
          <GlassCard style={{ background: 'rgba(0,0,0,0.15)' }}>
            <p className="text-sm font-medium text-white mb-6">
              {t('VenterJourney.moodTrends.moodOverTime', 'Mood Over Time')}
            </p>
            <MoodBarChart data={moodData} />
          </GlassCard>
        )}
      </div>

      {/* ── Trend Breakdown section — matches native sectionTitle + GlassView ── */}
      <p className="text-lg font-semibold text-white mb-4">
        {t('VenterJourney.moodTrends.trendBreakdown', 'Trend Breakdown')}
      </p>

      <button
        onClick={() => navigate('/venter/mood/variation')}
        className="w-full text-left"
      >
        <GlassCard
          bordered
          hover
          className="cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.12)' }}
        >
          <div className="flex items-center justify-between py-1">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {t('VenterJourney.moodVariation.title', 'Mood Variation')}
              </p>
              <p className="text-xs text-white/60 mt-0.5">{variation}</p>
            </div>
            <ChevronRight size={18} className="text-white/60 flex-shrink-0 ml-3" />
          </div>
        </GlassCard>
      </button>
    </div>
  );
};
