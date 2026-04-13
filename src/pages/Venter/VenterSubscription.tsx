import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useWallet } from '../../api/hooks/useWallet';
import { CheckCircle, Crown } from 'lucide-react';

export const VenterSubscription = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getMySubscription, getSubscriptionPlans, createSubscription } = useWallet();
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [subRes, plansRes] = await Promise.allSettled([getMySubscription(), getSubscriptionPlans()]);
        if (subRes.status === 'fulfilled') setSubscription(subRes.value?.subscription);
        if (plansRes.status === 'fulfilled') setPlans(plansRes.value?.plans ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubscribe = async (planId: string) => {
    try {
      const res = await createSubscription(planId);
      if (res?.checkoutUrl) window.location.href = res.checkoutUrl;
    } catch { /* ignore */ }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('VenterMySubscription.title')} />

      {/* Current Plan */}
      {subscription && (
        <GlassCard bordered accent>
          <div className="flex items-center gap-3 mb-2">
            <Crown size={20} className="text-accent" />
            <p className="text-base font-bold text-white">{t('VenterMySubscription.currentBilling')}: {subscription.planName}</p>
          </div>
          <Badge variant="success" dot>Active</Badge>
          <p className="text-xs text-gray-500 mt-2">
            {t('VenterMySubscription.endsIn')}: {new Date(subscription.renewalDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
          </p>
        </GlassCard>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="section-title mb-3">Available Plans</h2>
        {loading ? (
          <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}</div>
        ) : plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan: any) => {
              const isActive = subscription?.planId === plan.id;
              return (
                <GlassCard key={plan.id} bordered={isActive} className={isActive ? 'border-accent/40' : ''}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-white">{plan.name}</p>
                      <p className="text-xl font-bold text-white mt-1">
                        ${plan.price}<span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                      </p>
                    </div>
                    {isActive ? (
                      <Badge variant="success"><CheckCircle size={10} className="mr-1" />Current</Badge>
                    ) : (
                      <Badge variant="default">{plan.interval}</Badge>
                    )}
                  </div>
                  {plan.features && (
                    <ul className="space-y-1.5 mb-4">
                      {plan.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <CheckCircle size={12} className="text-success flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isActive && (
                    <Button variant="primary" fullWidth onClick={() => handleSubscribe(plan.id)}>
                      Subscribe
                    </Button>
                  )}
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard>
            <p className="text-sm text-gray-500 text-center">{t('ChoosePlan.noPlansDescription')}</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
