import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { useWallet } from '../../api/hooks/useWallet';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';
import { toastError } from '../../utils/toast';

export const VenterWallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getWallet, getTransactions, getMySubscription } = useWallet();

  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [balRes, txRes, subRes] = await Promise.allSettled([
          getWallet(),
          getTransactions(5, 0),
          getMySubscription(),
        ]);
        if (balRes.status === 'fulfilled') setBalance(balRes.value?.balance);
        if (txRes.status === 'fulfilled') setTransactions(txRes.value?.transactions ?? []);
        if (subRes.status === 'fulfilled') setSubscription(subRes.value);
      } catch {
        toastError(t('Common.errors.fetchingData'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatAmount = (amount: number) => amount?.toFixed(2) ?? '0.00';

  const getTransactionLabel = (tx: any) => {
    const type = tx.type?.toLowerCase() ?? '';
    if (type === 'session' || type === 'session_payment') {
      return t('VenterWallet.transactions.callSession', { duration: tx.durationMinutes ?? 0 });
    }
    if (type === 'deposit' || type === 'top_up') {
      return t('VenterWallet.transactions.fundsAdded');
    }
    return tx.type?.replace(/_/g, ' ') ?? t('Common.unknown');
  };

  const isCredit = (tx: any) => {
    const type = tx.type?.toLowerCase() ?? '';
    return type === 'deposit' || type === 'top_up' || type === 'refund';
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Title — centered, matching RN */}
      <h1 className="text-lg font-medium text-white text-center mb-6">
        {t('Wallet.title')}
      </h1>

      {/* Balance + Add Funds */}
      <GlassCard bordered className="mb-6 text-center">
        <p className="text-4xl font-bold text-white mb-4">
          {loading ? '--' : formatAmount(balance?.currency ?? balance?.balance ?? 0)}
        </p>
        <Button
          variant="glass"
          size="md"
          fullWidth
          onClick={() => navigate('/venter/wallet/add-funds')}
        >
          {t('Wallet.addFunds')}
        </Button>
      </GlassCard>

      {/* Transactions Section */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-white mb-3">{t('Wallet.transactions')}</p>

        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title={t('VenterWallet.noTransactions')}
            description={t('VenterWallet.noTransactionsDescription')}
          />
        ) : (
          <>
            <GlassCard padding="none" rounded="2xl">
              {transactions.map((tx: any, i: number) => {
                const credit = isCredit(tx);
                return (
                  <div
                    key={tx.id ?? i}
                    className={`flex items-center gap-4 px-4 py-3 ${
                      i < transactions.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      credit ? 'bg-success/15' : 'bg-error/10'
                    }`}>
                      {credit
                        ? <ArrowDownLeft size={16} className="text-success" />
                        : <ArrowUpRight size={16} className="text-error" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{getTransactionLabel(tx)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createdAt ?? tx.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <p className={`text-sm font-bold flex-shrink-0 ${credit ? 'text-success' : 'text-error'}`}>
                      {credit ? '+' : '-'}{formatAmount(Math.abs(tx.amountCurrency ?? tx.amount ?? 0))}
                    </p>
                  </div>
                );
              })}
            </GlassCard>

            {transactions.length >= 5 && (
              <Button
                variant="glass"
                size="md"
                fullWidth
                className="mt-3"
                onClick={() => navigate('/venter/wallet/transactions')}
              >
                {t('VenterWallet.viewAll')}
              </Button>
            )}
          </>
        )}
      </div>

      {/* Subscription Billing Information */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-white mb-3">{t('SubscriptionDetails.detailsTitle')}</p>

        {loading ? (
          <div className="skeleton h-32 rounded-2xl" />
        ) : subscription?.hasSubscription ? (
          <GlassCard bordered>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">{t('SubscriptionDetails.nextBillingDate')}</p>
                <p className="text-sm font-medium text-white">
                  {subscription?.subscription?.billingCycleEnd
                    ? new Date(subscription.subscription.billingCycleEnd).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">{t('SubscriptionDetails.monthlyPlan')}</p>
                <p className="text-sm font-medium text-white">
                  {subscription?.subscription?.monthlyPrice ?? '-'}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">{t('SubscriptionDetails.fundsUsed')}</p>
                <p className="text-sm font-medium text-white">
                  {subscription?.subscription?.usedMinutes
                    ? `${subscription.subscription.usedMinutes} min`
                    : '-'}
                </p>
              </div>
            </div>
          </GlassCard>
        ) : (
          <GlassCard bordered className="text-center py-4">
            <EmptyState
              title={t('SubscriptionDetails.noActiveSubscription')}
              description={t('SubscriptionDetails.freePlanMessage')}
            />
            <Button
              variant="glass"
              size="md"
              className="mt-4"
              onClick={() => navigate('/venter/subscription')}
            >
              {t('SubscriptionDetails.choosePlan')}
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
