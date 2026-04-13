import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
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
      if ((response as any).success !== false) {
        navigate('/signup/nickname');
      } else {
        setError((response as any)?.message || (response as any)?.error || t('Common.error') || 'Verification failed');
      }
    } catch (err: any) {
      setError(err?.error || t('Common.error') || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email address is missing. Please restart signup.');
      return;
    }
    setResendLoading(true);
    setError('');
    try {
      await resendVerificationEmail(email);
    } catch (err: any) {
      setError(err?.error || 'Could not resend');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container py-8">
      <div className="auth-card animate-slide-up w-full max-w-md">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white mb-2">
            {t('EmailVerification.title')}
          </h1>
          <p className="text-sm text-gray-400">
            {t('EmailVerification.subtitle')} {email ? <span className="text-primary">{email}</span> : null}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <OTPInput value={code} onChange={setCode} cellCount={4} />

          {error ? <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2 text-center">{error}</p> : null}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              {t('EmailVerification.didntReceive')}{' '}
              <button type="button" disabled={resendLoading} onClick={handleResend} className="text-primary hover:text-primary-hover font-medium transition-colors">
                {t('EmailVerification.resend')}
              </button>
            </p>
          </div>

          <Button 
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            loading={loading}
            disabled={code.length !== 4}
          >
            {t('EmailVerification.verifyAccount')}
          </Button>
        </form>
      </div>
    </div>
  );
};
