import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useWallet } from '../../api/hooks/useWallet';
import { ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const VenterTransactions = () => {
  const navigate = useNavigate();
  const { getTransactions } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const loadTransactions = async (offset = 0) => {
    try {
      const res = await getTransactions(LIMIT, offset);
      const items = res?.transactions ?? [];
      if (offset === 0) setTransactions(items);
      else setTransactions(prev => [...prev, ...items]);
      setHasMore(items.length === LIMIT);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTransactions(0); }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Transaction History" onBack={() => navigate(-1)} />

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : transactions.length === 0 ? (
        <EmptyState title="No transactions yet" icon={<DollarSign size={22} />} />
      ) : (
        <>
          <GlassCard padding="none" rounded="2xl">
            {transactions.map((tx: any, i: number) => {
              const isCredit = tx.type === 'credit' || tx.type === 'top_up';
              return (
                <div key={tx.id} className={`flex items-center gap-4 px-4 py-3 ${i < transactions.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-success/15' : 'bg-error/10'}`}>
                    {isCredit ? <ArrowDownLeft size={16} className="text-success" /> : <ArrowUpRight size={16} className="text-error" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white capitalize">{tx.type?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isCredit ? 'text-success' : 'text-error'}`}>
                      {isCredit ? '+' : '-'}${Math.abs(tx.amountCurrency ?? 0).toFixed(2)}
                    </p>
                    <Badge variant={tx.status === 'success' ? 'success' : 'error'} size="sm" className="mt-1">{tx.status}</Badge>
                  </div>
                </div>
              );
            })}
          </GlassCard>
          {hasMore && (
            <Button variant="glass" fullWidth onClick={() => { const next = page + 1; setPage(next); loadTransactions(next * LIMIT); }}>
              Load More
            </Button>
          )}
        </>
      )}
    </div>
  );
};
