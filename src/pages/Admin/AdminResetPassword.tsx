import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCredentialsChange } from '../../api/hooks/useCredentialsChange';
import { toast } from 'react-toastify';

export const AdminResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { changePassword } = useCredentialsChange();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('Admin.security.resetPasswordScreen.passwordMismatch', 'Passwords do not match'));
      return;
    }

    setLoading(true);
    try {
      await changePassword({ 
        currentPassword: oldPassword, 
        newPassword 
      });

      // Navigate to success
      navigate('/admin/security-success', {
        state: {
          type: 'password',
          title: t('Admin.security.success.passwordReset'),
          subtitle: t('Admin.security.success.passwordSubtitle')
        }
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error?.error || t('Common.error', 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-full">
      <PageHeader 
        title={t('Admin.resetPassword.title')} 
        subtitle={t('Admin.resetPassword.subtitle')}
        onBack={() => navigate('/admin/security')} 
        centered
      />

      <div className="flex-1 px-4 pt-10 space-y-6">
        <Input
          label={t('Admin.resetPassword.oldPassword')}
          isPassword
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="••••••••"
          className="h-14"
        />
        <Input
          label={t('Admin.resetPassword.newPassword')}
          isPassword
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="h-14"
        />
        <Input
          label={t('Admin.resetPassword.confirmPassword')}
          isPassword
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="h-14"
        />
      </div>

      <div className="p-4 pt-10">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          className="rounded-full h-14 font-bold"
          disabled={!oldPassword || !newPassword || newPassword !== confirmPassword || loading}
          loading={loading}
          onClick={handleUpdate}
        >
          {t('Admin.resetPassword.button')}
        </Button>
      </div>
    </div>
  );
};
