import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';
import { Input } from '../../components/ui/Input';
import { GlassCard } from '../../components/ui/GlassCard';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import { ArrowLeft, ChevronRight, Loader2, Star } from 'lucide-react';

interface PlanOption {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  overageKey: string;
  messagesKey: string;
  monthlyPrice: number;
  annualPrice: number;
  isMostPopular: boolean;
  features?: any[];
}

export const ChoosePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.user.user);
  
  const { isAccountChanging, changeBasePath, resolve } = useAccountChangeFlow();
  const legacyAccountTypeChanging = (location.state as any)?.accountTypeChanging;
  const effectiveChanging = isAccountChanging || legacyAccountTypeChanging;

  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    checkExistingSubscription();
    fetchPlans();
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const res: any = await apiInstance.get('wallet/subscription');
      if (res.success && res.data?.subscription) {
        navigate(resolve('success'), { replace: true });
      }
    } catch (error) {
      // Expected if no subscription exists
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response: any = await apiInstance.get('payments/subscription-plans');
      if (response.success && response.data?.plans) {
        // Map API response matching Native exactly
        const mappedPlans = response.data.plans.map((p: any) => {
          const lower = p.name.toLowerCase();
          const isLightSupport    = lower.includes('light support');
          const isBalanced        = lower.includes('balanced support');
          const isHighSupport     = lower.includes('high support');
          const isConsistentCare  = lower.includes('consistent care');
          const isPayAsYouGo      = lower.includes('pay as you go');
          const isFree            = lower.includes('free trial') || lower.includes('free tier');

          return {
            id: p.id,
            name: p.name,
            nameKey: isLightSupport ? 'ChoosePlan.basicPlan' :
                     isBalanced ? 'ChoosePlan.standardPlan' :
                     isHighSupport ? 'ChoosePlan.highSupport' :
                     isConsistentCare ? 'ChoosePlan.consistentCare' :
                     isPayAsYouGo ? 'ChoosePlan.payAsYouGo' :
                     isFree ? 'ChoosePlan.freeTier' : '',
                     
            description: `${p.included_minutes} minutes included.`,
            descriptionKey: isLightSupport ? 'ChoosePlan.basicPlanDescription' :
                            isBalanced ? 'ChoosePlan.standardPlanDescription' :
                            isHighSupport ? 'ChoosePlan.highSupportDescription' :
                            isConsistentCare ? 'ChoosePlan.consistentCareDescription' :
                            isPayAsYouGo ? 'ChoosePlan.payAsYouGoDescription' :
                            isFree ? 'ChoosePlan.freeTierDescription' : '',
                            
            overageKey: isLightSupport ? 'ChoosePlan.basicPlanOverage' :
                        isBalanced ? 'ChoosePlan.standardPlanOverage' :
                        isHighSupport ? 'ChoosePlan.highSupportOverage' :
                        isConsistentCare ? 'ChoosePlan.consistentCareOverage' :
                        isFree ? 'ChoosePlan.freeTierOverage' : '',
                        
            messagesKey: isLightSupport ? 'ChoosePlan.basicPlanMessages' :
                         isBalanced ? 'ChoosePlan.standardPlanMessages' :
                         isHighSupport ? 'ChoosePlan.highSupportMessages' :
                         isConsistentCare ? 'ChoosePlan.consistentCareMessages' :
                         isFree ? 'ChoosePlan.freeTierMessages' : '',
                         
            monthlyPrice: Number(p.price_monthly) || 0,
            annualPrice: Number(p.annual_price) || 0,
            isMostPopular: p.display?.isMostPopular || false,
            features: p.features?.features || [],
          };
        });
        setPlans(mappedPlans);
      } else {
        toastError(t('ChoosePlan.fetchError', 'Failed to fetch plans'));
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toastError(t('ChoosePlan.fetchError', 'Failed to fetch plans'));
    } finally {
      setLoading(false);
    }
  };

  const isAdvancedPlan = (name: string) => {
    const lower = name.toLowerCase();
    return lower.includes('consistent care') || lower.includes('high support');
  };

  const isFreePlan = (p: PlanOption) => (Number(p.monthlyPrice) || 0) === 0;

  const visiblePlans = useMemo(() => {
    return (showAdvanced
      ? plans.filter(p => isAdvancedPlan(p.name))
      : plans.filter(p => !isAdvancedPlan(p.name))
    ).filter(p => planType === 'annual' ? !isFreePlan(p) : true);
  }, [plans, showAdvanced, planType]);

  const handleContinue = async () => {
    if (!selectedPlan) {
      toastError(t('ChoosePlan.selectPlan', 'Please select a plan'));
      return;
    }
    
    setCheckoutLoading(true);
    try {
      const successPath = effectiveChanging
        ? (changeBasePath ?? '/signup') + '/success'
        : '/signup/success';
      const cancelPath = effectiveChanging
        ? (changeBasePath ?? '/signup') + '/choose-plan'
        : '/signup/choose-plan';

      const res = await apiInstance.post('payments/create-subscription-checkout', {
        planId: selectedPlan,
        billingCycle: planType,
        successUrl: window.location.origin + successPath,
        cancelUrl: window.location.origin + cancelPath,
      });
      
      if (res.data?.url) {
        // Stripe Hosted Checkout redirection standard flow
        window.location.href = res.data?.url;
      } else {
        toastError(t('Common.error', 'Something went wrong processing payment.'));
      }
    } catch (err: any) {
      toastError(err?.message || err?.error || t('Common.error', 'Something went wrong.'));
      setCheckoutLoading(false);
    }
  };

  const planContent = (
    <>
      <button
        onClick={() => navigate(-1)}
        className="text-white/60 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">{t('ChoosePlan.title')}</h1>
      </div>

      {/* Toggle Monthly / Annual - Underline tabs */}
      <div className="flex mb-8 border-b border-white/10">
        <button
          onClick={() => setPlanType('monthly')}
          className={`pb-3 px-4 font-medium text-sm transition-all ${planType === 'monthly' ? 'text-white border-b-2 border-white -mb-px' : 'text-white/60 hover:text-white'}`}
        >
          {t('ChoosePlan.monthly')}
        </button>
        <button
          onClick={() => setPlanType('annual')}
          className={`pb-3 px-4 font-medium text-sm transition-all flex items-center gap-2 ${planType === 'annual' ? 'text-white border-b-2 border-white -mb-px' : 'text-white/60 hover:text-white'}`}
        >
          {t('ChoosePlan.annual')}
          <span className="bg-[#C2AEBF] text-black text-[10px] font-bold px-2 py-0.5 rounded">
            {t('ChoosePlan.savePercent')}
          </span>
        </button>
      </div>

      {/* Plan List */}
      <div className="flex flex-col gap-4 mb-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="skeleton h-32 rounded-2xl w-full" />
            <div className="skeleton h-32 rounded-2xl w-full" />
          </div>
        ) : visiblePlans.length === 0 ? (
          <GlassCard className="text-center py-12">
            <h3 className="text-white font-medium mb-2">{t('ChoosePlan.noPlans')}</h3>
            <p className="text-sm text-white/60">{t('ChoosePlan.noPlansDescription')}</p>
          </GlassCard>
        ) : (
          visiblePlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = planType === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            const priceText = price === 0 
              ? t('ChoosePlan.free') 
              : planType === 'monthly'
                ? `$${price.toFixed(2)}`
                : `$${price.toFixed(2)}`;
            
            return (
              <GlassCard
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-5 cursor-pointer transition-all border-2 ${isSelected ? 'border-white bg-white/10' : 'border-transparent'}`}
                hover
                rounded="2xl"
              >
                {plan.isMostPopular && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star size={14} className="text-white fill-[#C2AEBF]" />
                    <span className="bg-[#C2AEBF] px-2 py-0.5 rounded text-black font-medium text-xs">
                      {t('ChoosePlan.mostPopular')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-white mb-2">
                      {plan.nameKey ? t(plan.nameKey) : plan.name}
                    </h3>

                    {/* Price below name */}
                    {price > 0 && (
                      <p className="text-xl font-bold text-white mb-2">{priceText}</p>
                    )}

                    {/* Description Lines */}
                    <div className="space-y-0.5 text-white text-sm opacity-80">
                      {!!(plan.descriptionKey ? t(plan.descriptionKey) : plan.description) && (
                        <p>{plan.descriptionKey ? t(plan.descriptionKey) : plan.description}</p>
                      )}
                      {!!plan.overageKey && !!t(plan.overageKey) && (
                        <p>{t(plan.overageKey)}</p>
                      )}
                      {!!plan.messagesKey && !!t(plan.messagesKey) && (
                        <p>{t(plan.messagesKey)}</p>
                      )}
                    </div>
                  </div>

                  {/* Radio Button */}
                  <div className={`w-6 h-6 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-all ml-3 mt-1 ${isSelected ? 'border-white' : 'border-white/30'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Promo Code */}
      {!loading && (
        <div className="mb-6">
          <p className="text-sm font-medium text-white mb-3 pl-1">{t('ChoosePlan.promotions')}</p>
          <Input 
            placeholder={t('ChoosePlan.addPromoCode') || 'Add Promo Code'}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="rounded-full bg-transparent border border-white/20 px-5 text-white placeholder:text-white/60"
            containerClassName="!mb-0"
          />
        </div>
      )}

      {/* Advanced Toggle */}
      {!loading && plans.length > 0 && (
        <button 
          onClick={() => setShowAdvanced(prev => !prev)}
          className="flex items-center justify-center gap-2 w-full text-white/80 hover:text-white font-medium text-sm mb-6 transition-colors group py-2"
        >
          <span className="underline decoration-white/40 group-hover:decoration-white/80 decoration-1 underline-offset-4">
            {showAdvanced ? t('ChoosePlan.seeBasicPlans') : t('ChoosePlan.seeAdvancedPlans')}
          </span>
          <ChevronRight size={16} className={`transition-transform duration-300 ${showAdvanced ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      )}

      {/* Continue */}
      <button 
        onClick={handleContinue}
        disabled={!selectedPlan || checkoutLoading || loading}
        className="btn btn-primary w-full h-[56px] flex items-center justify-center gap-2"
      >
        {checkoutLoading ? <Loader2 size={24} className="animate-spin" /> : t('ChoosePlan.continue')}
      </button>
    </>
  );

  if (effectiveChanging) {
    return <div className="page-wrapper page-wrapper--wide animate-fade-in">{planContent}</div>;
  }
  return <AuthLayout>{planContent}</AuthLayout>;
};
