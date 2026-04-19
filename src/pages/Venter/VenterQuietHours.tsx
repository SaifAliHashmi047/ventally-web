import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';
import { Clock } from 'lucide-react';

// Same time options as RN app
const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const displayHour = ((hour + 11) % 12) + 1;
  const period = hour < 12 ? 'AM' : 'PM';
  const value = `${displayHour}:00 ${period}`;
  return { label: value, value };
});

const localToUtc = (timeStr: string): string => {
  if (!timeStr) return '';
  const parts = timeStr.split(' ');
  if (parts.length < 2) return '';
  const [time, period] = parts;
  let hours = parseInt(time.split(':')[0], 10);
  if (isNaN(hours)) return '';
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, 0, 0, 0);
  return `${d.getUTCHours().toString().padStart(2, '0')}:00`;
};

const utcToLocal = (utcStr: string): string => {
  if (!utcStr) return '';
  const hours = parseInt(utcStr.split(':')[0], 10);
  if (isNaN(hours)) return '';
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

  // Load existing quiet hours on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiInstance.get('notifications/settings');
        // apiInstance wraps: res.data = raw API body = { success, data: NotificationSettings }
        const settings = res?.data?.data ?? res?.data;
        if (settings) {
          setStartTime(utcToLocal(settings.quietHoursStartUtc || ''));
          setEndTime(utcToLocal(settings.quietHoursEndUtc || ''));
        }
      } catch {
        // ignore — user may not have settings yet
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!startTime || !endTime) {
      toastError(t('Common.fillRequiredFields'));
      return;
    }
    setSaving(true);
    try {
      await apiInstance.put('notifications/settings', {
        quietHoursStartUtc: localToUtc(startTime),
        quietHoursEndUtc: localToUtc(endTime),
      });
      toastSuccess(t('QuietHours.addedTitle'));
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('QuietHours.title')} onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('QuietHours.title')} onBack={() => navigate(-1)} />

      {/* Description */}
      <GlassCard className="mb-4">
        <div className="flex items-start gap-3">
          <Clock size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('QuietHours.description')}
          </p>
        </div>
      </GlassCard>

      <GlassCard bordered className="mb-4">
        <div className="space-y-5">
          {/* Start Time */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">{t('QuietHours.startTime')}</p>
            <select
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full input-field text-sm"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <option value="" disabled style={{ background: '#1c1c1e' }}>
                {t('QuietHours.placeholder')}
              </option>
              {TIME_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#1c1c1e' }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* End Time */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">{t('QuietHours.endTime')}</p>
            <select
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full input-field text-sm"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <option value="" disabled style={{ background: '#1c1c1e' }}>
                {t('QuietHours.placeholder')}
              </option>
              {TIME_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#1c1c1e' }}>
                  {o.label}
                </option>
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
        {t('QuietHours.addButton')}
      </Button>
    </div>
  );
};
