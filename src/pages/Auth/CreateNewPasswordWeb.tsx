import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';
import { resetPasswordWithOtp } from '../../api';
import chatIcon from '../../assets/icons/chat.png';

const validateStrongPassword = (pwd: string): string | null => {
  if (!pwd?.trim()) return 'Password is required';
  if (pwd.length < 8) return 'Password must be at least 8 characters long';
  if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(pwd)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) return 'Password must contain at least one special character';
  return null;
};

export const CreateNewPasswordWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { email?: string; code?: string }) || {};
  const email = state.email ?? '';
  const code = state.code ?? '';

  useEffect(() => {
    if (!email || !code) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, code, navigate]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const strongErr = validateStrongPassword(newPassword);
    if (strongErr) {
      setError(strongErr);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await resetPasswordWithOtp({ email, otp: code, newPassword });
    setLoading(false);
    if (res.success) {
      navigate('/forgot-password/done');
    } else {
      setError(res.error || 'Failed to update password');
      if (import.meta.env.DEV) {
        navigate('/forgot-password/done');
      }
    }
  };

  if (!email || !code) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-slide-up relative">
        <button 
          onClick={() => navigate('/forgot-password/verify-email', { state })}
          className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> {t('Common.back', 'Back')}
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 p-3 shadow-sm">
            <img src={chatIcon} alt="" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('CreateNewPassword.title')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('CreateNewPassword.newPassword')}
            isPassword
            placeholder={t('CreateNewPassword.newPassword')}
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
            error={error && error !== 'Passwords do not match' ? error : undefined}
            leftIcon={<Lock size={16} />}
          />
          <Input
            label={t('CreateNewPassword.confirmPassword')}
            isPassword
            placeholder={t('CreateNewPassword.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            error={error === 'Passwords do not match' ? error : undefined}
            leftIcon={<Lock size={16} />}
          />
          
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} loading={loading}>
            {t('CreateNewPassword.update')}
          </Button>
        </form>
      </div>
    </div>
  );
};
