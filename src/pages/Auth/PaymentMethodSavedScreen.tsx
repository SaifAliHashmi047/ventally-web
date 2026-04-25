import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';

export const PaymentMethodSavedScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAccountChanging, resolve } = useAccountChangeFlow();

  const content = (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="w-20 h-20 rounded-full bg-success/20 flex flex-col items-center justify-center mb-6 shadow-[0_0_40px_rgba(50,215,75,0.2)]">
        <CheckCircle2 size={40} className="text-success" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-4">
        {t('Payment.savedSuccess', 'Payment Method Saved!')}
      </h1>

      <p className="text-base text-gray-400 leading-relaxed mb-10 max-w-sm">
        {t('Payment.savedDesc', 'Your payment method has been securely added to your account. You can now proceed to subscribe.')}
      </p>

      <Button variant="primary" fullWidth onClick={() => navigate(resolve('success'))}>
        {t('Common.continue', 'Continue')}
      </Button>
    </div>
  );

  if (isAccountChanging) {
    return <div className="page-wrapper animate-fade-in">{content}</div>;
  }
  return <AuthLayout>{content}</AuthLayout>;
};
