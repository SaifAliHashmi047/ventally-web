import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const limit = 20;

export const Notifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Determine the base path (venter or listener)
  const basePath = location.pathname.includes('/listener') ? '/listener' : '/venter';

  const fetchNotifs = async (newOffset: number = 0, isRefresh: boolean = false) => {
    try {
      if (isRefresh) setLoading(true);
      else if (newOffset > 0) setLoadingMore(true);
      else setLoading(true);

      const res = await getNotificationHistory(limit, newOffset);
      let notifs = [];
      if (Array.isArray(res?.data)) {
        notifs = res.data;
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        notifs = res.data.data;
      }

      if (isRefresh) {
        setNotifications(notifs);
      } else {
        setNotifications(prev => newOffset === 0 ? notifs : [...prev, ...notifs]);
      }

      setOffset(newOffset);
      setHasMore(notifs.length === limit);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (newOffset === 0) setNotifications([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifs(0);
  }, []);

  const markAllRead = async () => {
    try {
      await apiInstance.put('notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch { /* ignore */ }
  };

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.read_at) {
        await apiInstance.put(`notifications/${notification.id}/read`);
        setNotifications(prev => prev.map(n =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        ));
      }
      navigate(`${basePath}/notifications/${notification.id}`, { state: { notification } });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      navigate(`${basePath}/notifications/${notification.id}`, { state: { notification } });
    }
  };

  const getTranslatedTitle = (title: string) => {
    if (title === "Incoming call") return t('Notifications.incomingCall', 'Incoming call');
    if (title === "New chat request") return t('Notifications.incomingChat', 'New chat request');
    return title;
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

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
        <>
          <div className="space-y-2">
            {notifications.map((n: any) => {
              const isRead = !!n.read_at;
              return (
                <GlassCard
                  key={n.id}
                  hover
                  padding="md"
                  rounded="2xl"
                  onClick={() => handleNotificationClick(n)}
                  className={`cursor-pointer transition-all ${!isRead ? 'border-l-2 border-primary' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isRead ? 'glass text-white/80' : 'bg-primary/15 text-primary'}`}>
                      <Bell size={15} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${isRead ? 'text-gray-300' : 'text-white'}`}>{getTranslatedTitle(n.title)}</p>
                        {!isRead && <div className="w-2 h-2 rounded-full bg-primary ml-auto flex-shrink-0" />}
                      </div>
                      {n.body && <p className="text-xs text-white/80 mt-0.5 line-clamp-2">{n.body}</p>}
                      {n.created_at && (
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(n.created_at).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {hasMore && !loading && notifications.length > 0 && (
            <button
              onClick={() => fetchNotifs(offset + limit)}
              className="w-full max-w-sm mx-auto glass rounded-2xl py-3.5 text-sm font-medium text-white border border-white/10 hover:bg-white/5 transition-colors mt-4"
            >
              {t('Common.loadMore', 'Load More')}
            </button>
          )}
        </>
      )}
    </div>
  );
};
