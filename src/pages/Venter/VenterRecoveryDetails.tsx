import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const VenterRecoveryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();

  // Entry can come via navigation state (from dashboard list) or we find it by id
  const entry = location.state?.entry as any;

  const isRelapse = entry?.event_type === 'relapse';

  const formatEventDate = (dateString: string) => {
    if (!dateString) return t('VenterRecovery.details.sampleDate', 'Thursday, April 4');
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEdit = () => {
    navigate('/venter/recovery/log', {
      state: {
        editMode: true,
        entry,
        status: isRelapse ? 'setback' : 'track',
        notes: entry?.notes || '',
      },
    });
  };

  if (!entry && !id) {
    return (
      <div className="page-wrapper page-wrapper--wide animate-fade-in">
        <PageHeader title={t('VenterRecovery.details.title', 'Recovery Details')} onBack={() => navigate(-1)} />
        <GlassCard className="mt-8 text-center py-12">
          <p className="text-white/60">{t('VenterRecovery.details.noNotes', 'No entry found.')}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader title={t('VenterRecovery.details.title', 'Recovery Details')} onBack={() => navigate(-1)} />

      {/* Centered icon — tick for sober, recovery icon for relapse */}
      <div className="flex justify-center mt-8 mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: isRelapse ? 'rgba(255,59,48,0.15)' : 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: isRelapse ? 'rgba(255,59,48,0.2)' : 'rgba(255,255,255,0.12)' }}
          >
            {isRelapse ? (
              <AlertCircle size={32} style={{ color: '#FF3B30' }} />
            ) : (
              <CheckCircle size={32} className="text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Date */}
      <p className="text-center text-lg font-semibold text-white mb-6">
        {entry ? formatEventDate(entry.event_date) : t('VenterRecovery.details.sampleDate')}
      </p>

      {/* Info card */}
      <GlassCard bordered>
        {/* Status row with Edit Log button */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
          <span
            className="text-base font-medium"
            style={{ color: isRelapse ? '#FF3B30' : 'rgba(255,255,255,0.9)' }}
          >
            {entry?.event_type
              ? entry.event_type.charAt(0).toUpperCase() + entry.event_type.slice(1)
              : t('VenterRecovery.details.sober', 'Sober')}
          </span>
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            {t('VenterRecovery.details.editLog', 'Edit Log')}
          </button>
        </div>

        {/* Notes */}
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {entry?.notes || t('VenterRecovery.details.noNotes', 'No notes recorded.')}
        </p>

        {/* Restart date — if present */}
        {entry?.restart_date && (
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {t('VenterRecovery.details.restartAt', 'Restarted at')}:{' '}
            {formatEventDate(entry.restart_date)}
          </p>
        )}
      </GlassCard>
    </div>
  );
};
