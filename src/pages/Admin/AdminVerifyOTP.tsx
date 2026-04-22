import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { OTPInput } from '../../components/Shared/OTPInput';
import { useCredentialsChange } from '../../api/hooks/useCredentialsChange';
import { toast } from 'react-toastify';

export const AdminVerifyOTP = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { type, value } = (location.state as any) || { type: 'email', value: '' };

  const { verifyEmailChangeOTP, requestEmailChangeOTP } = useCredentialsChange();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 4) return;
    
    setLoading(true);
    try {
      if (type === 'email') {
        await verifyEmailChangeOTP(value, otp);
      }
      
      // Navigate to success
      navigate('/admin/security-success', {
        state: {
          type: 'email',
          title: t('Admin.security.success.emailChanged', 'Email Changed Successfully'),
          subtitle: t('Admin.security.success.emailSubtitle', 'Your account email has been updated. You can now use your new email to log in.')
        }
      });
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error?.error || t('Common.error', 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      if (type === 'email') {
        await requestEmailChangeOTP(value);
      }
      toast.success(t('Admin.security.verification.resendSuccess', 'Code resent successfully!'));
    } catch (error: any) {
      toast.error(t('Common.error', 'Failed to resend code.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-full">
      <PageHeader 
        title={type === 'email' 
          ? t('Admin.security.verification.emailTitle', 'Verify Email') 
          : t('Admin.security.verification.phoneTitle', 'Verify Phone')} 
        subtitle={type === 'email' 
          ? t('Admin.security.verification.emailSubtitle', 'Check your inbox for a 4-digit code.') 
          : t('Admin.security.verification.phoneSubtitle', 'Check your messages for a 4-digit code.')}
        onBack={() => navigate(-1)} 
        centered
      />

      <div className="flex-1 px-4 pt-10 text-center">
        <p className="text-sm text-white font-bold mb-12 px-6">
          {value}
        </p>

        <div className="flex justify-center mb-8">
          <OTPInput 
            value={otp} 
            onChange={setOtp} 
            cellCount={4} 
          />
        </div>

        <button 
          onClick={handleResend}
          disabled={resending}
          className="text-sm font-medium text-white underline decoration-white/30 disabled:opacity-50"
        >
          {resending ? t('Common.sending', 'Sending...') : (
            <>
              {t('Admin.security.verification.didntReceive', "Didn't receive code?")}{' '}
              <span className="font-bold">{t('Admin.security.verification.resend', 'Resend')}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 pt-10">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          className="rounded-full h-14 font-bold"
          disabled={otp.length < 4 || loading}
          loading={loading}
          onClick={handleVerify}
        >
          {t('Admin.security.verification.button', 'Verify')}
        </Button>
      </div>
    </div>
  );
};
