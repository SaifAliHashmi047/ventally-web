import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Bell, Calendar } from 'lucide-react';
import i18n from '../../locales/i18n';

export const NotificationDetail = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const notification = location.state?.notification;

  if (!notification) {
    navigate(-1);
    return null;
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Notifications.notificationDetail')} onBack={() => navigate(-1)} />

      <GlassCard bordered>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{notification.title}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Calendar size={11} />
              {new Date(notification.createdAt).toLocaleDateString(i18n.language, { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
        </div>
        {notification.body && (
          <p className="text-sm text-gray-300 leading-relaxed">{notification.body}</p>
        )}
      </GlassCard>
    </div>
  );
};
