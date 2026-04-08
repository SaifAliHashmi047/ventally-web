import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { OTPInput } from '../../components/Shared/OTPInput';
import { ArrowLeft } from 'lucide-react';
import { verifyEmail, resendVerificationEmail } from '../../api';

export const SignUpOTP = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const email = (location.state as { email?: string })?.email || '';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4 || !email) return;
    setError('');
    setLoading(true);
    try {
      const response = await verifyEmail(email, code);
      if (response.success) {
        navigate('/signup/nickname');
      } else {
        setError((response as { error?: string }).error || t('Common.error') || 'Verification failed');
      }
    } catch (err: unknown) {
      const er = err as { error?: string };
      setError(er?.error || t('Common.error') || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setError('');
    try {
      await resendVerificationEmail(email);
    } catch (err: unknown) {
      const er = err as { error?: string };
      setError(er?.error || 'Could not resend');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <button 
        type="button"
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '12px' }}>
          {t('EmailVerification.title')}
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: '1.5' }}>
          {t('EmailVerification.subtitle')} {email ? <span style={{ color: 'var(--text-main)' }}>{email}</span> : null}
        </p>
      </div>

      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <OTPInput value={code} onChange={setCode} cellCount={4} />

        {error ? <p style={{ color: '#f87171', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p> : null}

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
            {t('EmailVerification.didntReceive')}{' '}
            <button type="button" disabled={resendLoading} onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--text-pure)', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}>
              {t('EmailVerification.resend')}
            </button>
          </p>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
          disabled={code.length !== 4 || loading}
        >
          {loading ? '…' : t('EmailVerification.verifyAccount')}
        </button>
      </form>
    </AuthLayout>
  );
};
