import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const AdminChangeEmailPhone = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleSendOTP = () => {
    navigate('/admin/verify-otp', { 
      state: { 
        type: 'email', 
        value: newEmail 
      } 
    });
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-full">
      <PageHeader 
        title="" 
        onBack={() => navigate('/admin/security')} 
      />

      <div className="flex-1 px-4 pt-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          {t('Admin.security.changeEmail.title', 'Change Email')}
        </h1>
        <p className="text-sm text-white/40 mb-10">
          {t('Admin.security.changeEmail.subtitle', 'Enter your current and new email address to receive a verification code.')}
        </p>

        <div className="space-y-4 text-left">
          <Input
            title={t('Admin.security.changeEmail.currentEmail', 'Current Email')}
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            placeholder="admin@example.com"
            className="h-14"
          />
          <Input
            title={t('Admin.security.changeEmail.newEmail', 'New Email')}
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
          disabled={!currentEmail || !newEmail}
          onClick={handleSendOTP}
        >
          {t('Admin.security.changeEmail.button', 'Send Code')}
        </Button>
      </div>
    </div>
  );
};
