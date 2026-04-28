import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { ChevronRight, Bell, Shield, LogOut, UserCog, Moon } from 'lucide-react';
import { logout } from '../../store/slices/userSlice';
import { toggleDarkMode } from '../../store/slices/appSlice';
import type { RootState } from '../../store/store';

export const ListenerSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => (state.app as any)?.isDarkMode ?? true);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Listener.settings.title', 'Settings')} />

      {/* Settings List */}
      <div>
        <GlassCard padding="none" rounded="2xl">
          {/* Notifications */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/listener/notifications-settings')}
          >
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-white" />
              <p className="text-sm font-medium text-white">
                {t('VenterSettings.options.notifications.title', 'Notifications')}
              </p>
            </div>
            <ChevronRight size={16} className="text-white" />
          </div>

          {/* Dark Mode */}
          <div className="settings-item flex justify-between items-center px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Moon size={16} className="text-white/80" />
              <p className="text-sm font-medium text-white">
                {t('VenterSettings.options.darkTheme.title', 'Dark Mode')}
              </p>
            </div>
            <Toggle
              checked={isDark}
              onChange={(next) => { if (next !== isDark) dispatch(toggleDarkMode()); }}
              size="sm"
            />
          </div>

          {/* Change Account Type */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/listener/change-account-type')}
          >
            <div className="flex items-center gap-3">
              <UserCog size={16} className="text-white" />
              <p className="text-sm font-medium text-white">
                {t('VenterSettings.options.changeAccountType.title', 'Change Account Type')}
              </p>
            </div>
            <ChevronRight size={16} className="text-white" />
          </div>

          {/* Security */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/listener/security')}
          >
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-white" />
              <p className="text-sm font-medium text-white">{t('Security.title', 'Security')}</p>
            </div>
            <ChevronRight size={16} className="text-white" />
          </div>

          {/* Legal & Policies */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/listener/legal')}
          >
            <div className="flex items-center gap-3">
              <ChevronRight size={16} className="text-white opacity-0" />
              <p className="text-sm font-medium text-white">{t('Legal.title', 'Legal & Policies')}</p>
            </div>
            <ChevronRight size={16} className="text-white" />
          </div>

          {/* Contact Us */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => navigate('/listener/contact')}
            style={{ borderBottomWidth: 0 }}
          >
            <div className="flex items-center gap-3">
              <ChevronRight size={16} className="text-white opacity-0" />
              <p className="text-sm font-medium text-white">{t('Contact.title', 'Contact Us')}</p>
            </div>
            <ChevronRight size={16} className="text-white" />
          </div>
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
