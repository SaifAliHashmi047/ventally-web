import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { ChevronRight, Lock, Bell, Shield, Mail, LogOut } from 'lucide-react';
import { logout } from '../../store/slices/userSlice';
import type { RootState } from '../../store/store';
import { getNotificationSettings, updateNotificationSettings } from '../../api/notificationsApi';

export const ListenerSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  useEffect(() => {
    getNotificationSettings().then(res => {
      setNotifications(res.data?.pushNotifications ?? true);
      setEmailAlerts(res.data?.emailAlerts ?? true);
    }).catch(() => {});
  }, []);

  const handlePushToggle = (checked: boolean) => {
    setNotifications(checked);
    updateNotificationSettings({ pushNotifications: checked }).catch(() => {});
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailAlerts(checked);
    updateNotificationSettings({ emailAlerts: checked }).catch(() => {});
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Profile.settings', 'Settings')} />

      {/* Profile */}
      <GlassCard bordered hover onClick={() => navigate('/listener/profile')} className="cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-xl font-bold text-white">
            {(user?.firstName?.[0] || 'L').toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-white">{user?.displayName || user?.firstName || t('ListenerHome.listener', 'Listener')}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>
      </GlassCard>

      {/* Notification Preferences */}
      <div className="mt-6">
        <p className="section-label mb-2">{t('Profile.settings.preferences', 'Preferences')}</p>
        <GlassCard padding="none" rounded="2xl">
          <div className="settings-item flex justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">{t('Notifications.push', 'Push Notifications')}</p>
            </div>
            <Toggle checked={notifications} onChange={handlePushToggle} size="sm" />
          </div>
          <div className="settings-item flex justify-between px-4 py-3" style={{ borderBottomWidth: 0 }}>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">{t('Notifications.email', 'Email Alerts')}</p>
            </div>
            <Toggle checked={emailAlerts} onChange={handleEmailToggle} size="sm" />
          </div>
        </GlassCard>
      </div>

      {/* Account */}
      <div className="mt-6">
        <p className="section-label mb-2">{t('Profile.title', 'Account')}</p>
        <GlassCard padding="none" rounded="2xl">
          {[
            { icon: Shield, label: t('Security.title', 'Security Settings'), path: '/listener/security' },
            { icon: Lock, label: t('Security.changePassword', 'Change Password'), path: '/listener/security/change-password' },
            { icon: ChevronRight, label: t('Legal.title', 'Legal & Policies'), path: '/listener/legal' },
            { icon: ChevronRight, label: t('Contact.title', 'Contact Support'), path: '/listener/contact' },
          ].map(({ icon: Icon, label, path }, i, arr) => (
            <div key={label} className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer" onClick={() => navigate(path)}
              style={{ borderBottomWidth: i === arr.length - 1 ? 0 : '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-gray-500" />
                <p className="text-sm font-medium text-white">{label}</p>
              </div>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          ))}
        </GlassCard>
      </div>

      <div className="mt-6 mb-8">
        <Button variant="danger" fullWidth leftIcon={<LogOut size={16} />} onClick={handleLogout}>
          {t('Profile.logout', 'Log Out')}
        </Button>
      </div>
    </div>
  );
};
