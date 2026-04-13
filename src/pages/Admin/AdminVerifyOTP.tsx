import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Shield, RotateCcw, AlertCircle } from 'lucide-react';

export const AdminVerifyOTP = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { type, value } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError(t('AdminVerifyOTP.invalid', 'Please enter all 6 digits'));
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/reset-password', { state: { type, value, verified: true } });
    }, 1500);
  };

  const handleResend = () => {
    setResendTimer(60);
    // Simulate resend API call
  };

  if (!type || !value) {
    return (
      <div className="page-wrapper">
        <div className="text-center">
          <p className="text-gray-400">{t('AdminVerifyOTP.invalidAccess', 'Invalid access')}</p>
          <Button variant="glass" onClick={() => navigate('/admin')} className="mt-4">
            {t('Common.back', 'Back to Admin')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.verifyOTP', 'Verify OTP')}
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
          <Shield size={28} className="text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {t('AdminVerifyOTP.title', 'Enter Verification Code')}
        </h2>
        <p className="text-sm text-gray-400">
          {t('AdminVerifyOTP.sentTo', 'Code sent to')}{' '}
          <span className="text-white font-medium">{value}</span>
        </p>
      </div>

      <GlassCard className="mb-6">
        <div className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:border-accent/50 focus:outline-none transition-colors"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-error text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-500">
                {t('AdminVerifyOTP.resendIn', 'Resend in')} {resendTimer}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-accent hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <RotateCcw size={14} />
                {t('AdminVerifyOTP.resend', 'Resend code')}
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        {t('AdminVerifyOTP.verify', 'Verify')}
      </Button>
    </div>
  );
};
