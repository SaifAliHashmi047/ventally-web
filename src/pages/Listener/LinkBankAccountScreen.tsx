import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Building } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';

export const LinkBankAccountScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const res = await apiInstance.post('earnings/bank-account/link', {
        platform: 'web',
        returnUrl: `${window.location.origin}/listener/payout`,
        refreshUrl: `${window.location.origin}/listener/bank-account`,
      });
      const url = res.data?.bankLink?.onboardingUrl;
      if (url) {
        window.location.href = url;
      } else {
        toastError('Could not get onboarding link. Please try again.');
      }
    } catch (e: any) {
      toastError(e?.response?.data?.message || e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
      <PageHeader
        title=""
        onBack={() => navigate(-1)}
      />

      <div className="w-full max-w-sm">
        <GlassCard bordered className="flex flex-col items-center text-center p-8">
          {/* Bank icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Building size={32} className="text-white" />
          </div>

          <h2 className="text-lg font-semibold text-white mb-6">
            {t('Listener.linkBank.title', 'Link Bank Account')}
          </h2>

          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={handleContinue}
            className="h-14 rounded-full font-semibold mb-4"
          >
            {t('Common.continue', 'Continue')}
          </Button>

          <p className="text-xs text-white/40 leading-relaxed">
            {t('Listener.linkBank.footer', 'You will be redirected to Stripe to securely link your bank account. This process is encrypted and safe.')}
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
