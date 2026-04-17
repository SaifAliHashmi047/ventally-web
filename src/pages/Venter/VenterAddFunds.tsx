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
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for Stripe redirect return
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const checkoutStatus = queryParams.get('status');

  // Load credit packs on mount
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setLoading(true);
        const res = await getCreditPacks();
        setPacks(res?.packs || []);
      } catch (e) {
        console.error('Failed to load credit packs:', e);
        setError(t('VenterAddFunds.loadError', 'Failed to load credit packs'));
      } finally {
        setLoading(false);
      }
    };
    loadPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Stripe redirect return
  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        setLoading(true);
        const res = await verifyCheckout(sessionId);

        if (res?.status === 'complete') {
          // Update user balance in Redux
          if (res?.creditsAdded) {
            dispatch(addBalance(res.creditsAdded));
          }
          setShowSuccess(true);

          // Clear query params
          navigate(location.pathname, { replace: true });
        } else if (checkoutStatus === 'cancelled') {
          setError(t('VenterAddFunds.paymentCancelled', 'Payment was cancelled'));
          navigate(location.pathname, { replace: true });
        }
      } catch (e) {
        console.error('Payment verification failed:', e);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, checkoutStatus]);

  const handleConfirm = async () => {
    if (!selectedPack) {
      setError(t('VenterAddFunds.selectPack', 'Please select a credit pack'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const successUrl = `${window.location.origin}/venter/wallet/add-funds?status=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/venter/wallet/add-funds?status=cancelled`;

      const res = await createCheckoutSession({
        packType: selectedPack.id,
        successUrl,
        cancelUrl,
      });

      if (res?.url) {
        // Redirect to Stripe checkout
        window.location.href = res.url;
      } else {
        setError(t('VenterAddFunds.checkoutError', 'Failed to create checkout session'));
      }
    } catch (e: unknown) {
      const err = e as { error?: string; message?: string };
      setError(err?.error || err?.message || t('VenterAddFunds.paymentError', 'Payment processing failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // If user came from finding listener flow, return there
    if (sessionType) {
      navigate('/venter/finding-listener', { state: { type: sessionType } });
    } else {
      navigate('/venter/wallet');
    }
  };

  if (showSuccess) {
    return (
      <div className="page-wrapper animate-fade-in flex items-center justify-center">
        <GlassCard bordered className="text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {t('VenterAddFunds.successTitle', 'Payment Successful!')}
          </h2>
          <p className="text-gray-500 mb-6">
            {t('VenterAddFunds.successMessage', 'Your funds have been added to your wallet.')}
          </p>
          <Button variant="primary" fullWidth onClick={handleSuccessClose}>
            {sessionType ? t('VenterAddFunds.continueSession', 'Continue to Session') : t('Wallet.okay', 'OK')}
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('VenterAddFunds.title', 'Add Funds')}
        subtitle={t('VenterAddFunds.subtitle', 'Select a credit pack to purchase')}
        onBack={() => navigate('/venter/wallet')}
      />

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-2xl mb-4 text-sm">
          {error}
        </div>
      )}

      {loading && packs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-accent" />
        </div>
      ) : (
        <>
          {/* Credit Packs */}
          <div className="space-y-3 mb-6">
            {packs.map((pack) => {
              const isSelected = selectedPack?.id === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => { setSelectedPack(pack); setError(''); }}
                  className={cn(
                    'w-full p-4 rounded-2xl border transition-all text-left',
                    isSelected
                      ? 'bg-accent/10 border-accent/50'
                      : 'glass border-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{pack.name}</p>
                      <p className="text-sm text-gray-400">
                        {pack.credits} {t('VenterAddFunds.credits', 'credits')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-accent">
                        ${pack.price.toFixed(2)}
                      </p>
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
                {t('VenterAddFunds.noPlans', 'No credit packs available')}
              </div>
            )}
          </div>

          {/* Selected Pack Summary */}
          {selectedPack && (
            <GlassCard padding="sm" rounded="2xl" className="mb-6">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-500">{selectedPack.name}</span>
                <span className="text-white font-semibold">${selectedPack.price.toFixed(2)}</span>
              </div>
              <div className="divider my-2" />
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-400 font-medium">{t('VenterAddFunds.total', 'Total')}</span>
                <span className="text-white font-bold">${selectedPack.price.toFixed(2)}</span>
              </div>
            </GlassCard>
          )}

          {/* Checkout Button */}
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
            {t('VenterAddFunds.checkout', 'Proceed to Checkout')}
          </Button>

          <p className="text-xs text-gray-600 text-center mt-4">
            {t('VenterAddFunds.secureNotice', 'Payments are processed securely by Stripe. Your card details are never stored.')}
          </p>
        </>
      )}
    </div>
  );
};
