import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { AuthStepHeader } from '../../components/Auth/AuthStepHeader';
import { requestPasswordReset } from '../../api';

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
    <AuthLayout>
      <AuthStepHeader backTo="/login" />
      <div
        style={{
          padding: '20px 8px',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border)',
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-pure)',
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          {t('ResetPassword.title')}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-dim)', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.5 }}>
          {t('ResetPassword.subtitle')}
        </p>

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{t('LogIn.emailOrPhone')}</label>
            <input
              type="email"
              autoComplete="email"
              placeholder={t('SignUp.emailOrPhone')}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              style={{ width: '100%', height: '52px' }}
            />
          </div>
          {error ? (
            <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p>
          ) : null}
          <button type="submit" className="btn-primary" disabled={loading} style={{ height: '52px', borderRadius: '16px', justifyContent: 'center' }}>
            {loading ? '…' : t('ResetPassword.sendOTP')}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
