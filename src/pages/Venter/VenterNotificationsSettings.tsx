import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { getNotificationSettings, updateNotificationSettings } from '../../api/notificationsApi';
import {
  BellOff, MessageSquare, Phone, Clock, Volume2, Bell, Heart, BookOpen, Sparkles, ChevronRight
} from 'lucide-react';

interface NotifState {
  pauseAll: boolean;
  messages: boolean;
  call: boolean;
  reminder: boolean;
  sound: boolean;
  inAppAlert: boolean;
  listenerReplied: boolean;
  moodLog: boolean;
  reflectionLog: boolean;
  wellnessNudges: boolean;
  remindMeAt: string;
}

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  const value = `${hour}:00 ${ampm}`;
  return { label: value, value };
});

const convertToUTC = (timeStr: string) => {
  if (!timeStr) return '00:00';
  const [time, period] = timeStr.split(' ');
  let [hours] = time.split(':').map(Number);
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, 0, 0, 0);
  return `${d.getUTCHours().toString().padStart(2, '0')}:00`;
};

const convertToLocal = (utcStr: string) => {
  if (!utcStr) return '12:00 AM';
  const [hours] = utcStr.split(':').map(Number);
  const d = new Date();
  d.setUTCHours(hours, 0, 0, 0);
  let localHours = d.getHours();
  const period = localHours >= 12 ? 'PM' : 'AM';
  localHours = localHours % 12 || 12;
  return `${localHours}:00 ${period}`;
};

export const VenterNotificationsSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifs, setNotifs] = useState<NotifState>({
    pauseAll: false,
    messages: false,
    call: false,
    reminder: true,
    sound: true,
    inAppAlert: true,
    listenerReplied: false,
    moodLog: true,
    reflectionLog: true,
    wellnessNudges: true,
    remindMeAt: '12:00 AM',
  });

  useEffect(() => {
    getNotificationSettings()
      .then(res => {
        if (res?.data) {
          const s = res.data;
          setNotifs(prev => ({
            ...prev,
            pauseAll: !s.allNotifications,
            messages: !!s.messageNotifications,
            call: !!s.callNotifications,
            reminder: !!s.reminderNotifications,
            sound: !!s.soundVibration,
            inAppAlert: !!s.inAppAlerts,
            remindMeAt: convertToLocal(s.remindMeAtUtc || '00:00'),
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const syncSettings = useCallback(async (updates: any) => {
    setIsUpdating(true);
    try {
      await updateNotificationSettings(updates);
    } catch {
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const toggleNotif = (key: keyof NotifState) => {
    setNotifs(prev => {
      let next: NotifState;
      if (key === 'pauseAll') {
        const newVal = !prev.pauseAll;
        next = {
          ...prev,
          pauseAll: newVal,
          ...(newVal ? {
            messages: false, call: false, reminder: false, sound: false,
            inAppAlert: false, listenerReplied: false, moodLog: false,
            reflectionLog: false, wellnessNudges: false,
          } : {}),
        };
        syncSettings({ allNotifications: !newVal });
      } else {
        next = { ...prev, [key]: !prev[key] };
        const apiMap: Record<string, any> = {
          messages: { messageNotifications: next.messages },
          call: { callNotifications: next.call },
          reminder: { reminderNotifications: next.reminder },
          sound: { soundVibration: next.sound },
          inAppAlert: { inAppAlerts: next.inAppAlert },
        };
        if (apiMap[key]) syncSettings(apiMap[key]);
      }
      return next;
    });
  };

  const handleRemindTimeChange = (time: string) => {
    setNotifs(prev => ({ ...prev, remindMeAt: time }));
    syncSettings({ remindMeAtUtc: convertToUTC(time) });
  };

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('NotificationsSettings.title', 'Notifications')} onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      {isUpdating && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="glass p-6 rounded-2xl">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

      <PageHeader title={t('NotificationsSettings.title', 'Notifications')} onBack={() => navigate(-1)} />

      {/* Pause All */}
      <GlassCard padding="none" rounded="2xl" className="mb-4">
        <div className="settings-item flex justify-between items-center px-4 py-3" style={{ borderBottomWidth: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <BellOff size={15} />
            </div>
            <span className="text-sm font-medium text-white">{t('NotificationsSettings.pauseAll', 'Pause All')}</span>
          </div>
          <Toggle checked={notifs.pauseAll} onChange={() => toggleNotif('pauseAll')} size="sm" />
        </div>
      </GlassCard>

      {/* Remind Me At */}
      <GlassCard padding="none" rounded="2xl" className="mb-4">
        <div className="settings-item flex justify-between items-center px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <Clock size={15} />
            </div>
            <span className={`text-sm font-medium ${notifs.pauseAll ? 'text-gray-500' : 'text-white'}`}>
              {t('NotificationsSettings.reminderMeAt', 'Remind Me At')}
            </span>
          </div>
          <select
            value={notifs.remindMeAt}
            onChange={e => handleRemindTimeChange(e.target.value)}
            disabled={notifs.pauseAll}
            className="bg-white/8 border border-white/10 rounded-lg text-xs text-white px-2 py-1 disabled:opacity-40 cursor-pointer"
          >
            {TIME_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
            ))}
          </select>
        </div>
        <div
          className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer"
          style={{ borderBottomWidth: 0 }}
          onClick={() => !notifs.pauseAll && navigate('/venter/notifications/quiet-hours')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <BellOff size={15} />
            </div>
            <span className={`text-sm font-medium ${notifs.pauseAll ? 'text-gray-500' : 'text-white'}`}>
              {t('NotificationsSettings.quietHours', 'Quiet Hours')}
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>
      </GlassCard>

      {/* Notification Categories */}
      <GlassCard padding="none" rounded="2xl">
        {[
          { key: 'messages' as const, icon: MessageSquare, label: t('NotificationsSettings.messages', 'Message Notifications') },
          { key: 'call' as const, icon: Phone, label: t('NotificationsSettings.call', 'Voice Notifications') },
          { key: 'reminder' as const, icon: Clock, label: t('NotificationsSettings.reminder', 'Reminder Notifications') },
          { key: 'sound' as const, icon: Volume2, label: t('NotificationsSettings.sound', 'Sound & Vibration') },
          { key: 'inAppAlert' as const, icon: Bell, label: t('NotificationsSettings.inAppAlert', 'In App Alerts') },
          { key: 'listenerReplied' as const, icon: Heart, label: t('NotificationsSettings.listenerReplied', 'Your Support Guide Replied') },
          { key: 'moodLog' as const, icon: Sparkles, label: t('NotificationsSettings.moodLog', 'Mood Log') },
          { key: 'reflectionLog' as const, icon: BookOpen, label: t('NotificationsSettings.reflectionLog', 'Reflection Log') },
          { key: 'wellnessNudges' as const, icon: Heart, label: t('NotificationsSettings.wellnessNudges', 'Wellness Nudges') },
        ].map(({ key, icon: Icon, label }, i, arr) => (
          <div
            key={key}
            className="settings-item flex justify-between items-center px-4 py-3"
            style={{ borderBottomWidth: i === arr.length - 1 ? 0 : undefined }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
                <Icon size={15} />
              </div>
              <span className={`text-sm font-medium ${notifs.pauseAll ? 'text-gray-500' : 'text-white'}`}>{label}</span>
            </div>
            <Toggle
              checked={notifs[key] as boolean}
              onChange={() => toggleNotif(key)}
              disabled={notifs.pauseAll}
              size="sm"
            />
          </div>
        ))}
      </GlassCard>
    </div>
  );
};
