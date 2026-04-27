import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { useMood } from '../../api/hooks/useMood';
import { useChat } from '../../api/hooks/useChat';
import { useCalls } from '../../api/hooks/useCalls';

export const VenterJourneyDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const moodHook  = useMood();
  const chatHook  = useChat();
  const callsHook = useCalls();

  // Stable refs — no infinite loop
  const getMoodStatsRef    = useRef(moodHook.getMoodStats);
  const getConversationsRef = useRef(chatHook.getConversations);
  const getCallsRef        = useRef(callsHook.getCalls);

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    moodEntries: 0,
    recoveryDays: 0,
    chatsStarted: 0,
    callsStarted: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moodRes, chatRes, callRes] = await Promise.allSettled([
          getMoodStatsRef.current(365),
          getConversationsRef.current(undefined, 1, 0),
          getCallsRef.current(1, 0),
        ]);
        if (cancelled) return;
        setStatsData({
          moodEntries: moodRes.status === 'fulfilled' ? (moodRes.value?.total_entries || 0) : 0,
          recoveryDays: moodRes.status === 'fulfilled' ? (moodRes.value?.streaks?.longest || 0) : 0,
          chatsStarted: chatRes.status === 'fulfilled'
            ? ((chatRes.value as any)?.total || chatRes.value?.pagination?.total || 0) : 0,
          callsStarted: callRes.status === 'fulfilled' ? (callRes.value?.count || 0) : 0,
        });
      } catch { /* ignore */ } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    {
      label: t('VenterJourney.stats.moodEntries'),
      value: `${statsData.moodEntries} ${t('VenterJourney.stats.entries')}`,
    },
    {
      label: t('VenterJourney.stats.recoveryLog'),
      value: `${statsData.recoveryDays} ${t('VenterJourney.stats.days')}`,
    },
    {
      label: t('VenterJourney.stats.chatsStarted'),
      value: `${statsData.chatsStarted} ${t('VenterJourney.stats.chats')}`,
    },
    {
      label: t('VenterJourney.stats.callsStarted'),
      value: `${statsData.callsStarted} ${t('VenterJourney.stats.calls')}`,
    },
  ];

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader title={t('VenterJourney.title')} onBack={() => navigate(-1)} />

      {/* Stats table — matches RN SettingsContainer with stat rows */}
      <GlassCard bordered style={{ background: 'rgba(0,0,0,0.2)' }}>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-8 rounded-xl" />)}
          </div>
        ) : (
          <div>
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-3 ${
                  i < stats.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <p className="text-sm font-medium text-white">{stat.label}</p>
                <p className="text-sm text-white/70">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* View Trends button */}
      <Button
        variant="glass"
        size="lg"
        fullWidth
        onClick={() => navigate('/venter/mood/trends')}
      >
        {t('VenterJourney.viewTrends')}
      </Button>

      {/* Trends section title */}
      <p className="text-base font-semibold text-white mt-2">
        {t('VenterJourney.viewTrends')}
      </p>

      {/* Mood Variation item — matches RN TouchableOpacity with GlassView */}
      <GlassCard
        bordered
        hover
        onClick={() => navigate('/venter/mood/variation')}
        className="cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.1)' }}
      >
        <div className="flex items-center justify-between py-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {t('VenterJourney.moodVariation.title')}
            </p>
            <p className="text-xs text-white/60 mt-0.5">
              {t('VenterJourney.moodVariation.moderate')}
            </p>
          </div>
          <ChevronRight size={18} className="text-white flex-shrink-0" />
        </div>
      </GlassCard>
    </div>
  );
};
