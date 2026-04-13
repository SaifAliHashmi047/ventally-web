import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRecovery } from '../../api/hooks/useRecovery';
import { TrendingUp, Calendar, Target, ChevronRight, Plus, Flame, Award } from 'lucide-react';

export const VenterRecoveryDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getSobrietyStatus, getSobrietyHistory } = useRecovery();
  const [status, setStatus] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statRes, histRes] = await Promise.allSettled([
          getSobrietyStatus(),
          getSobrietyHistory(5, 0)
        ]);
        if (statRes.status === 'fulfilled') setStatus(statRes.value);
        if (histRes.status === 'fulfilled') setHistory(histRes.value?.history || []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Calculate progress circle stroke
  const currentDays = status?.current_sobriety_streak_days || 0;
  const maxGoal = 30; // default visual goal
  const progressPercent = Math.min((currentDays / maxGoal) * 100, 100);
  const dashOffset = 283 - (283 * progressPercent) / 100;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('VenterRecovery.dashboard.title', 'Recovery Dashboard')}
        subtitle={t('VenterRecovery.dashboard.subtitle', 'Track your journey to wellness')}
        rightContent={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/venter/recovery/log')}>
            {t('VenterRecovery.dashboard.logProgress', 'Log Progress')}
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}</div>
      ) : (
        <>
          {/* Progress Circular SVG Visual */}
          <GlassCard className="flex flex-col items-center justify-center p-6 mb-4">
            <div className="relative w-32 h-32 mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="45" fill="none" strokeWidth="8" className="stroke-white/10" />
                <circle cx="64" cy="64" r="45" fill="none" strokeWidth="8" strokeDasharray="283" strokeDashoffset={dashOffset} className="stroke-success stroke-cap-round transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-white">{currentDays}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{t('VenterRecovery.dashboard.daysSober', 'Days')}</p>
              </div>
            </div>
            {status?.milestone && (
              <div className="flex items-center gap-2 bg-success/15 px-3 py-1.5 rounded-full border border-success/30">
                <Award size={14} className="text-success" />
                <p className="text-xs font-semibold text-success">{status.milestone} Reached!</p>
              </div>
            )}
          </GlassCard>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard
              label={t('VenterRecovery.dashboard.streak', 'Current Streak')}
              value={`${currentDays} days`}
              icon={<Flame size={20} />}
              iconColor="#FF6B35"
            />
            <StatCard
              label={t('VenterRecovery.dashboard.longest', 'Longest Streak')}
              value={status?.longest_streak_days || 0}
              icon={<Target size={20} />}
              iconColor="#32D74B"
            />
          </div>

          {history.length > 0 ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-title">{t('VenterRecovery.dashboard.recentEntries', 'Recent Progress')}</h2>
                <button onClick={() => navigate('/venter/recovery/journey')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                  {t('VenterRecovery.dashboard.fullJourney', 'Full Journey')} <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {history.map((p: any) => {
                  const isRelapse = p.event_type === 'relapse';
                  return (
                    <GlassCard key={p.id} padding="sm" rounded="2xl" onClick={() => navigate(`/venter/recovery/${p.id}`)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isRelapse ? 'bg-error' : 'bg-success'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white capitalize">{isRelapse ? t('VenterRecovery.relapse', 'Slip') : t('VenterRecovery.success', 'Success')}</p>
                          {p.note && <p className="text-xs text-gray-500 truncate">{p.note}</p>}
                        </div>
                        <p className="text-xs text-gray-600">
                          {new Date(p.logged_date || p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <EmptyState
                title={t('VenterRecovery.dashboard.noProgress', 'No progress logged yet')}
                description={t('VenterRecovery.dashboard.noProgressDesc', 'Start logging your recovery journey!')}
                icon={<TrendingUp size={22} />}
                action={
                  <Button variant="accent" size="sm" onClick={() => navigate('/venter/recovery/log')}>
                    {t('VenterRecovery.dashboard.logProgress', 'Log First Entry')}
                  </Button>
                }
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="glass" leftIcon={<Calendar size={16} />} onClick={() => navigate('/venter/recovery/calendar')}>
              {t('VenterRecovery.dashboard.journeyCalendar', 'Journey Calendar')}
            </Button>
            <Button variant="glass" leftIcon={<TrendingUp size={16} />} onClick={() => navigate('/venter/recovery/summary')}>
              {t('VenterRecovery.dashboard.progressSummary', 'Progress Summary')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
