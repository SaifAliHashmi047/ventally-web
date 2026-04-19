import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCredentialsChange } from '../../api/hooks/useCredentialsChange';
import { toastSuccess, toastError } from '../../utils/toast';

export const UpdateEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { changeEmail } = useCredentialsChange();

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!currentEmail || !newEmail) {
      toastError(t('Common.fillRequiredFields'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toastError(t('Common.invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      await changeEmail(newEmail);
      toastSuccess(t('Security.success.emailChanged'));
      navigate(-1);
    } catch (error: any) {
      toastError(error?.error || t('Common.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="" onBack={() => navigate(-1)} />

      <GlassCard bordered>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-white mb-1">{t('UpdateEmail.title')}</h2>
          <p className="text-sm text-gray-400">{t('UpdateEmail.subtitle')}</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder={t('UpdateEmail.currentEmail')}
            value={currentEmail}
            onChange={e => setCurrentEmail(e.target.value)}
          />
          <Input
            placeholder={t('UpdateEmail.newEmail')}
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!currentEmail || !newEmail}
        onClick={handleSendOTP}
        className="mt-4"
      >
        {t('UpdateEmail.sendOTP')}
      </Button>
    </div>
  );
};
