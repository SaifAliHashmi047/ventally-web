import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import {
  BellOff, MessageSquare, Phone, Clock, Volume2, Bell,
  Heart, BookOpen, Sparkles, ChevronRight
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NotificationSettings {
  allNotifications: boolean;
  messageNotifications: boolean;
  callNotifications: boolean;
  reminderNotifications: boolean;
  soundVibration: boolean;
  inAppAlerts: boolean;
  remindMeAtUtc: string;
  quietHoursStartUtc?: string;
  quietHoursEndUtc?: string;
}

interface LocalState {
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
  remindMeAt: string; // local display value e.g. "8:00 PM"
}

// ─── Time helpers ─────────────────────────────────────────────────────────────
/**
 * Build 24 time options: "12:00 AM", "1:00 AM", ..., "11:00 PM"
 * Matches the RN app's useMemo logic exactly.
 */
const buildTimeOptions = () =>
  Array.from({ length: 24 }, (_, hour) => {
    const displayHour = ((hour + 11) % 12) + 1; // 12,1,2,...,11
    const period = hour < 12 ? 'AM' : 'PM';
    const value = `${displayHour}:00 ${period}`;
    return { label: value, value };
  });

const TIME_OPTIONS = buildTimeOptions();

/** Convert local display string "8:00 PM" → UTC string "20:00" */
const localToUtc = (timeStr: string): string => {
  if (!timeStr) return '00:00';
  const parts = timeStr.split(' ');
  if (parts.length < 2) return '00:00';
  const [time, period] = parts;
  let hours = parseInt(time.split(':')[0], 10);
  if (isNaN(hours)) return '00:00';
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, 0, 0, 0);
  return `${d.getUTCHours().toString().padStart(2, '0')}:00`;
};

/** Convert UTC string "20:00" → local display string "8:00 PM" */
const utcToLocal = (utcStr: string): string => {
  if (!utcStr) return '12:00 AM';
  const hours = parseInt(utcStr.split(':')[0], 10);
  if (isNaN(hours)) return '12:00 AM';
  const d = new Date();
  d.setUTCHours(hours, 0, 0, 0);
  let localHours = d.getHours();
  const period = localHours >= 12 ? 'PM' : 'AM';
  localHours = localHours % 12 || 12;
  return `${localHours}:00 ${period}`;
};

// ─── API helpers ──────────────────────────────────────────────────────────────
const fetchSettings = async (): Promise<NotificationSettings | null> => {
  try {
    // apiInstance wraps: { success, data: <actual body>, statusCode }
    // Actual body shape: { success: true, data: NotificationSettings }
    const res = await apiInstance.get('notifications/settings');
    // res.data is the raw API body
    const body = res?.data;
    // The API returns { success, data: { allNotifications, ... } }
    if (body?.data) return body.data as NotificationSettings;
    // Fallback: maybe the API returns the settings directly
    if (typeof body?.allNotifications === 'boolean') return body as NotificationSettings;
    return null;
  } catch {
    return null;
  }
};

const saveSettings = async (payload: Partial<NotificationSettings>): Promise<boolean> => {
  try {
    await apiInstance.put('notifications/settings', payload);
    return true;
  } catch {
    return false;
  }
};

// ─── Map API → local state ────────────────────────────────────────────────────
const apiToLocal = (s: NotificationSettings): Partial<LocalState> => ({
  pauseAll: s.allNotifications === false,
  messages: !!s.messageNotifications,
  call: !!s.callNotifications,
  reminder: !!s.reminderNotifications,
  sound: !!s.soundVibration,
  inAppAlert: !!s.inAppAlerts,
  remindMeAt: utcToLocal(s.remindMeAtUtc || '00:00'),
});

