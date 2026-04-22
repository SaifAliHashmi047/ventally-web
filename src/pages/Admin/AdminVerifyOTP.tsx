import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import OTPInput from '../../components/Shared/OTPInput';

export const AdminVerifyOTP = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { type, value } = (location.state as any) || { type: 'email', value: '' };

  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    // Navigate to success
    navigate('/admin/security-success', {
      state: {
        type: 'email',
        title: t('Admin.security.success.emailChanged', 'Email Changed Successfully'),
        subtitle: t('Admin.security.success.emailSubtitle', 'Your account email has been updated. You can now use your new email to log in.')
      }
    });
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-full">
      <PageHeader 
        title="" 
        onBack={() => navigate(-1)} 
      />

      <div className="flex-1 px-4 pt-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          {type === 'email' 
            ? t('Admin.security.verification.emailTitle', 'Verify Email') 
            : t('Admin.security.verification.phoneTitle', 'Verify Phone')}
        </h1>
        <p className="text-sm text-white/40 mb-12 px-6">
          {type === 'email' 
            ? t('Admin.security.verification.emailSubtitle', 'Enter the 4-digit code sent to') 
            : t('Admin.security.verification.phoneSubtitle', 'Enter the 4-digit code sent to')}
          <span className="block font-bold text-white mt-1">{value}</span>
        </p>

        <div className="flex justify-center mb-8">
          <OTPInput 
            value={otp} 
            onChange={setOtp} 
            length={4} 
          />
        </div>

        <button className="text-sm font-medium text-white underline decoration-white/30">
          {t('Admin.security.verification.didntReceive', "Didn't receive code?")}{' '}
          <span className="font-bold">{t('Admin.security.verification.resend', 'Resend')}</span>
        </button>
      </div>

      <div className="p-4 pt-10">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          className="rounded-full h-14 font-bold"
          disabled={otp.length < 4}
          onClick={handleVerify}
        >
          {t('Admin.security.verification.button', 'Verify')}
        </Button>
      </div>
    </div>
  );
};
