import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import {
  ChevronRight, Bell, Shield, Lock, Trash2, LogOut, Settings,
  UserCog, Moon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import { toggleDarkMode } from '../../store/slices/appSlice';
import type { RootState } from '../../store/store';

export const VenterSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);
  const isDark = useSelector((state: RootState) => (state.app as any)?.isDarkMode ?? true);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const handleDarkToggle = (val: boolean) => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('VenterSettings.title', 'Settings')} />

      {/* Profile Card */}
      <GlassCard bordered hover onClick={() => navigate('/venter/profile')} className="cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-xl font-bold text-white">
            {(user?.firstName?.[0] || user?.displayName?.[0] || 'V').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white truncate">
              {user?.displayName || user?.firstName || 'User'}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
        </div>
      </GlassCard>

      {/* Settings List */}
      <div className="mt-6">
        <GlassCard padding="none" rounded="2xl">
          {/* General Settings */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/venter/general-settings')}
          >
            <div className="flex items-center gap-3">
              <Settings size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">
                {t('VenterSettings.options.generalSettings.title', 'General')}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>

          {/* Notifications */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/venter/notifications-settings')}
          >
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">
                {t('VenterSettings.options.notifications.title', 'Notifications')}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>

          {/* Dark Theme Toggle */}
          <div className="settings-item flex justify-between items-center px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Moon size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">Dark Theme</p>
            </div>
            <Toggle checked={isDark} onChange={handleDarkToggle} size="sm" />
          </div>

          {/* Change Account Type */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/venter/change-account-type')}
          >
            <div className="flex items-center gap-3">
              <UserCog size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">
                {t('VenterSettings.options.changeAccountType.title', 'Change Account Type')}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>

          {/* Security */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/venter/security')}
          >
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">{t('Security.title', 'Security')}</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>

          {/* Legal & Policies */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
            onClick={() => navigate('/venter/legal')}
          >
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-gray-500" />
              <p className="text-sm font-medium text-white">{t('Legal.title', 'Legal & Policies')}</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>

          {/* Contact Us */}
          <div
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => navigate('/venter/contact')}
            style={{ borderBottomWidth: 0 }}
          >
            <div className="flex items-center gap-3">
              <ChevronRight size={16} className="text-gray-500 opacity-0" />
              <p className="text-sm font-medium text-white">{t('Contact.title', 'Contact Us')}</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
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
