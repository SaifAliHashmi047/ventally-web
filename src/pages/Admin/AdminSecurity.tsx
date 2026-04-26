import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toggle } from '../../components/ui/Toggle';
import { ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminSecurity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const toggleBiometrics = (val: boolean) => {
    setIsBiometricsEnabled(val);
    toast.success(val ? 'Biometrics enabled' : 'Biometrics disabled');
  };

  const toggle2FA = (val: boolean) => {
    setIsTwoFactorEnabled(val);
    toast.success(val ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
  };

  const SecurityItem = ({ title, onPress, type = 'link', value, onValueChange }: any) => (
    <div 
      className={`flex items-center justify-between px-4 py-4 border-b border-white/5 transition-colors ${type === 'link' ? 'cursor-pointer hover:bg-white/5' : ''}`}
      onClick={type === 'link' ? onPress : undefined}
    >
      <span className="text-sm font-medium text-white">{title}</span>
      {type === 'toggle' ? (
        <Toggle checked={value} onChange={onValueChange} size="sm" />
      ) : (
        <ChevronRight size={16} className="text-white/80" />
      )}
    </div>
  );

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader 
        title={t('Admin.security.title')} 
        onBack={() => navigate('/admin/settings')} 
      />

      <GlassCard padding="none" rounded="2xl" className="overflow-hidden mt-2">
        <SecurityItem
          title={t('Admin.security.enableBiometrics')}
          type="toggle"
          value={isBiometricsEnabled}
          onValueChange={toggleBiometrics}
        />
        <SecurityItem
          title={t('Admin.security.resetPassword')}
          onPress={() => navigate('/admin/reset-password')}
        />
        <SecurityItem
          title={t('Admin.security.changeEmailPhone')}
          onPress={() => navigate('/admin/change-email')}
        />
        <SecurityItem
          title={t('Admin.security.twoFactorAuth')}
          type="toggle"
          value={isTwoFactorEnabled}
          onValueChange={toggle2FA}
        />
      </GlassCard>
    </div>
  );
};
