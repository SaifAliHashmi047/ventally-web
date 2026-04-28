import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Bell,
  Shield,
  Lock,
  UserCog,
  Moon,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import { toggleDarkMode } from '../../store/slices/appSlice';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { Button } from '../../components/ui/Button';
type SettingsNavItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  type: 'nav';
  onPress: () => void | Promise<void>;
};

type SettingsToggleItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  type: 'toggle';
  value: boolean;
  onChange: (value: boolean) => void;
};

type SettingsItem = SettingsNavItem | SettingsToggleItem;

export const VenterSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => (state.app as any)?.isDarkMode ?? true);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const SETTINGS_ITEMS: SettingsItem[] = [
    {
      key: 'general',
      title: t('VenterSettings.options.generalSettings.title'),
      icon: Settings,
      onPress: () => navigate('/venter/general-settings'),
      type: 'nav',
    },
    {
      key: 'notifications',
      title: t('VenterSettings.options.notifications.title'),
      icon: Bell,
      onPress: () => navigate('/venter/notifications-settings'),
      type: 'nav',
    },
    {
      key: 'darkTheme',
      title: t('VenterSettings.options.darkTheme.title'),
      icon: Moon,
      type: 'toggle',
      value: isDark,
      onChange: (next) => {
        if (next !== isDark) dispatch(toggleDarkMode());
      },
    },
    {
      key: 'changeAccountType',
      title: t('VenterSettings.options.changeAccountType.title'),
      icon: UserCog,
      onPress: () => navigate('/venter/change-account-type'),
      type: 'nav',
    },
    {
      key: 'security',
      title: t('Security.title'),
      icon: Shield,
      onPress: () => navigate('/venter/security'),
      type: 'nav',
    },
    {
      key: 'legal',
      title: t('Legal.title'),
      icon: Lock,
      onPress: () => navigate('/venter/legal'),
      type: 'nav',
    },
    {
      key: 'contact',
      title: t('Contact.title'),
      icon: ChevronRight,
      onPress: () => navigate('/venter/contact'),
      type: 'nav',
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Title — centered, matching RN */}
      <h1 className="text-lg font-medium text-white text-center mb-6">
        {t('VenterSettings.title')}
      </h1>

      <GlassCard padding="none" rounded="2xl">
        {SETTINGS_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === SETTINGS_ITEMS.length - 1;
          return (
            <div
              key={item.key}
              className={`settings-item flex justify-between items-center px-4 py-3 ${
                !isLast ? 'border-b border-white/5' : ''
              } ${item.type === 'nav' ? 'cursor-pointer' : ''}`}
              onClick={item.type === 'nav' ? item.onPress : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-white/80" />
                <p className="text-sm font-medium text-white">{item.title}</p>
              </div>
              {item.type === 'toggle' ? (
                <Toggle
                  checked={item.value}
                  onChange={item.onChange}
                  size="sm"
                />
              ) : (
                <ChevronRight size={16} className="text-white" />
              )}
            </div>
          );
        })}
      </GlassCard>

      <div className="mt-6 mb-8">
        <Button
          variant="danger"
          fullWidth
          leftIcon={<LogOut size={16} />}
          onClick={handleLogout}
        >
          {t('Profile.logout')}
        </Button>
      </div>
    </div>
  );
};
