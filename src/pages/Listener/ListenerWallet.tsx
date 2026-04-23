import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useEarnings } from '../../api/hooks/useEarnings';
import { DollarSign, ArrowUpRight, TrendingUp, CreditCard, ChevronRight, Building } from 'lucide-react';
import { toastError } from '../../utils/toast';

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
        const [sumRes, histRes] = await Promise.allSettled([
          getEarningsSummary(),
          getEarningsHistory(5, 0),
        ]);
        if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
        if (histRes.status === 'fulfilled') setHistory(histRes.value?.earnings ?? []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [getEarningsHistory, getEarningsSummary]);

  const handlePayout = async () => {
    if (!summary?.availableBalance || summary.availableBalance < 1) return;
    setPayoutLoading(true);
    try {
      await requestPayout(summary.availableBalance);
      setSummary((prev: any) => ({ ...prev, availableBalance: 0 }));
    } catch (e: any) {
      toastError(e?.message || t('Common.somethingWentWrong'));
    } finally {
      setPayoutLoading(false);
    }
  };

  const available = loading ? null : (summary?.availableBalance ?? 0);
  const formatMoney = (n: number | null | undefined) =>
    n != null && !Number.isNaN(Number(n)) ? Number(n).toFixed(2) : '0.00';

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <div className="w-full lg:max-w-3xl xl:max-w-4xl lg:mx-auto">
        <header className="mb-6 text-center lg:text-left lg:mb-8">
          <h1 className="text-lg font-semibold text-white tracking-tight lg:text-2xl lg:font-bold">
            {t('Navigation.tabs.wallet', 'Balance')}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-md mx-auto lg:mx-0">
            {t('ListenerWallet.subtitle', 'Payouts and session earnings')}
          </p>
        </header>

        {/* Available balance + actions */}
        <GlassCard
          bordered
          padding="lg"
          className="mb-6 text-center shadow-2xl shadow-black/20 lg:mb-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2 lg:mb-3">
            {t('ListenerWallet.availableBalance', 'Available Balance')}
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-white tabular-nums tracking-tight mb-6 lg:mb-8">
            {loading ? '—' : formatMoney(available)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
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

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <StatCard
            label={t('ListenerWallet.lifetimeEarnings', 'Lifetime Earnings')}
            value={loading ? '—' : formatMoney(summary?.lifetimeEarnings)}
            icon={<DollarSign size={18} />}
            iconColor="#32D74B"
          />
          <StatCard
            label={t('ListenerWallet.totalPaid', 'Total Paid Out')}
            value={loading ? '—' : formatMoney(summary?.totalPaid)}
            icon={<TrendingUp size={18} />}
            iconColor="#C2AEBF"
          />
        </div>

        {/* Earning history */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {t('ListenerWallet.earningHistory', 'Earning History')}
            </h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => navigate('/listener/sessions')}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                {t('Common.viewAll', 'View All')} <ChevronRight size={12} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <GlassCard bordered rounded="2xl" className="py-2">
              <EmptyState
                title={t('ListenerWallet.noEarnings', 'No earnings yet')}
                description={t('ListenerWallet.noEarningsDesc', 'Complete sessions to start earning.')}
                icon={<DollarSign size={22} />}
              />
            </GlassCard>
          ) : (
            <GlassCard padding="none" rounded="2xl" className="overflow-hidden">
              {history.map((e: any, i: number) => (
                <div
                  key={e.id}
                  className={`flex items-center gap-4 px-4 sm:px-5 py-3.5 ${
                    i < history.length - 1 ? 'border-b border-white/8' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight size={16} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {e.sessionType === 'call'
                        ? t('ListenerWallet.earningCall', 'Voice session')
                        : e.sessionType === 'chat'
                          ? t('ListenerWallet.earningChat', 'Chat session')
                          : t('ListenerWallet.sessionEarning', 'Session earning')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {e.createdAt
                        ? new Date(e.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : '—'}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-success tabular-nums flex-shrink-0">
                    +{formatMoney(e.netAmount)}
                  </p>
                </div>
              ))}
            </GlassCard>
          )}
        </section>
      </div>
    </div>
  );
};
