import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useRecovery } from '../../api/hooks/useRecovery';

const STATUSES = ['success', 'slip', 'partial'];

export const VenterLogProgress = () => {
  const navigate = useNavigate();
  const { logProgress } = useRecovery();
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!status) return;
    setSaving(true);
    try {
      await logProgress({ date: new Date().toISOString().split('T')[0], status, notes });
      navigate(-1);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const statusConfig: Record<string, { color: string; emoji: string; label: string }> = {
    success: { color: 'text-success border-success/30 bg-success/10', emoji: '✅', label: 'Successful Day' },
    partial: { color: 'text-warning border-warning/30 bg-warning/10', emoji: '⚠️', label: 'Partial' },
    slip: { color: 'text-error border-error/30 bg-error/10', emoji: '❌', label: 'Slip' },
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Log Progress" onBack={() => navigate(-1)} />
      <p className="section-label mb-3">How was today?</p>
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
      <div>
        <p className="section-label mb-2">Notes (optional)</p>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What happened today?" className="input-field w-full h-28 resize-none" />
      </div>
      <Button variant="primary" size="lg" fullWidth loading={saving} disabled={!status} onClick={handleSave}>
        Save Entry
      </Button>
    </div>
  );
};
