import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const AdminResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = () => {
    // Navigate to success
    navigate('/admin/security-success', {
      state: {
        type: 'password',
        title: t('Admin.security.success.passwordReset', 'Password Changed Successfully'),
        subtitle: t('Admin.security.success.passwordSubtitle', 'Your account password has been updated. Please use your new password for future logins.')
      }
    });
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-full">
      <PageHeader 
        title={t('Admin.security.resetPasswordScreen.title', 'Reset Password')} 
        onBack={() => navigate('/admin/security')} 
      />

      <div className="flex-1 px-4 pt-6 space-y-6">
        <Input
          title={t('Admin.security.resetPasswordScreen.oldPassword', 'Current Password')}
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="••••••••"
          className="h-14"
        />
        <Input
          title={t('Admin.security.resetPasswordScreen.newPassword', 'New Password')}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="h-14"
        />
        <Input
          title={t('Admin.security.resetPasswordScreen.confirmPassword', 'Confirm New Password')}
          type="password"
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
          disabled={!oldPassword || !newPassword || newPassword !== confirmPassword}
          onClick={handleUpdate}
        >
          {t('Admin.security.resetPasswordScreen.button', 'Update Password')}
        </Button>
      </div>
    </div>
  );
};
