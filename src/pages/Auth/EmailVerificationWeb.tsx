import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { AuthStepHeader } from '../../components/Auth/AuthStepHeader';

export const EmailVerificationWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleDigit = (index: number, value: string) => {
    const d = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = d;
    setCode(next);
    if (d && index < 3) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`);
      el?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.join('');
    if (otp.length !== 4) return;
    setLoading(true);
    navigate('/forgot-password/new-password', { state: { email, code: otp } });
    setLoading(false);
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout>
      <AuthStepHeader backTo="/forgot-password" />
      <div
        style={{
          padding: '20px 8px',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border)',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-pure)', textAlign: 'center', margin: '0 0 8px' }}>
          {t('EmailVerification.title')}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-dim)', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.5 }}>
          {t('EmailVerification.subtitle')}
          <br />
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{email}</span>
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {code.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: '52px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 600,
                  borderRadius: '14px',
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0 }}>
            {t('EmailVerification.didntReceive')}{' '}
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-pure)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
              {t('EmailVerification.resend')}
            </button>
          </p>
          <button type="submit" className="btn-primary" disabled={loading || code.join('').length !== 4} style={{ width: '100%', height: '52px', borderRadius: '16px', justifyContent: 'center' }}>
            {t('EmailVerification.verifyAccount')}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
