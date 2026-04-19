import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import { ChevronRight, Loader2, Star } from 'lucide-react';

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

export const VenterChoosePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response: any = await apiInstance.get('payments/subscription-plans');
      if (response.success && response.data?.plans) {
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
        toastError(t('ChoosePlan.fetchError'));
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toastError(t('ChoosePlan.fetchError'));
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
      toastError(t('ChoosePlan.selectPlan'));
      return;
    }
    
    setCheckoutLoading(true);
    try {
      const res = await apiInstance.post('payments/create-subscription-checkout', {
        planId: selectedPlan,
        billingCycle: planType,
        successUrl: window.location.origin + '/venter/subscription',
        cancelUrl: window.location.origin + '/venter/subscription/plans'
      });
      
      if (res.data?.url) {
        window.location.href = res.data?.url;
      } else {
        toastError(t('Common.error'));
      }
    } catch (err: any) {
      toastError(err?.message || err?.error || t('Common.error'));
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in flex flex-col min-h-[calc(100vh-100px)]">
      <PageHeader title={t('ChoosePlan.title')} onBack={() => navigate(-1)} />

      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Toggle Monthly / Annual */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-black/20 rounded-xl border border-white/10 w-full">
            <button 
              onClick={() => setPlanType('monthly')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all text-center ${planType === 'monthly' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              {t('ChoosePlan.monthly')}
            </button>
            <button 
              onClick={() => setPlanType('annual')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${planType === 'annual' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              {t('ChoosePlan.annual')}
              <span className="bg-[#C2AEBF] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                {t('ChoosePlan.savePercent')}
              </span>
            </button>
          </div>
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
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star size={14} className="text-[#C2AEBF] fill-[#C2AEBF]" />
                      <span className="bg-[#C2AEBF] px-2 py-0.5 rounded text-black font-medium text-xs">
                        {t('ChoosePlan.mostPopular')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-4">
                      <h3 className="text-[16px] font-semibold text-white mb-1">
                        {plan.nameKey ? t(plan.nameKey) : plan.name}
                      </h3>
                      
                      <div className="space-y-0.5 opacity-80 text-white/70 text-sm">
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
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-white' : 'border-white/30'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      {price > 0 && (
                        <div className="text-right mt-1">
                          <p className="text-[20px] font-bold text-white">{priceText}</p>
                        </div>
                      )}
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
      </div>

      {/* Continue */}
      <div className="mt-auto pt-6 pb-4 max-w-2xl mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!selectedPlan || checkoutLoading || loading}
          className="btn btn-primary w-full h-[56px] flex items-center justify-center gap-2 text-base font-bold"
        >
          {checkoutLoading ? <Loader2 size={24} className="animate-spin" /> : t('ChoosePlan.continue')}
        </button>
      </div>
    </div>
  );
};
