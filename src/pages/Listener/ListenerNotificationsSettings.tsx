import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { getNotificationSettings, updateNotificationSettings } from '../../api/notificationsApi';
import {
  BellOff, MessageSquare, Phone, Volume2, Bell, Activity
} from 'lucide-react';

interface NotifState {
  pauseAll: boolean;
  messages: boolean;
  call: boolean;
  reminder: boolean;
  sound: boolean;
  inAppAlert: boolean;
  activityStatus: boolean;
}

export const ListenerNotificationsSettings = () => {
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
    activityStatus: true,
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
            messages: false, call: false, reminder: false,
            sound: false, inAppAlert: false, activityStatus: false,
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

      {/* Notification Categories */}
      <GlassCard padding="none" rounded="2xl">
        {[
          { key: 'messages' as const, icon: MessageSquare, label: t('NotificationsSettings.messages', 'Message Notifications') },
          { key: 'call' as const, icon: Phone, label: t('NotificationsSettings.call', 'Voice Notifications') },
          { key: 'activityStatus' as const, icon: Activity, label: t('NotificationsSettings.activityStatus', 'Activity Status') },
          { key: 'sound' as const, icon: Volume2, label: t('NotificationsSettings.sound', 'Sound & Vibration') },
          { key: 'inAppAlert' as const, icon: Bell, label: t('NotificationsSettings.inAppAlert', 'In App Alerts') },
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
              <span className={`text-sm font-medium ${notifs.pauseAll ? 'text-white/80' : 'text-white'}`}>{label}</span>
            </div>
            <Toggle
              checked={notifs[key]}
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
