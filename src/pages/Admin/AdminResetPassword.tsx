import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { verified } = location.state || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError(t('AdminResetPassword.tooShort', 'Password must be at least 8 characters'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('AdminResetPassword.noMatch', 'Passwords do not match'));
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (!verified) {
    return (
      <div className="page-wrapper">
        <div className="text-center">
          <p className="text-gray-400">{t('AdminResetPassword.verifyFirst', 'Please verify your identity first')}</p>
          <Button variant="glass" onClick={() => navigate('/admin/change-email')} className="mt-4">
            {t('Common.back', 'Go Back')}
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('AdminResetPassword.success', 'Password Updated')}
          </h2>
          <p className="text-gray-400 mb-8">
            {t('AdminResetPassword.successDesc', 'Your password has been successfully changed')}
          </p>
          <Button variant="primary" onClick={() => navigate('/admin')}>
            {t('Common.done', 'Done')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.resetPassword', 'Reset Password')}
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
          <Lock size={28} className="text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {t('AdminResetPassword.title', 'Set New Password')}
        </h2>
        <p className="text-sm text-gray-400">
          {t('AdminResetPassword.desc', 'Create a strong password for your admin account')}
        </p>
      </div>

      <GlassCard className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('AdminResetPassword.newPassword', 'New Password')}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('AdminResetPassword.hint', 'At least 8 characters')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('AdminResetPassword.confirmPassword', 'Confirm Password')}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        {t('AdminResetPassword.update', 'Update Password')}
      </Button>
    </div>
  );
};
