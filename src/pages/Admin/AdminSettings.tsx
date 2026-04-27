import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { GlassModal } from '../../components/ui/GlassModal';
import { ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import { useTranslation } from 'react-i18next';

export const AdminSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isAccountActive, setIsAccountActive] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogOut = async () => {
    setIsLogoutModalVisible(false);
    await dispatch(logout() as any);
    navigate('/login');
  };

  const SettingsItem = ({ title, type = 'link', value, onValueChange, onPress }: any) => {
    return (
      <div
        className={`flex items-center justify-between px-4 py-4 border-b border-white/5 transition-colors ${type === 'link' ? 'cursor-pointer hover:bg-white/5' : ''}`}
        onClick={type === 'link' ? onPress : undefined}
      >
        <span className="text-sm font-medium text-white">{title}</span>
        {type === 'toggle' ? (
          <Toggle checked={value} onChange={onValueChange} size="sm" />
        ) : (
          <ChevronRight size={16} className="text-white" />
        )}
      </div>
    );
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader title={t('Admin.settings.title', 'Admin Settings')} />

      <GlassCard padding="none" rounded="2xl" className="overflow-hidden">
        <SettingsItem
          title={t('Admin.settings.options.account')}
          type="toggle"
          value={isAccountActive}
          onValueChange={setIsAccountActive}
        />
        <SettingsItem
          title={t('Admin.settings.options.security')}
          onPress={() => navigate('/admin/security')}
        />
        <SettingsItem
          title={t('Admin.settings.options.financialStats')}
          onPress={() => navigate('/admin/financial')}
        />
        <SettingsItem
          title={t('Admin.settings.options.notifications')}
          onPress={() => navigate('/admin/notifications')}
        />
        <SettingsItem
          title={t('Admin.settings.options.paymentHistory')}
          onPress={() => navigate('/admin/payments')}
        />
        <SettingsItem
          title={t('Admin.settings.options.crisisConfig')}
          onPress={() => navigate('/admin/crisis')}
        />
        <SettingsItem
          title={t('Admin.settings.options.exportsIntegrations')}
          onPress={() => navigate('/admin/exports')}
        />
        <SettingsItem
          title={t('Admin.settings.options.rolesPermissions')}
          onPress={() => navigate('/admin/roles')}
        />
        <SettingsItem
          title={t('Admin.settings.options.aiSettings')}
          onPress={() => navigate('/admin/ai-settings')}
        />
        
        {/* Remove bottom border for the last item in the list visually by targeting pseudo or inline, though border-b won't break layout */}
        <SettingsItem
          title={t('Admin.settings.options.logout')}
          onPress={() => setIsLogoutModalVisible(true)}
        />
      </GlassCard>

      <GlassModal
        isOpen={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        title={t('Profile.logoutConfirmTitle', 'Confirm Logout')}
        message={t('Profile.logoutConfirmMessage', 'Are you sure you want to log out?')}
        primaryButtonText={t('Profile.logoutConfirmTitle', 'Logout')}
        onPrimaryPress={handleLogOut}
        secondaryButtonText={t('Common.cancel', 'Cancel')}
        onSecondaryPress={() => setIsLogoutModalVisible(false)}
      />
    </div>
  );
};
