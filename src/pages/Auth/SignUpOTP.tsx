import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { OTPInput } from '../../components/Shared/OTPInput';
import { ArrowLeft } from 'lucide-react';

export const SignUpOTP = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const email = (location.state as any)?.email || 'your email';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      navigate('/signup/nickname');
    }
  };

  return (
    <AuthLayout>
      <button 
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
          {t('EmailVerification.subtitle', { email })}
        </p>
      </div>

      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <OTPInput value={code} onChange={setCode} cellCount={4} />

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
            {t('EmailVerification.didntReceive')}{' '}
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-pure)', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}>
              {t('EmailVerification.resend')}
            </button>
          </p>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
          disabled={code.length !== 4}
        >
          {t('EmailVerification.verifyAccount')}
        </button>
      </form>
    </AuthLayout>
  );
};
