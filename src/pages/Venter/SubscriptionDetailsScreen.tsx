import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';

export const SubscriptionDetailsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await apiInstance.get('wallet/subscription');
        if (res.data) setSub(res.data);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, []);

  const handleCancel = async () => {
    try {
      await apiInstance.post(`payments/cancel-subscription`);
      toastSuccess(t('SubscriptionDetails.cancelSuccess'));
      navigate(-1);
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('SubscriptionDetails.title', 'Subscription Details')} onBack={() => navigate(-1)} />

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-32 rounded-3xl" />
          <div className="skeleton h-20 rounded-3xl" />
        </div>
      ) : sub ? (
        <div className="space-y-4">
          <GlassCard className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success/20 flex flex-col items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-success" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{sub.plan?.name || 'Premium Plan'}</h2>
            <p className="text-success font-medium mb-1">{t('SubscriptionDetails.statusActive', 'Active')}</p>
            <p className="text-sm text-gray-400">
              {t('SubscriptionDetails.renewsOn', 'Renews on')} {new Date(sub.current_period_end * 1000).toLocaleDateString()}
            </p>
          </GlassCard>



          <div className="pt-6">
            <Button variant="danger" fullWidth onClick={handleCancel}>
              {t('SubscriptionDetails.cancelSub', 'Cancel Subscription')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-error/20 flex flex-col items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-error" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('SubscriptionDetails.noActive', 'No Active Subscription')}</h2>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/venter/subscription')}>
            {t('SubscriptionDetails.viewPlans', 'View Plans')}
          </Button>
        </div>
      )}
    </div>
  );
};
