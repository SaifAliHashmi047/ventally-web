import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

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
    <div className="auth-container">
      <div className="auth-card animate-slide-up relative text-center">
        <button 
          onClick={() => navigate('/forgot-password')}
          className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 transition-colors absolute top-0 left-0"
        >
          <ArrowLeft size={20} /> {t('Common.back', 'Back')}
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 mt-10">{t('EmailVerification.title')}</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {t('EmailVerification.subtitle')}
          <br />
          <span className="text-gray-300 font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex gap-3 justify-center mb-6">
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
                className="w-14 h-14 text-center text-xl font-bold rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:bg-white/10 transition-colors outline-none"
              />
            ))}
          </div>
          
          <p className="text-sm text-gray-500">
            {t('EmailVerification.didntReceive')}{' '}
            <button type="button" className="text-white hover:text-primary transition-colors font-semibold underline">
              {t('EmailVerification.resend')}
            </button>
          </p>
          
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading || code.join('').length !== 4}>
            {t('EmailVerification.verifyAccount')}
          </Button>
        </form>
      </div>
    </div>
  );
};
