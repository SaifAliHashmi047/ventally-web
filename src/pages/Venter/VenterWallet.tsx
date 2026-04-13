import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { useWallet } from '../../api/hooks/useWallet';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Wallet, Plus, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const VenterWallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getWallet, getTransactions } = useWallet();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [walletRes, txRes] = await Promise.allSettled([getWallet(), getTransactions(5, 0)]);
        if (walletRes.status === 'fulfilled') setWallet(walletRes.value?.wallet);
        if (txRes.status === 'fulfilled') setTransactions(txRes.value?.transactions ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('VenterWallet.title', 'Wallet')} />

      {/* Balance Card */}
      <GlassCard bordered className="bg-gradient-to-br from-primary/10 to-transparent mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{t('VenterWallet.availableBalance', 'Available Balance')}</p>
            <p className="text-4xl font-bold text-white tracking-tight">
              {loading ? '--' : `${wallet?.balance?.toFixed(2) ?? '0.00'}`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {wallet?.credits ?? 0} {t('VenterWallet.credits', 'credits remaining')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Wallet size={22} className="text-primary" />
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          fullWidth
          leftIcon={<Plus size={16} />}
          className="mt-5"
          onClick={() => navigate('/venter/wallet/add-funds')}
        >
          {t('VenterWallet.addFunds', 'Add Funds')}
        </Button>
      </GlassCard>

      {/* Recent Transactions */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('VenterWallet.recentTransactions', 'Recent Transactions')}</h2>
          <button onClick={() => navigate('/venter/wallet/transactions')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
            {t('Common.viewAll', 'View All')} <ChevronRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
        ) : transactions.length === 0 ? (
          <EmptyState 
            title={t('VenterWallet.noTransactions', 'No transactions yet')} 
            description={t('VenterWallet.noTransactionsDesc', 'Add funds to get started.')} 
          />
        ) : (
          <GlassCard padding="none" rounded="2xl">
            {transactions.map((tx: any, i: number) => {
              const isCredit = tx.type === 'credit' || tx.type === 'top_up';
              return (
                <div key={tx.id} className={`flex items-center gap-4 px-4 py-3 ${i < transactions.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-success/15' : 'bg-error/10'}`}>
                    {isCredit ? <ArrowDownLeft size={16} className="text-success" /> : <ArrowUpRight size={16} className="text-error" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white capitalize">{tx.type?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                  </div>
                  <p className={`text-sm font-bold ${isCredit ? 'text-success' : 'text-error'}`}>
                    {isCredit ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </GlassCard>
        )}
      </div>

      {/* Subscription */}
      <GlassCard accent hover onClick={() => navigate('/venter/subscription')} className="cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{t('VenterWallet.subscription', 'My Subscription')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('VenterWallet.subscriptionDesc', 'Manage your plan and billing')}</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>
      </GlassCard>
    </div>
  );
};
