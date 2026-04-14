import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { getNotificationSettings, updateNotificationSettings } from '../../api/notificationsApi';
import { Clock, CheckCircle } from 'lucide-react';

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  const label = `${hour}:00 ${ampm}`;
  return { label, value: label };
});

const convertToUTC = (timeStr: string) => {
  if (!timeStr) return '';
  const [time, period] = timeStr.split(' ');
  let [hours] = time.split(':').map(Number);
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, 0, 0, 0);
  return `${d.getUTCHours().toString().padStart(2, '0')}:00`;
};

const convertToLocal = (utcStr: string) => {
  if (!utcStr) return '';
  const [hours] = utcStr.split(':').map(Number);
  const d = new Date();
  d.setUTCHours(hours, 0, 0, 0);
  let localHours = d.getHours();
  const period = localHours >= 12 ? 'PM' : 'AM';
  localHours = localHours % 12 || 12;
  return `${localHours}:00 ${period}`;
};

export const VenterQuietHours = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getNotificationSettings()
      .then(res => {
        if (res?.data) {
          setStartTime(convertToLocal(res.data.quietHoursStartUtc || ''));
          setEndTime(convertToLocal(res.data.quietHoursEndUtc || ''));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!startTime || !endTime) return;
    setSaving(true);
    try {
      await updateNotificationSettings({
        quietHoursStartUtc: convertToUTC(startTime),
        quietHoursEndUtc: convertToUTC(endTime),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('QuietHours.title', 'Quiet Hours')} onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('QuietHours.title', 'Quiet Hours')} onBack={() => navigate(-1)} />

      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-3 bg-success/15 border border-success/25 rounded-2xl px-4 py-3 mb-4 animate-fade-in">
          <CheckCircle size={18} className="text-success flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">{t('QuietHours.addedTitle', 'Quiet Hours Saved')}</p>
            <p className="text-xs text-gray-400">{t('QuietHours.addedDescription', 'Your Quiet Hours Have Been Updated')}</p>
          </div>
        </div>
      )}

      {/* Description */}
      <GlassCard className="mb-4">
        <div className="flex items-start gap-3">
          <Clock size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('QuietHours.description', 'Quiet Hours let you silence non-urgent Ventally notifications during the times you choose.')}
          </p>
        </div>
      </GlassCard>

      <GlassCard bordered className="mb-4">
        <div className="space-y-5">
          {/* Start Time */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">{t('QuietHours.startTime', 'Start Time')}</p>
            <select
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full input-field text-sm"
            >
              <option value="" disabled className="bg-gray-900">
                {t('QuietHours.placeholder', 'Select time')}
              </option>
              {TIME_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
              ))}
            </select>
          </div>

          {/* End Time */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">{t('QuietHours.endTime', 'End Time')}</p>
            <select
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full input-field text-sm"
            >
              <option value="" disabled className="bg-gray-900">
                {t('QuietHours.placeholder', 'Select time')}
              </option>
              {TIME_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!startTime || !endTime}
        loading={saving}
        onClick={handleSave}
      >
        {t('QuietHours.addButton', 'Save')}
      </Button>
    </div>
  );
};
