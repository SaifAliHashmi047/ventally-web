import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { getNotificationHistory } from '../../api/notificationsApi';
import apiInstance from '../../api/apiInstance';
import { Bell, ChevronRight, Settings } from 'lucide-react';
import i18n from '../../locales/i18n';

export const Notifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationHistory(30, 0)
      .then(res => setNotifications(res.data?.notifications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await apiInstance.put('notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader
        title={t('Notifications.title')}
        onBack={() => navigate(-1)}
        rightContent={
          unreadCount > 0 ? (
            <Button variant="glass" size="sm" onClick={markAllRead}>{t('Notifications.markAllRead')}</Button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : notifications.length === 0 ? (
        <EmptyState title={t('Notifications.noNotifications')} description={t('Notifications.noNotificationsDescription')} icon={<Bell size={22} />} />
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <GlassCard
              key={n.id}
              hover
              padding="md"
              rounded="2xl"
              onClick={() => navigate(`notifications/${n.id}`, { state: { notification: n } })}
              className={`cursor-pointer transition-all ${!n.isRead ? 'border-l-2 border-primary' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? 'glass text-gray-500' : 'bg-primary/15 text-primary'}`}>
                  <Bell size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-300' : 'text-white'}`}>{n.title}</p>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary ml-auto flex-shrink-0" />}
                  </div>
                  {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(n.createdAt).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