// ─── Map local toggle key → API payload ──────────────────────────────────────
const localKeyToApiPayload = (
  key: keyof LocalState,
  newValue: boolean | string
): Partial<NotificationSettings> | null => {
  switch (key) {
    case 'pauseAll':
      return { allNotifications: !(newValue as boolean) };
    case 'messages':
      return { messageNotifications: newValue as boolean };
    case 'call':
      return { callNotifications: newValue as boolean };
    case 'reminder':
      return { reminderNotifications: newValue as boolean };
    case 'sound':
      return { soundVibration: newValue as boolean };
    case 'inAppAlert':
      return { inAppAlerts: newValue as boolean };
    default:
      return null; // local-only toggles (listenerReplied, moodLog, etc.)
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
export const VenterNotificationsSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [state, setState] = useState<LocalState>({
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

  // ── Load settings on mount ──────────────────────────────────────────────────
  useEffect(() => {
    fetchSettings()
      .then(settings => {
        if (settings) {
          setState(prev => ({ ...prev, ...apiToLocal(settings) }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Toggle a boolean setting ────────────────────────────────────────────────
  const handleToggle = useCallback(async (key: keyof LocalState) => {
    // Compute next value
    const currentValue = state[key] as boolean;
    const nextValue = !currentValue;

    // Optimistic update
    let nextState: LocalState;
    if (key === 'pauseAll' && nextValue) {
      // Pause all → disable everything
      nextState = {
        ...state,
        pauseAll: true,
        messages: false,
        call: false,
        reminder: false,
        sound: false,
        inAppAlert: false,
        listenerReplied: false,
        moodLog: false,
        reflectionLog: false,
        wellnessNudges: false,
      };
    } else {
      nextState = { ...state, [key]: nextValue };
    }
    setState(nextState);

    // Sync to API
    const payload = localKeyToApiPayload(key, nextValue);
    if (payload) {
      setIsUpdating(true);
      const ok = await saveSettings(payload);
      setIsUpdating(false);
      if (!ok) {
        // Revert on failure
        setState(state);
        toastError(t('Common.somethingWentWrong'));
      }
    }
  }, [state, t]);

  // ── Change reminder time ────────────────────────────────────────────────────
  const handleRemindTimeChange = useCallback(async (time: string) => {
    setState(prev => ({ ...prev, remindMeAt: time }));
    setIsUpdating(true);
    const ok = await saveSettings({ remindMeAtUtc: localToUtc(time) });
    setIsUpdating(false);
    if (!ok) {
      toastError(t('Common.somethingWentWrong'));
    }
  }, [t]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('NotificationsSettings.title')} onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const TOGGLE_ITEMS: {
    key: keyof LocalState;
    icon: React.ComponentType<any>;
    label: string;
    localOnly?: boolean;
  }[] = [
    { key: 'messages',       icon: MessageSquare, label: t('NotificationsSettings.messages') },
    { key: 'call',           icon: Phone,         label: t('NotificationsSettings.call') },
    { key: 'reminder',       icon: Clock,         label: t('NotificationsSettings.reminder') },
    { key: 'sound',          icon: Volume2,       label: t('NotificationsSettings.sound') },
    { key: 'inAppAlert',     icon: Bell,          label: t('NotificationsSettings.inAppAlert') },
    { key: 'listenerReplied',icon: Heart,         label: t('NotificationsSettings.listenerReplied'), localOnly: true },
    { key: 'moodLog',        icon: Sparkles,      label: t('NotificationsSettings.moodLog'),         localOnly: true },
    { key: 'reflectionLog',  icon: BookOpen,      label: t('NotificationsSettings.reflectionLog'),   localOnly: true },
    { key: 'wellnessNudges', icon: Heart,         label: t('NotificationsSettings.wellnessNudges'),  localOnly: true },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Updating overlay */}
      {isUpdating && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center pointer-events-none">
          <div className="glass p-5 rounded-2xl">
            <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      <PageHeader title={t('NotificationsSettings.title')} onBack={() => navigate(-1)} />

      {/* ── Pause All ─────────────────────────────────────────────────────── */}
      <GlassCard padding="none" rounded="2xl" className="mb-4">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <BellOff size={15} />
            </div>
            <span className="text-sm font-medium text-white">
              {t('NotificationsSettings.pauseAll')}
            </span>
          </div>
          <Toggle
            checked={state.pauseAll}
            onChange={() => handleToggle('pauseAll')}
            size="sm"
          />
        </div>
      </GlassCard>

      {/* ── Remind Me At + Quiet Hours ────────────────────────────────────── */}
      <GlassCard padding="none" rounded="2xl" className="mb-4">
        {/* Remind Me At */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <Clock size={15} />
            </div>
            <span className={`text-sm font-medium ${state.pauseAll ? 'text-white/80' : 'text-white'}`}>
              {t('NotificationsSettings.reminderMeAt')}
            </span>
          </div>
          <select
            value={state.remindMeAt}
            onChange={e => handleRemindTimeChange(e.target.value)}
            disabled={state.pauseAll}
            className="bg-white/8 border border-white/10 rounded-lg text-xs text-white px-2 py-1.5 disabled:opacity-40 cursor-pointer outline-none"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            {TIME_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: '#1c1c1e' }}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quiet Hours */}
        <button
          className="w-full flex justify-between items-center px-4 py-3 text-left"
          disabled={state.pauseAll}
          onClick={() => !state.pauseAll && navigate('/venter/notifications/quiet-hours')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <BellOff size={15} />
            </div>
            <span className={`text-sm font-medium ${state.pauseAll ? 'text-white/80' : 'text-white'}`}>
              {t('NotificationsSettings.quietHours')}
            </span>
          </div>
          <ChevronRight size={16} className="text-white/80" />
        </button>
      </GlassCard>

      {/* ── Toggle Items ──────────────────────────────────────────────────── */}
      <GlassCard padding="none" rounded="2xl">
        {TOGGLE_ITEMS.map(({ key, icon: Icon, label }, i) => (
          <div
            key={key}
            className={`flex justify-between items-center px-4 py-3 ${
              i < TOGGLE_ITEMS.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
                <Icon size={15} />
              </div>
              <span className={`text-sm font-medium ${state.pauseAll ? 'text-white/80' : 'text-white'}`}>
                {label}
              </span>
            </div>
            <Toggle
              checked={state[key] as boolean}
              onChange={() => handleToggle(key)}
              disabled={state.pauseAll}
              size="sm"
            />
          </div>
        ))}
      </GlassCard>
    </div>
  );
};
