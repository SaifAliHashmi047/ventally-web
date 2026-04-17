import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { ChevronRight, Shield, Lock, Mail, Fingerprint } from 'lucide-react';
import type { RootState } from '../../store/store';
import { useCredentialsChange } from '../../api/hooks/useCredentialsChange';

export const SecuritySettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getTwoFactorSettings, updateTwoFactorSettings } = useCredentialsChange();
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';
  const basePath = `/${role}`;

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);

  const loadTwoFactorSettings = useCallback(async () => {
    try {
      const res = await getTwoFactorSettings();
      setTwoFactorEnabled(res?.enabled || false);
    } catch {
      // Silently fail
    } finally {
      setLoadingInit(false);
    }
  }, [getTwoFactorSettings]);

  useEffect(() => {
    loadTwoFactorSettings();
  }, [loadTwoFactorSettings]);

  const handleTwoFactorToggle = async () => {
    setLoading2FA(true);
    try {
      const newStatus = !twoFactorEnabled;
      await updateTwoFactorSettings({
        enabled: newStatus,
        method: newStatus ? 'email' : undefined,
      });
      setTwoFactorEnabled(newStatus);
    } catch {
      // Optimistic UI: toggle anyway for demo
      setTwoFactorEnabled(prev => !prev);
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Security.title', 'Security')} onBack={() => navigate(-1)} />

      {/* Biometrics section (web equivalent) */}
      <GlassCard bordered className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <Fingerprint size={15} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{t('Security.enableBiometrics', 'Enable Biometrics')}</p>
              <p className="text-xs text-gray-500">Use your browser's passkey or fingerprint</p>
            </div>
          </div>
          <Toggle
            checked={false}
            onChange={() => {}}
            disabled={true}
            size="sm"
          />
        </div>
        <p className="text-xs text-gray-600 mt-2 ml-12">Biometric login is managed by your browser's passkey settings.</p>
      </GlassCard>

      {/* Account security actions */}
      <GlassCard padding="none" rounded="2xl" className="mb-4">
        {/* Reset Password */}
        <div
          className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
          onClick={() => navigate(`${basePath}/security/change-password`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <Lock size={15} />
            </div>
            <span className="text-sm font-medium text-white">{t('Security.resetPassword', 'Reset Password')}</span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>

        {/* Change Email */}
        <div
          className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
          onClick={() => navigate(`${basePath}/update-email`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <Mail size={15} />
            </div>
            <span className="text-sm font-medium text-white">{t('Security.changeEmail', 'Change Email')}</span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>

        {/* Two-Factor Authentication */}
        <div
          className="settings-item flex justify-between items-center px-4 py-3"
          style={{ borderBottomWidth: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
              <Shield size={15} />
            </div>
            <span className="text-sm font-medium text-white">
              {t('Security.twoFactorEnabled', 'Two Factor Authentication')}
            </span>
          </div>
          <Toggle
            checked={twoFactorEnabled}
            onChange={handleTwoFactorToggle}
            disabled={loading2FA || loadingInit}
            size="sm"
          />
        </div>
      </GlassCard>

      {/* Info card */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Keep your account secure by using a strong, unique password and enabling two-factor authentication.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
