import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { AuthStepHeader } from '../../components/Auth/AuthStepHeader';
import { PasswordField } from '../../components/Auth/PasswordField';
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
    <AuthLayout>
      <AuthStepHeader backTo="/forgot-password/verify-email" />
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          className="flex-center"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            margin: '0 auto 16px',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '12px',
          }}
        >
          <img src={chatIcon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-pure)', margin: 0 }}>{t('CreateNewPassword.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <PasswordField
          label={t('CreateNewPassword.newPassword')}
          placeholder={t('CreateNewPassword.newPassword')}
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          hint={t('CreateNewPassword.passwordHint')}
        />
        <PasswordField
          label={t('CreateNewPassword.confirmPassword')}
          placeholder={t('CreateNewPassword.confirmPassword')}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
        {error ? <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p> : null}
        <button type="submit" className="btn-primary" disabled={loading} style={{ height: '56px', borderRadius: '16px', justifyContent: 'center', marginTop: '8px' }}>
          {loading ? '…' : t('CreateNewPassword.update')}
        </button>
      </form>
    </AuthLayout>
  );
};
