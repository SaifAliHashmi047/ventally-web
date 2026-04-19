import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Lock,
  CheckCircle
} from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';
import { GlassModal } from '../../components/ui/GlassModal';

export const SubscriptionDetailsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await apiInstance.get('wallet/subscription');
      if (res.data) setSubscription(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await apiInstance.post('payments/cancel-subscription');
      setShowConfirmCancel(false);
      setShowCancelledModal(true);
      fetchSubscription(); // Refresh
    } catch (e: any) {
      toastError(e?.error || t('Common.error.somethingWentWrong'));
    } finally {
      setIsCancelling(false);
    }
  };

  const handleManage = () => {
    navigate('/venter/subscription/plans');
  };

  const sub = subscription?.subscription;
  const isActive = subscription?.hasSubscription;

  return (
    <div className="page-wrapper animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
      <PageHeader 
        title={t('SubscriptionDetails.title')} 
        onBack={() => navigate(-1)} 
      />

      <div className="flex-1 max-w-xl mx-auto w-full space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-48 rounded-3xl" />
            <div className="skeleton h-60 rounded-3xl" />
          </div>
        ) : (
          <>
            {/* Premium Header Card */}
            <GlassCard bordered padding="none" rounded="3xl" className="overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl glass-dark flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <div className="flex-1">
                    <h2 className="text-[17px] font-bold text-white">
                      {isActive 
                        ? (sub?.planName || t('SubscriptionDetails.premiumTitle')) 
                        : t('SubscriptionDetails.freePlan')}
                    </h2>
                    <p className="text-[15px] text-white/90">
                      {isActive 
                        ? t('SubscriptionDetails.premiumSubtitle') 
                        : t('SubscriptionDetails.upgradeMessage')}
                    </p>
                  </div>
                </div>

                <Button 
                  variant="glass-bordered" 
                  fullWidth 
                  onClick={handleManage}
                  className="rounded-full bg-white/5 border-white/5 text-[15px] font-medium h-[48px]"
                >
                  {t('SubscriptionDetails.manageSubscription')}
                </Button>
              </div>
            </GlassCard>

            {/* Details Section */}
            {isActive ? (
              <div className="space-y-4">
                <h3 className="text-[17px] font-semibold text-white px-1">
                  {t('SubscriptionDetails.detailsTitle')}
                </h3>
                
                <GlassCard bordered padding="lg" rounded="3xl">
                  <div className="space-y-6">
                    {/* Next Billing */}
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-white/90">
                        {t('SubscriptionDetails.nextBillingDate')}
                      </span>
                      <span className="text-[15px] font-medium text-white">
                        {sub?.billingCycleEnd 
                          ? new Date(sub.billingCycleEnd).toLocaleDateString() 
                          : '-'}
                      </span>
                    </div>

                    {/* Monthly Plan */}
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-white/90">
                        {t('SubscriptionDetails.monthlyPlan')}
                      </span>
                      <span className="text-[15px] font-medium text-white">
                        {sub?.monthlyPrice ? `$${sub.monthlyPrice}` : '-'}
                      </span>
                    </div>

                    {/* Minutes Used */}
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-white/90">
                        {t('SubscriptionDetails.fundsUsed')}
                      </span>
                      <span className="text-[15px] font-medium text-white">
                        {sub?.usedMinutes ? `${sub.usedMinutes} min` : '0 min'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ) : (
              /* No Active Subscription State */
              <GlassCard bordered padding="xl" rounded="3xl" className="text-center">
                <h3 className="text-[17px] font-bold text-white mb-2">
                  {t('SubscriptionDetails.noActiveSubscription')}
                </h3>
                <p className="text-[15px] text-white/70 mb-8 max-w-[280px] mx-auto">
                  {t('SubscriptionDetails.freePlanMessage')}
                </p>
                <Button variant="primary" fullWidth onClick={handleManage}>
                  {t('SubscriptionDetails.choosePlan')}
                </Button>
              </GlassCard>
            )}
          </>
        )}
      </div>

      {/* Cancel Button at bottom */}
      {!loading && isActive && (
        <div className="mt-auto pt-6 pb-4 max-w-xl mx-auto w-full">
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => setShowConfirmCancel(true)}
            className="h-[56px] text-base font-bold"
          >
            {t('SubscriptionDetails.cancelSubscription')}
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <GlassModal
        isOpen={showConfirmCancel}
        onClose={() => setShowConfirmCancel(false)}
        title={t('SubscriptionDetails.cancelSubscription')}
        description={t('SubscriptionDetails.cancelConfirmationMessage')}
        primaryAction={{
          label: t('Common.yes'),
          onClick: handleCancelSubscription,
          loading: isCancelling
        }}
        secondaryAction={{
          label: t('Common.no'),
          onClick: () => setShowConfirmCancel(false)
        }}
      />

      {/* Cancelled Success Modal */}
      <GlassModal
        isOpen={showCancelledModal}
        onClose={() => setShowCancelledModal(false)}
        title={t('SubscriptionDetails.cancelled')}
        description={t('SubscriptionDetails.cancelledMessage')}
        icon={<CheckCircle className="text-success" size={48} />}
        primaryAction={{
          label: t('Common.continue'),
          onClick: () => {
            setShowCancelledModal(false);
            navigate(-1);
          }
        }}
      />
    </div>
  );
};
