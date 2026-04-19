import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { usePayments, type CreditPack } from '../../api/hooks/usePayments';
import { CreditCard, Check, ArrowRight, Loader2 } from 'lucide-react';
import { addBalance } from '../../store/slices/userSlice';
import type { RootState } from '../../store/store';
import { cn } from '../../utils/cn';
import { toastSuccess, toastError } from '../../utils/toast';

export const VenterAddFunds = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { getCreditPacks, createCheckoutSession, verifyCheckout } = usePayments();
  const sessionType = useSelector((state: RootState) => state.call.sessionType);

  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [loading, setLoading] = useState(false);

  // Stripe redirect params
  const queryParams = new URLSearchParams(location.search);
  const stripeSessionId = queryParams.get('session_id');
  const checkoutStatus = queryParams.get('status');

  // Load credit packs on mount
  useEffect(() => {
    const loadPacks = async () => {
      setLoading(true);
      try {
        const res = await getCreditPacks();
        setPacks(res?.packs || []);
      } catch {
        toastError(t('Common.errors.fetchingData'));
      } finally {
        setLoading(false);
      }
    };
    loadPacks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Stripe redirect return
  useEffect(() => {
    if (!stripeSessionId) return;
    const verifyPayment = async () => {
      setLoading(true);
      try {
        const res = await verifyCheckout(stripeSessionId);
        if (res?.status === 'complete') {
          if (res?.creditsAdded) dispatch(addBalance(res.creditsAdded));
          toastSuccess(t('VenterAddCredit.fundsAddedTitle'));
          navigate(sessionType ? '/venter/finding-listener' : '/venter/wallet', { replace: true });
        } else if (checkoutStatus === 'cancelled') {
          toastError(t('VenterAddCredit.paymentFailedMessage'));
          navigate(location.pathname, { replace: true });
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    verifyPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeSessionId, checkoutStatus]);

  const handleConfirm = async () => {
    if (!selectedPack) {
      toastError(t('VenterAddFunds.selectPlan'));
      return;
    }
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/venter/wallet/add-funds?status=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/venter/wallet/add-funds?status=cancelled`;
      const res = await createCheckoutSession({ packType: selectedPack.id, successUrl, cancelUrl });
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toastError(t('Common.somethingWentWrong'));
      }
    } catch (e: any) {
      toastError(e?.error || e?.message || t('Common.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('VenterAddFunds.title')}
        subtitle={t('VenterAddFunds.subtitle')}
        onBack={() => navigate('/venter/wallet')}
      />

      {loading && packs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-accent" />
        </div>
      ) : (
        <>
          {/* Credit Packs */}
          <div className="space-y-3 mb-6">
            {packs.map(pack => {
              const isSelected = selectedPack?.id === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={cn(
                    'w-full p-4 rounded-2xl border transition-all text-left',
                    isSelected ? 'bg-accent/10 border-accent/50' : 'glass border-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{pack.name}</p>
                      <p className="text-sm text-gray-400">
                        {pack.credits} {t('VenterAddFunds.minutes')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-accent">${pack.price.toFixed(2)}</p>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        isSelected ? 'border-accent bg-accent' : 'border-white/30'
                      )}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {packs.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                {t('VenterAddFunds.noPlans')}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedPack && (
            <GlassCard padding="sm" rounded="2xl" className="mb-6">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-500">{selectedPack.name}</span>
                <span className="text-white font-semibold">${selectedPack.price.toFixed(2)}</span>
              </div>
              <div className="divider my-2" />
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-400 font-medium">{t('Common.continue')}</span>
                <span className="text-white font-bold">${selectedPack.price.toFixed(2)}</span>
              </div>
            </GlassCard>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!selectedPack || loading}
            leftIcon={<CreditCard size={18} />}
            rightIcon={<ArrowRight size={18} />}
            onClick={handleConfirm}
          >
            {t('VenterAddFunds.continue')}
          </Button>
        </>
      )}
    </div>
  );
};
