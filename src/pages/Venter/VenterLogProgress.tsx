import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { useRecovery } from '../../api/hooks/useRecovery';
import { toastSuccess, toastError } from '../../utils/toast';

export const VenterLogProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { startSobriety, logRelapse } = useRecovery();

  const stateEntry = location.state?.entry as any;
  const isEditMode = !!location.state?.editMode;

  // Exactly 2 options — matches native: 'track' | 'setback'
  const [status, setStatus] = useState<'track' | 'setback' | null>(
    location.state?.status ?? null
  );
  const [notes, setNotes] = useState<string>(location.state?.notes ?? stateEntry?.notes ?? '');
  const [saving, setSaving] = useState(false);

  // Pre-fill if editing from RecoveryDetails
  useEffect(() => {
    if (stateEntry) {
      const s = stateEntry.event_type === 'relapse' ? 'setback' : 'track';
      setStatus(s);
      setNotes(stateEntry.notes || '');
    }
  }, []);

  const handleSave = async () => {
    if (!status) return;
    setSaving(true);
    try {
      if (status === 'track') {
        await startSobriety({
          restart_date: new Date().toISOString(),
          notes: notes,
        } as any);
      } else {
        await logRelapse({
          relapse_date: new Date().toISOString(),
          notes: notes,
        } as any);
      }
      toastSuccess(t('VenterRecovery.logProgress.success', 'Recovery logged successfully'));
      navigate(-1);
    } catch (e: any) {
      toastError(e?.message || t('Common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="" onBack={() => navigate(-1)} />

      {/* Question — matches native large centered text */}
      <p className="text-center text-lg font-medium text-white mt-8 mb-8 whitespace-pre-line leading-relaxed">
        {t('VenterRecovery.logProgress.question', 'How was your recovery \n today?')}
      </p>

      {/* Two toggle buttons — exactly matches native */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setStatus('track')}
          className="flex-1 py-3 rounded-3xl border text-sm font-medium text-white transition-all"
          style={
            status === 'track'
              ? { borderColor: 'transparent', background: 'rgba(255,255,255,0.15)' }
              : { borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.1)' }
          }
        >
          {t('VenterRecovery.logProgress.track', 'Stayed on track')}
        </button>
        <button
          onClick={() => setStatus('setback')}
          className="flex-1 py-3 rounded-3xl border text-sm font-medium text-white transition-all"
          style={
            status === 'setback'
              ? { borderColor: 'transparent', background: 'rgba(255,255,255,0.15)' }
              : { borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.1)' }
          }
        >
          {t('VenterRecovery.logProgress.setback', 'Had a setback')}
        </button>
      </div>

      {/* Notes */}
      <p className="text-base font-medium text-white mb-3">
        {t('VenterRecovery.logProgress.notes', 'Notes')}
      </p>
      <GlassCard
        className="mb-8"
        style={{ background: 'rgba(0,0,0,0.12)', borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('VenterRecovery.logProgress.placeholder', "Let's reflect on our day")}
          className="w-full h-28 resize-none bg-transparent text-sm text-white placeholder-white/60 outline-none leading-relaxed"
        />
      </GlassCard>

      {/* Save button — fixed at bottom like native */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        disabled={!status || saving}
        onClick={handleSave}
      >
        {t('VenterRecovery.logProgress.saveEntry', 'Save Entry')}
      </Button>
    </div>
  );
};
