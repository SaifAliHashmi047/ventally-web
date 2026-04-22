import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useEarnings } from '../../api/hooks/useEarnings';
import { DollarSign, ArrowUpRight, TrendingUp, CreditCard, ChevronRight, Building } from 'lucide-react';

export const ListenerWallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getEarningsSummary, getEarningsHistory, requestPayout } = useEarnings();
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sumRes, histRes] = await Promise.allSettled([getEarningsSummary(), getEarningsHistory(5, 0)]);
        if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
        if (histRes.status === 'fulfilled') setHistory(histRes.value?.earnings ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handlePayout = async () => {
    if (!summary?.availableBalance || summary.availableBalance < 1) return;
    setPayoutLoading(true);
    try {
      await requestPayout(summary.availableBalance);
      setSummary((prev: any) => ({ ...prev, availableBalance: 0 }));
    } catch { /* ignore */ } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('ListenerWallet.title', 'Earnings')} />

      <GlassCard bordered className="bg-white/[0.02] mb-4">
        <p className="text-sm text-gray-500 mb-1">{t('ListenerWallet.availableBalance', 'Available Balance')}</p>
        <p className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-1">
          {loading ? '--' : summary?.availableBalance?.toFixed(2) ?? '0.00'}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button
            variant="accent"
            size="md"
            fullWidth
            leftIcon={<CreditCard size={16} />}
            loading={payoutLoading}
            disabled={!summary?.availableBalance || summary.availableBalance < 1}
            onClick={handlePayout}
          >
            {t('ListenerWallet.requestPayout', 'Request Payout')}
          </Button>
          <Button
            variant="glass"
            size="md"
            fullWidth
            leftIcon={<Building size={16} />}
            onClick={() => navigate('/listener/payout-method')}
          >
            {t('ListenerWallet.managePayout', 'Payout Methods')}
          </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard 
          label={t('ListenerWallet.totalEarned', 'Total Earned')} 
          value={`${summary?.totalEarned?.toFixed(2) ?? '0.00'}`} 
          icon={<DollarSign size={18} />} 
          iconColor="#32D74B" 
        />
        <StatCard 
          label={t('ListenerWallet.thisMonth', 'This Month')} 
          value={`${summary?.monthlyEarnings?.toFixed(2) ?? '0.00'}`} 
          icon={<TrendingUp size={18} />} 
          iconColor="#C2AEBF" 
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('ListenerWallet.earningHistory', 'Earning History')}</h2>
          <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
            {t('Common.viewAll', 'View All')} <ChevronRight size={12} />
          </button>
        </div>

        {history.length === 0 ? (
          <EmptyState 
            title={t('ListenerWallet.noEarnings', 'No earnings yet')} 
            description={t('ListenerWallet.noEarningsDesc', 'Complete sessions to start earning.')} 
            icon={<DollarSign size={22} />} 
          />
        ) : (
          <GlassCard padding="none" rounded="2xl">
            {history.map((e: any, i: number) => (
              <div key={e.id} className={`flex items-center gap-4 px-4 py-3 ${i < history.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight size={16} className="text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{t('ListenerWallet.sessionEarning', 'Session Earning')}</p>
                  <p className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                </div>
                <p className="text-sm font-bold text-success">+{e.amount?.toFixed(2)}</p>
              </div>
            ))}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
