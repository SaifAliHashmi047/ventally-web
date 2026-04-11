import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useEarnings } from '../../api/hooks/useEarnings';
import { DollarSign, ArrowUpRight, TrendingUp, CreditCard, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const ListenerWallet = () => {
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
      <PageHeader title="Earnings" />

      <GlassCard bordered className="bg-gradient-to-br from-accent/10 to-transparent">
        <p className="text-sm text-gray-500 mb-1">Available Balance</p>
        <p className="text-4xl font-bold text-white tracking-tight">
          ${loading ? '--' : summary?.availableBalance?.toFixed(2) ?? '0.00'}
        </p>
        <Button
          variant="accent"
          size="md"
          fullWidth
          leftIcon={<CreditCard size={16} />}
          className="mt-5"
          loading={payoutLoading}
          disabled={!summary?.availableBalance || summary.availableBalance < 1}
          onClick={handlePayout}
        >
          Request Payout
        </Button>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Earned" value={`$${summary?.totalEarned?.toFixed(2) ?? '0.00'}`} icon={<DollarSign size={18} />} iconColor="#32D74B" />
        <StatCard label="This Month" value={`$${summary?.monthlyEarnings?.toFixed(2) ?? '0.00'}`} icon={<TrendingUp size={18} />} iconColor="#C2AEBF" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Earning History</h2>
          <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
            View All <ChevronRight size={12} />
          </button>
        </div>

        {history.length === 0 ? (
          <EmptyState title="No earnings yet" description="Complete sessions to start earning." icon={<DollarSign size={22} />} />
        ) : (
          <GlassCard padding="none" rounded="2xl">
            {history.map((e: any, i: number) => (
              <div key={e.id} className={`flex items-center gap-4 px-4 py-3 ${i < history.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight size={16} className="text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Session Earning</p>
                  <p className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                </div>
                <p className="text-sm font-bold text-success">+${e.amount?.toFixed(2)}</p>
              </div>
            ))}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
