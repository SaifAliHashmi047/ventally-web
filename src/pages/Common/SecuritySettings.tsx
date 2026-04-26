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
import { toastSuccess, toastError } from '../../utils/toast';

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
      // Handle both response shapes from the API
      const enabled = (res as any)?.twoFactorAuthentication?.enabled ?? res?.enabled ?? false;
      setTwoFactorEnabled(enabled);
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
      toastSuccess(
        newStatus
          ? t('Security.twoFactorEnabledSuccess')
          : t('Security.twoFactorDisabledSuccess')
      );
    } catch (error: any) {
      toastError(error?.error || t('Common.somethingWentWrong'));
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Security.title')} onBack={() => navigate(-1)} />

      {/* Enable Biometrics — web shows toggle but disabled (no native biometrics on web) */}
      <GlassCard bordered padding="none" rounded="2xl" className="mb-4">
        <div className="settings-item flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
              <Fingerprint size={15} />
            </div>
            <span className="text-sm font-medium text-white">
              {t('Security.enableBiometrics')}
            </span>
          </div>
          <Toggle
            checked={false}
            onChange={() => {}}
            disabled={true}
            size="sm"
          />
        </div>
      </GlassCard>

      {/* Account security actions */}
      <GlassCard padding="none" rounded="2xl">
        {/* Reset Password */}
        <button
          className="settings-item w-full flex justify-between items-center px-4 py-3 border-b border-white/5 text-left"
          onClick={() => navigate(`${basePath}/security/change-password`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
              <Lock size={15} />
            </div>
            <span className="text-sm font-medium text-white">
              {t('Security.resetPassword')}
            </span>
          </div>
          <ChevronRight size={16} className="text-white/80" />
        </button>

        {/* Change Email */}
        <button
          className="settings-item w-full flex justify-between items-center px-4 py-3 border-b border-white/5 text-left"
          onClick={() => navigate(`${basePath}/update-email`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
              <Mail size={15} />
            </div>
            <span className="text-sm font-medium text-white">
              {t('Security.changeEmail')}
            </span>
          </div>
          <ChevronRight size={16} className="text-white/80" />
        </button>

        {/* Two-Factor Authentication */}
        <div className="settings-item flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
              <Shield size={15} />
            </div>
            <span className="text-sm font-medium text-white">
              {t('Security.twoFactorEnabled')}
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
    </div>
  );
};
