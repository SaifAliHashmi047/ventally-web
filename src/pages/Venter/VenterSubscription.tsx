import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useWallet } from '../../api/hooks/useWallet';
import { CheckCircle, ChevronRight, Crown } from 'lucide-react';

export const VenterSubscription = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getMySubscription } = useWallet();
  const [subData, setSubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMySubscription();
        if (res) setSubData(res);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChoosePlan = () => {
    navigate('/venter/subscription/plans');
  };

  const handleSubscriptionDetails = () => {
    navigate('/venter/subscription/details');
  };

  const subscription = subData?.subscription;
  const planName = subData?.hasSubscription 
    ? (subscription?.planName || t('VenterMySubscription.planNameValue')) 
    : t('VenterMySubscription.planNameValue');

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
      <PageHeader title={t('VenterMySubscription.title')} onBack={() => navigate(-1)} />

      <div className="flex-1">
        {loading ? (
          <div className="skeleton h-60 rounded-3xl" />
        ) : (
          <GlassCard bordered padding="lg" rounded="2xl" className="mt-2 text-left">
            <h2 className="text-lg font-semibold text-white mb-6">
              {t('VenterMySubscription.currentBilling')}
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-white/80">{t('VenterMySubscription.planName')}</span>
                <span className="text-sm font-medium text-white">
                  {planName}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-white/80">{t('VenterMySubscription.endsIn')}</span>
                <span className="text-sm font-medium text-white">
                  {subscription?.renewalDate || subscription?.billingCycleEnd
                    ? new Date(subscription.renewalDate || subscription.billingCycleEnd).toLocaleDateString('en-GB')
                    : t('VenterMySubscription.endsInValue')}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6">
              <h3 className="text-base font-semibold text-white mb-4">
                {t('VenterMySubscription.manage')}
              </h3>
              <div
                className="flex items-center justify-between py-2 cursor-pointer group"
                onClick={handleSubscriptionDetails}
              >
                <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                  {t('VenterMySubscription.subscription')}
                </span>
                <ChevronRight size={16} className="text-white group-hover:text-accent transition-colors" />
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      <div className="mt-auto pt-6 pb-4">
        <Button
          variant="primary"
          fullWidth
          onClick={handleChoosePlan}
          className="h-[56px] text-base font-bold"
        >
          {t('VenterMySubscription.choosePlan')}
        </Button>
      </div>
    </div>
  );
};
