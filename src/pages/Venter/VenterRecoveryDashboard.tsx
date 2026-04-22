import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRecovery } from '../../api/hooks/useRecovery';
import { Calendar } from 'lucide-react';

// Milestone for full circle — matches native app (365 days)
const MILESTONE = 365;
const SIZE = 160; // px
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const VenterRecoveryDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getSobrietyStatus, getSobrietyHistory } = useRecovery();

  const [status, setStatus] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statRes, histRes] = await Promise.allSettled([
        getSobrietyStatus(),
        getSobrietyHistory(5, 0),
      ]);
      // Native uses statusRes.status  and historyRes.events
      if (statRes.status === 'fulfilled') setStatus(statRes.value?.status ?? statRes.value);
      if (histRes.status === 'fulfilled') setHistory(histRes.value?.events ?? histRes.value?.history ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Match native: days_sober / MILESTONE for progress ring
  const daysSober = status?.days_sober ?? 0;
  const progress = Math.min(daysSober / MILESTONE, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatEventDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const achievementsCount = status?.achievements?.filter((a: any) => a.achieved).length ?? 0;

  return (
    <div className="page-wrapper animate-fade-in pb-24">
      <PageHeader
        title={t('VenterRecovery.dashboard.title', 'Your Recovery')}
        onBack={() => navigate(-1)}
        rightContent={
          <button
            onClick={() => navigate('/venter/recovery/calendar')}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Calendar size={18} />
          </button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-3xl" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Circular progress — matches native SVG arc ── */}
          <div className="flex flex-col items-center mt-6 mb-6">
            <button
              onClick={() =>
                navigate('/venter/recovery/summary', {
                  state: { daysSober, soberStartDate: status?.sober_start_date },
                })
              }
              className="relative flex items-center justify-center"
              style={{ width: SIZE, height: SIZE }}
            >
              <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* Background track */}
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={STROKE}
                  fill="none"
                />
                {/* Progress arc */}
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-bold text-white leading-none"
                  style={{ fontSize: 52 }}
                >
                  {daysSober}
                </span>
                <span className="text-xs text-white/70 mt-1">
                  {t('VenterRecovery.dashboard.daysSober', 'Days Sober')}
                </span>
              </div>
            </button>
          </div>

          {/* ── Log Progress button — centered, half-width, matches native ── */}
          <div className="flex justify-center mb-8">
            <Button
              variant="glass"
              size="sm"
              onClick={() => navigate('/venter/recovery/log')}
              className="px-8"
            >
              {t('VenterRecovery.dashboard.logProgress', 'LOG PROGRESS')}
            </Button>
          </div>

          {/* ── Stats row — matches native 3-column glass card ── */}
          <GlassCard className="mb-8">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {/* Reflections / Notes */}
              <div className="flex flex-col items-center py-3 px-2">
                <span className="text-sm font-medium text-white/80 truncate max-w-full">
                  {status?.notes || '--'}
                </span>
                <span className="text-xs text-white/55 mt-1">
                  {t('VenterRecovery.dashboard.stats.reflections', 'Reflections')}
                </span>
              </div>
              {/* Days sober as "End" */}
              <div className="flex flex-col items-center py-3 px-2">
                <span className="text-sm font-medium text-white/80">
                  {daysSober != null ? `${daysSober}d` : '--'}
                </span>
                <span className="text-xs text-white/55 mt-1">
                  {t('VenterRecovery.dashboard.stats.end', 'End')}
                </span>
              </div>
              {/* Achievements */}
              <div className="flex flex-col items-center py-3 px-2">
                <span className="text-sm font-medium text-white/80">{achievementsCount}</span>
                <span className="text-xs text-white/55 mt-1">
                  {t('VenterRecovery.dashboard.stats.achievements', 'Achievements')}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* ── Recent Entries — matches native ── */}
          <p className="text-base font-semibold text-white mb-4">
            {t('VenterRecovery.dashboard.recentEntries', 'Recent Entries')}
          </p>

          {history.length === 0 ? (
            <EmptyState
              title=""
              description={t(
                'VenterRecovery.dashboard.noentries',
                'Start logging your recovery journey to see your progress here.'
              )}
            />
          ) : (
            <GlassCard>
              {history.map((entry: any, index: number) => (
                <button
                  key={entry.id ?? index}
                  onClick={() =>
                    navigate(`/venter/recovery/details/${entry.id}`, { state: { entry } })
                  }
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-white/5 transition-colors rounded-xl px-1"
                  style={{
                    borderBottom:
                      index < history.length - 1 ? '1px solid rgba(255,255,255,0.07)' : undefined,
                  }}
                >
                  <span className="text-sm font-medium text-white">
                    {formatEventDate(entry.event_date)}
                  </span>
                  <span className="text-sm text-white/60 ml-4 text-right">
                    {entry.event_type
                      ? entry.event_type.charAt(0).toUpperCase() + entry.event_type.slice(1)
                      : ''}
                  </span>
                </button>
              ))}
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
};
