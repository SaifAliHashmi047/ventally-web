import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toggle } from '../../components/ui/Toggle';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatCard } from '../../components/ui/StatCard';
import { useAvailability } from '../../api/hooks/useAvailability';
import { useEarnings } from '../../api/hooks/useEarnings';
import type { RootState } from '../../store/store';
import { useSelector as useReduxSelector } from 'react-redux';
import { Phone, MessageSquare, ChevronRight, DollarSign, Clock, TrendingUp, Bell, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ListenerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user as any);
  const requests = useReduxSelector((state: RootState) => state.listener.requests);
  const { getStatus, goOnline, goOffline } = useAvailability();
  const { getEarningsSummary } = useEarnings();

  const [isAvailable, setIsAvailable] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [statusRes, earningsRes] = await Promise.allSettled([
          getStatus(),
          getEarningsSummary(),
        ]);
        if (statusRes.status === 'fulfilled') {
          setIsAvailable(statusRes.value?.status?.isOnline ?? false);
        }
        if (earningsRes.status === 'fulfilled') {
          setEarnings(earningsRes.value);
        }
      } catch { /* ignore */ }
    };
    init();
  }, []);

  const handleAvailabilityToggle = async () => {
    setLoadingToggle(true);
    try {
      if (isAvailable) {
        await goOffline();
        setIsAvailable(false);
      } else {
        await goOnline();
        setIsAvailable(true);
      }
    } catch (e) {
      console.error('Failed to update availability', e);
    } finally {
      setLoadingToggle(false);
    }
  };

  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || t('ListenerHome.listener', 'Listener');

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('ListenerHome.welcomeBack', 'Welcome back,')}</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">{firstName} 🎧</h1>
        </div>
        <button
          onClick={() => navigate('/listener/notifications')}
          className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Bell size={18} />
        </button>
      </div>

      {/* Availability Toggle */}
      <div className="mt-6">
        <GlassCard bordered>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">{t('ListenerHome.availability', 'Availability')}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {isAvailable ? t('ListenerHome.acceptingSessions', 'You are accepting new sessions') : t('ListenerHome.offlineStatus', 'You are currently offline')}
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
              <span className="text-xs text-success font-medium">{t('ListenerHome.onlineReady', 'Online and ready')}</span>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <StatCard
          label={t('ListenerHome.availableBalance', 'Available Balance')}
          value={`${earnings?.availableBalance ?? '0.00'}`}
          icon={<DollarSign size={20} />}
          iconColor="#32D74B"
          className="sm:col-span-2"
        />
        <StatCard
          label={t('ListenerHome.sessionsThisMonth', 'Sessions This Month')}
          value={earnings?.totalSessions ?? 0}
          icon={<Clock size={20} />}
          iconColor="#C2AEBF"
        />
      </div>

      {/* Incoming Requests */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('ListenerHome.incomingRequests', 'Incoming Requests')}</h2>
          {requests.length > 0 && (
            <button
              onClick={() => navigate('/listener/requests')}
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
            >
              {t('Common.viewAll', 'View All')} <ChevronRight size={12} />
            </button>
          )}
        </div>

        {requests.length === 0 ? (
          <EmptyState
            title={t('ListenerHome.noRequests', 'No incoming requests')}
            description={t('ListenerHome.noRequestsDesc', 'Be the first to connect with someone seeking support.')}
            icon={<Sparkles size={22} />}
          />
        ) : (
          <GlassCard bordered padding="none" rounded="2xl">
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center text-accent">
                    {item.type === 'call' ? <Phone size={16} /> : <MessageSquare size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.type === 'call' ? t('ListenerHome.callSession', 'Call Session') : t('ListenerHome.chatSession', 'Chat Session')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.title}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            ))}
          </GlassCard>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 mb-8">
        <h2 className="section-title mb-3">{t('ListenerHome.quickAccess', 'Quick Access')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: t('ListenerHome.earningsHistory', 'Earnings History'), icon: TrendingUp, path: '/listener/wallet' },
            { label: t('ListenerHome.sessionHistory', 'Session History'), icon: Clock, path: '/listener/sessions' },
          ].map(({ label, icon: Icon, path }) => (
            <GlassCard
              key={path}
              hover
              onClick={() => navigate(path)}
              padding="md"
              rounded="2xl"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-accent">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-gray-300">{label}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
