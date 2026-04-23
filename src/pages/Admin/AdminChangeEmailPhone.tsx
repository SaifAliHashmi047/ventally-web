import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCredentialsChange } from '../../api/hooks/useCredentialsChange';
import { toast } from 'react-toastify';

export const AdminChangeEmailPhone = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestEmailChangeOTP } = useCredentialsChange();

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!newEmail) return;
    
    setLoading(true);
    try {
      await requestEmailChangeOTP(newEmail);
      navigate('/admin/verify-otp', { 
        state: { 
          type: 'email', 
          value: newEmail 
        } 
      });
    } catch (error: any) {
      console.error('Error requesting email change OTP:', error);
      toast.error(error?.error || t('Common.error', 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-full">
      <PageHeader 
        title={t('Admin.changeEmail.title')} 
        subtitle={t('Admin.changeEmail.subtitle')}
        onBack={() => navigate('/admin/security')} 
        centered
      />

      <div className="flex-1 px-4 pt-10 text-center">

        <div className="space-y-4 text-left">
          <Input
            label={t('Admin.changeEmail.currentEmail')}
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            placeholder="admin@example.com"
            className="h-14"
          />
          <Input
            label={t('Admin.changeEmail.newEmail')}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="newemail@example.com"
            className="h-14"
          />
        </div>
      </div>

      <div className="p-4 pt-10">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          className="rounded-full h-14 font-bold"
          disabled={!currentEmail || !newEmail || loading}
          loading={loading}
          onClick={handleSendOTP}
        >
          {t('Admin.changeEmail.button')}
        </Button>
      </div>
    </div>
  );
};
