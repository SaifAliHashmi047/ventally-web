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
      <PageHeader title={t('Notifications.title')} onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pb-6">
          {notification.body && (
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{notification.body}</p>
          )}
        </div>
      </div>
    </div>
  );
};
