import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import { useDispatch } from 'react-redux';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import apiInstance, { setTokens } from '../../api/apiInstance';
import { useRoles } from '../../api/hooks/useRoles';
import { setUser, setIsVenter } from '../../store/slices/userSlice';
import { toastError } from '../../utils/toast';
import { Check, RotateCcw } from 'lucide-react';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';

export const SubscriptionSuccessScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { updateAvailableRoles, switchRole } = useRoles();
  const { isAccountChanging } = useAccountChangeFlow();

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [fullPlan, setFullPlan] = useState<any>(null);
  
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both the active sub and all plans to get the deep details
      const [walletRes, plansRes]: any = await Promise.all([
        apiInstance.get('wallet/subscription'),
        apiInstance.get('payments/subscription-plans')
      ]);

      if (walletRes?.data?.subscription) {
        const sub = walletRes.data.subscription;
        setActiveSub(sub);
        
        if (plansRes?.data?.plans) {
          // Attempt to find the specific plan to pull rich details (e.g. overage rates, messages)
          // The API sometimes returns planId in subscription, or matches by planName
          const matchedPlan = plansRes.data.plans.find((p: any) => 
             p.id === sub.planId || p.name.toLowerCase() === sub.planName?.toLowerCase()
          );
          setFullPlan(matchedPlan || sub); // fallback to sub if no exact plan match
        } else {
            setFullPlan(sub);
        }
      } else {
        // If they somehow got here without a sub, back to choose plan
        navigate('/signup/choose-plan', { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLetsStart = async () => {
    const searchParams = new URLSearchParams(location.search);
    const legacyAccountTypeChanging = searchParams.get('accountTypeChanging') === 'true';
    const effectiveChanging = isAccountChanging || legacyAccountTypeChanging;

    if (effectiveChanging) {
      setLoading(true); // Re-use the spinner
      try {
        const response = await updateAvailableRoles({ rolesToAdd: ['venter'], rolesToRemove: [] });
        if (response) {
          const switchRes = await switchRole({ targetRole: 'venter' });
          if (switchRes && switchRes.tokens) {
            await setTokens(switchRes.tokens.accessToken, switchRes.tokens.refreshToken);
            if (switchRes.user) {
              const reduxUser = {
                ...switchRes.user,
                role: switchRes.user.activeRole?.toLowerCase() || 'venter'
              };
              dispatch(setUser(reduxUser as any));
              dispatch(setIsVenter(true));
            }
          }
        }
      } catch (err) {
        console.error('Failed to update roles for accountTypeChanging:', err);
      }
    }
    
    navigate('/venter/home', { replace: true });
  };

  const handleCancelSubscription = () => {
    setShowConfirmCancel(true);
  };

  const handleConfirmCancel = async () => {
    setShowConfirmCancel(false);
    setCancelling(true);
    try {
      const res: any = await apiInstance.post('payments/cancel-subscription');
      if (res.success || res.status === 200) {
          setCancelled(true);
      }
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toastError(error?.message || t('Common.error.somethingWentWrong', 'Something went wrong.'));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
      return (
          <AuthLayout>
              <div className="flex justify-center items-center h-full pt-10">
                  <div className="w-8 h-8 max-w-sm rounded-full border-t-2 border-white animate-spin"></div>
              </div>
          </AuthLayout>
      )
  }

  // Same specific logic as Native to map the translation keys properly
  const planTypeNameObj = activeSub?.planName || fullPlan?.name || '';
  const planTypeStr = planTypeNameObj.toLowerCase();
  
  const planType = planTypeStr.includes('standard') ? 'standard' :
                   planTypeStr.includes('pay as you go') ? 'payAsYouGo' :
                   planTypeStr.includes('free') ? 'free' : 'basic';

  // To support static translation map if the plan exists in standard maps
  const planInfoDescKey = `BasicPlanDetails.${planType}.description`;
  const defaultDesc = t(planInfoDescKey, t('SubscriptionSuccess.subtitle', 'Access premium features'));

  const renewalDate = activeSub?.currentPeriodEnd 
    ? new Date(activeSub.currentPeriodEnd).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AuthLayout>
      <div className="flex flex-col text-center w-full max-w-[400px] mx-auto py-6 relative">
          
        {/* Checkmark Circle Matches Native completely */}
        <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-lg">
            <Check size={32} className="text-white" strokeWidth={3} />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-xl font-bold text-white mb-2 tracking-wide">
          {t('SubscriptionSuccess.title', 'You\'re Subscribed!')}
        </h1>
        <p className="text-[15px] text-white/90 mb-8 max-w-[280px] mx-auto">
          {fullPlan?.description || (defaultDesc !== planInfoDescKey ? defaultDesc : 'Access premium features')}
        </p>

        {/* Full Benefits Glass Card Replicating Native exactly */}
        <GlassCard className="p-5 text-left mb-6 bg-white/[0.02] border-white/15" rounded="2xl">
            <h3 className="text-white font-semibold text-[15px] mb-4">
                {t('SubscriptionSuccess.benefitsTitle', 'Includes')}
            </h3>

            {/* Included Minutes */}
            {fullPlan?.included_minutes > 0 ? (
                <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white bg-primary stroke-[4px]" />
                    </div>
                    <p className="text-[15px] text-white/90 leading-snug">
                        {fullPlan.included_minutes} {t('BasicPlanDetails.minutes', 'mins')} {t('BasicPlanDetails.included', 'included')}
                    </p>
                </div>
            ) : activeSub?.includedMinutes > 0 && (
                <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white stroke-[4px]" />
                    </div>
                    <p className="text-[15px] text-white/90 leading-snug">
                        {activeSub.includedMinutes} {t('BasicPlanDetails.minutes', 'mins')} {t('BasicPlanDetails.included', 'included')}
                    </p>
                </div>
            )}

            {/* Overage Rate */}
            {fullPlan?.overage_rate > 0 && (
                <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white stroke-[4px]" />
                    </div>
                    <p className="text-[15px] text-white/90 leading-snug">
                        ${fullPlan.overage_rate} / {t('BasicPlanDetails.voiceMinute', 'voice minute')}
                    </p>
                </div>
            )}

            {/* Pay As You Go Note */}
            {planType === 'payAsYouGo' && (
                <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white stroke-[4px]" />
                    </div>
                    <p className="text-[15px] text-white/90 leading-snug">
                        {t('BasicPlanDetails.noSubscriptionRequired', 'No subscription required')}
                    </p>
                </div>
            )}

            {/* Tech Features */}
            {(fullPlan?.features?.features || (Array.isArray(fullPlan?.features) ? fullPlan?.features : []))?.map((featKey: string, i: number) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white stroke-[4px]" />
                    </div>
                    <p className="text-[15px] text-white/90 leading-snug">
                        {t(`PlanFeatures.${featKey.toLowerCase()}`, featKey)}
                    </p>
                </div>
            ))}

            {/* Messages */}
            {fullPlan?.included_messages_monthly && (
                <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white stroke-[4px]" />
                    </div>
                    <p className="text-[15px] text-white/90 leading-snug">
                        {fullPlan.included_messages_monthly} {t('ChoosePlan.includedMessagesMonthly', 'messages included')}
                    </p>
                </div>
            )}
        </GlassCard>

        {/* Change Subscription Link */}
        <button 
           onClick={() => navigate('/signup/choose-plan')}
           className="flex items-center justify-center gap-2 mb-8 focus:outline-none opacity-90 hover:opacity-100 transition-opacity"
        >
            <RotateCcw size={16} className="text-white" />
            <span className="text-[14px] text-white">{t('SubscriptionSuccess.changeSubscription', 'Change Subscription')}</span>
        </button>

        {/* Action Button & Renewal Text */}
        <div className="mt-auto mb-6 flex flex-col items-center">
             <p className="text-[15px] text-white/80 mb-4">
               {planType === 'payAsYouGo' 
                 ? t('ChoosePlan.payAsYouGo', 'Pay As You Go') 
                 : t('SubscriptionSuccess.renewalDate', {
                     date: renewalDate,
                     defaultValue: `Your subscription renews on ${renewalDate}`,
                   })}
             </p>
             
             <button 
                onClick={handleLetsStart}
                className="w-full btn btn-primary h-[56px] flex items-center justify-center font-medium text-[16px] mb-6 rounded-2xl"
             >
                {t('SubscriptionSuccess.letsStart', 'Continue')}
             </button>

             {/* Cancel Subscription */}
             {!cancelled && planType !== 'payAsYouGo' && activeSub?.status !== 'cancelled' && (
                 <button 
                     onClick={handleCancelSubscription}
                     className="text-[14px] text-white/70 underline decoration-white/40 hover:text-white transition-colors"
                     disabled={cancelling}
                 >
                     {cancelling ? t('Common.loading', 'Loading...') : t('SubscriptionSuccess.cancelSubscription', 'Cancel Subscription')}
                 </button>
             )}
        </div>
      </div>

      {/* Basic Glass Modals handled locally for simplicity */}
      {showConfirmCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <GlassCard className="w-full max-w-[340px] p-6 text-center animate-fade-in" rounded="2xl" bordered>
                  <h3 className="text-xl font-bold text-white mb-3">{t('SubscriptionSuccess.cancelSubscription', 'Cancel Subscription')}</h3>
                  <p className="text-[15px] text-white/70 mb-8">{t('SubscriptionSuccess.cancelConfirmationMessage', 'Are you sure you want to cancel your subscription?')}</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={handleConfirmCancel} className="btn bg-white/10 hover:bg-white/20 text-white w-full py-3.5 rounded-xl border border-white/20">
                          {t('Common.yes', 'Yes')}
                      </button>
                      <button onClick={() => setShowConfirmCancel(false)} className="btn btn-primary w-full py-3.5 rounded-xl">
                          {t('Common.no', 'No')}
                      </button>
                  </div>
              </GlassCard>
          </div>
      )}

      {cancelled && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <GlassCard className="w-full max-w-[340px] p-6 text-center animate-fade-in" rounded="2xl" bordered>
                  <div className="mx-auto w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                      <Check size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                      {t('SubscriptionDetails.cancelled', 'Subscription Cancelled')}
                  </h3>
                  <p className="text-[15px] text-white/70 mb-8">
                      {t('SubscriptionDetails.cancelledMessage', 'Your subscription cancelled successfully.')}
                  </p>
                  <button onClick={() => setCancelled(false)} className="btn btn-primary w-full py-3.5 rounded-xl">
                      {t('Common.continue', 'Continue')}
                  </button>
              </GlassCard>
          </div>
      )}
    </AuthLayout>
  );
};
