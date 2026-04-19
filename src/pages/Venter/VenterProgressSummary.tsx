import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';

const MILESTONE = 365;
const SIZE = 200;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const VenterProgressSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Params passed from RecoveryDashboard on circle press — matches native useRoute params
  const daysSober: number = location.state?.daysSober ?? 0;
  const soberStartDate: string | undefined = location.state?.soberStartDate;

  const progress = Math.min(daysSober / MILESTONE, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="page-wrapper animate-fade-in flex flex-col justify-center min-h-[70vh]">
      <PageHeader title="" onBack={() => navigate(-1)} />

      {/* Glass card matching native GlassView bordered + overflow hidden */}
      <GlassCard bordered className="mt-6 overflow-hidden pt-8 pb-0">
        {/* Title — matches native cardTitle */}
        <p className="text-center text-xl font-semibold text-white mb-8">
          {t('VenterRecovery.progressSummary.title', 'Progress Summary')}
        </p>

        {/* Circle — same dimensions as native */}
        <div className="flex justify-center mb-8">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
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
              <span className="font-bold text-white leading-none" style={{ fontSize: 60 }}>
                {daysSober}
              </span>
              <span className="text-sm text-white/70 mt-1">
                {t('VenterRecovery.dashboard.daysSober', 'Days Sober')}
              </span>
            </div>
          </div>
        </div>

        {/* View Details button — attached to bottom of card, matches native viewDetailsBtn */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-5 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          {t('VenterRecovery.progressSummary.viewDetails', 'View Details')}
        </button>
      </GlassCard>
    </div>
  );
};
