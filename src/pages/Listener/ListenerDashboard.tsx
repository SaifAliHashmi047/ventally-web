import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toggle } from '../../components/ui/Toggle';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAvailability } from '../../api/hooks/useAvailability';
import { setAvailability } from '../../store/slices/listenerSlice';
import type { RootState } from '../../store/store';
import { Phone, MessageSquare, ChevronRight, Bell, Sparkles, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';
import { toastError } from '../../utils/toast';
import { getUnreadNotificationCount } from '../../api/notificationsApi';

export const ListenerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);
  const requests = useSelector((state: RootState) => state.listener.requests);
  const isAvailable = useSelector((state: RootState) => (state.listener as any).isAvailable as boolean);
  const { goOnline, goOffline } = useAvailability();

  const AVAILABILITY_KEY = 'listener_availability_preference';

  const [loadingToggle, setLoadingToggle] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleAvailabilityToggle = async () => {
    setLoadingToggle(true);
    try {
      if (isAvailable) {
        await goOffline();
        dispatch(setAvailability(false));
        localStorage.setItem(AVAILABILITY_KEY, 'false');
      } else {
        await goOnline();
        dispatch(setAvailability(true));
        localStorage.setItem(AVAILABILITY_KEY, 'true');
      }
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setLoadingToggle(false);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getUnreadNotificationCount();
        const count = (res as any)?.data?.unreadCount ?? 0;
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };
    fetchUnreadCount();
  }, []);

  // Silently refresh presence whenever the user focuses this screen (mount + window focus + tab visible)
  const presenceRunningRef = useRef(false);
  const presenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const refreshPresence = async () => {
      if (presenceRunningRef.current) return;
      presenceRunningRef.current = true;
      try {
        // 1. Read the user's saved preference from localStorage (default online)
        const stored = localStorage.getItem(AVAILABILITY_KEY);
        const wantsOnline = stored === null ? true : stored === 'true';
        // 2. Enforce that preference by calling the matching API
        if (wantsOnline) {
          await goOnline();
        } else {
          await goOffline();
        }
        dispatch(setAvailability(wantsOnline));
      } catch { /* silent */ }
      presenceRunningRef.current = false;
    };

    const scheduleRefresh = () => {
      if (presenceTimerRef.current) clearTimeout(presenceTimerRef.current);
      presenceTimerRef.current = setTimeout(refreshPresence, 150);
    };

    const onFocus = () => scheduleRefresh();
    const onVisible = () => { if (document.visibilityState === 'visible') scheduleRefresh(); };

    scheduleRefresh();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      if (presenceTimerRef.current) clearTimeout(presenceTimerRef.current);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || t('ListenerHome.listener', 'Listener');

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <div className="w-full lg:max-w-3xl xl:max-w-4xl lg:mx-auto space-y-6 lg:space-y-8">
        {/* Header — desktop only; mobile uses layout top bar */}
        <div className="hidden lg:flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/80 mb-1">
              {t('ListenerHome.welcomeBack', 'Welcome back,')}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {firstName} 🎧
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/listener/notifications')}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Availability */}
        <GlassCard bordered>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-base font-semibold text-white">
                {t('ListenerHome.availability', 'Availability')}
              </p>
              <p className="text-sm text-white/80 mt-0.5">
                {isAvailable
                  ? t('ListenerHome.acceptingSessions', 'You are accepting new sessions')
                  : t('ListenerHome.offlineStatus', 'You are currently offline')}
              </p>
            </div>
            <Toggle
              checked={isAvailable}
              onChange={handleAvailabilityToggle}
              disabled={loadingToggle}
              color="accent"
            />
          </div>
          {isAvailable && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              <span className="text-xs text-primary font-medium">
                {t('ListenerHome.onlineReady', 'Online and ready')}
              </span>
            </div>
          )}
        </GlassCard>

        {/* Incoming requests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {t('ListenerHome.incomingRequests', 'Incoming Requests')}
            </h2>
            {requests.length > 0 && (
              <button
                type="button"
                onClick={() => navigate('/listener/requests')}
                className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                {t('Common.viewAll', 'View All')} <ChevronRight size={12} />
              </button>
            )}
          </div>

          {requests.length === 0 ? (
            <EmptyState
              title={t('ListenerHome.noRequests', 'No incoming requests')}
              description={t(
                'ListenerHome.noRequestsDesc',
                'Be the first to connect with someone seeking support.'
              )}
              icon={<Sparkles size={22} />}
            />
          ) : (
            <GlassCard bordered padding="none" rounded="2xl" className="overflow-hidden">
              {requests.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={cn(
                    'settings-item cursor-pointer',
                    index === 0 && 'rounded-t-2xl',
                    index === requests.length - 1 && 'rounded-b-2xl border-b-0'
                  )}
                  onClick={() => navigate('/listener/requests')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center text-accent flex-shrink-0">
                      {item.type === 'call' ? <Phone size={16} /> : <MessageSquare size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {item.type === 'call'
                          ? t('ListenerHome.callSession', 'Call Session')
                          : t('ListenerHome.chatSession', 'Chat Session')}
                      </p>
                      <p className="text-xs text-white/80 mt-0.5 truncate">{item.title}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white flex-shrink-0" />
                </div>
              ))}
            </GlassCard>
          )}
        </section>

        {/* Quick access — wallet + history (no earnings summary on this screen) */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">
            {t('ListenerHome.quickAccess', 'Quick Access')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <GlassCard
              hover
              onClick={() => navigate('/listener/wallet')}
              padding="md"
              rounded="2xl"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-accent">
                <Wallet size={18} />
              </div>
              <p className="text-sm font-medium text-gray-300">
                {t('Navigation.tabs.wallet', 'Balance')}
              </p>
            </GlassCard>
            <GlassCard
              hover
              onClick={() => navigate('/listener/sessions')}
              padding="md"
              rounded="2xl"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-accent">
                <MessageSquare size={18} />
              </div>
              <p className="text-sm font-medium text-gray-300">
                {t('ListenerHome.sessionHistory', 'Session History')}
              </p>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
};
