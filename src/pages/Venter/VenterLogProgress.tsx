import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { useRecovery } from '../../api/hooks/useRecovery';

const STATUSES = ['success', 'slip', 'partial'];

export const VenterLogProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { startSobriety, logRelapse } = useRecovery();
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const isEditMode = !!id || location.state?.editMode;

  // Pre-fill if editing
  useEffect(() => {
    if (location.state?.status) {
      setStatus(location.state.status);
    }
    if (location.state?.notes) {
      setNotes(location.state.notes);
    }
  }, [location.state]);

  const handleSave = async () => {
    if (!status) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (status === 'slip') {
        await logRelapse({ relapse_date: today, note: notes, trigger: '' });
      } else {
        await startSobriety({ sobriety_date: today, addiction_type: 'general', note: notes });
      }
      
      navigate(-1);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const statusConfig: Record<string, { color: string; emoji: string; label: string }> = {
    success: { color: 'text-success border-success/30 bg-success/10', emoji: '✅', label: t('VenterRecovery.log.success', 'Successful Day') },
    partial: { color: 'text-warning border-warning/30 bg-warning/10', emoji: '⚠️', label: t('VenterRecovery.log.partial', 'Partial') },
    slip: { color: 'text-error border-error/30 bg-error/10', emoji: '❌', label: t('VenterRecovery.log.slip', 'Slip') },
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={isEditMode ? t('VenterRecovery.log.editTitle', 'Edit Progress') : t('VenterRecovery.log.title', 'Log Progress')} onBack={() => navigate(-1)} />
      <p className="section-label mb-3">{t('VenterRecovery.log.howWasToday', 'How was today?')}</p>
      <div className="grid grid-cols-3 gap-3">
        {STATUSES.map(s => {
          const conf = statusConfig[s];
          return (
            <button key={s} onClick={() => setStatus(s)}
              className={`py-6 rounded-2xl border text-center transition-all ${conf.color} ${status === s ? 'scale-105 shadow-lg' : 'opacity-70 hover:opacity-100'}`}>
              <div className="text-2xl mb-1">{conf.emoji}</div>
              <p className="text-xs font-semibold">{conf.label}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        <p className="section-label mb-2">{t('VenterRecovery.log.notes', 'Notes (optional)')}</p>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('VenterRecovery.log.notesPlaceholder', 'What happened today?')} className="input-field w-full h-32 resize-none" />
      </div>
      <div className="mt-6">
        <Button variant="primary" size="lg" fullWidth loading={saving} disabled={!status} onClick={handleSave}>
          {t('VenterRecovery.log.saveEntry', 'Save Entry')}
        </Button>
      </div>
    </div>
  );
};
