import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { requestPasswordReset } from '../../api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ResetPasswordWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = emailOrPhone.trim();
    if (!trimmed) {
      setError(t('ResetPassword.subtitle'));
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setError(t('ForgotPasswordWeb.emailOnlyHint'));
      return;
    }

    setLoading(true);
    const res = await requestPasswordReset(trimmed);
    setLoading(false);
    if (res.success) {
      navigate('/forgot-password/verify-email', { state: { email: trimmed } });
    } else {
      setError(res.error || 'Failed to send code');
      if (import.meta.env.DEV) {
        navigate('/forgot-password/verify-email', { state: { email: trimmed } });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-slide-up relative">
        <button 
          onClick={() => navigate('/login')}
          className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> {t('Common.back', 'Back')}
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">{t('ResetPassword.title')}</h2>
        <p className="text-sm text-gray-500 mb-8">{t('ResetPassword.subtitle')}</p>

        <form onSubmit={handleSend} className="space-y-4">
          <Input
            label={t('LogIn.emailOrPhone')}
            type="email"
            placeholder={t('SignUp.emailOrPhone')}
            value={emailOrPhone}
            onChange={(e) => { setEmailOrPhone(e.target.value); setError(''); }}
            error={error}
            leftIcon={<Mail size={16} />}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} loading={loading}>
            {t('ResetPassword.sendOTP')}
          </Button>
        </form>
      </div>
    </div>
  );
};
