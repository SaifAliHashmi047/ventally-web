import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, Download, Loader2, CreditCard } from 'lucide-react';

const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${(amount ?? 0).toFixed(2)}`;
};

const formatDate = (iso: string) => {
  if (!iso) return '--';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
};

const STATUS_VARIANT: Record<string, any> = {
  completed: 'success',
  pending: 'warning',
  failed: 'error',
  expired: 'default',
};

const STATUS_OPTIONS = ['', 'completed', 'pending', 'failed', 'expired'];

export const AdminPaymentHistory = () => {
  const { getPaymentHistory, exportPaymentHistoryPDF } = useAdmin();

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;
  const [offset, setOffset] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchPayments = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    if (reset) { setLoading(true); } else { setLoadingMore(true); }
    try {
      const res = await getPaymentHistory(
        search || undefined,
        undefined,
        statusFilter || undefined,
        fromDate || undefined,
        toDate || undefined,
        LIMIT,
        currentOffset,
      );
      const fetched = res?.payments ?? [];
      if (reset) {
        setPayments(fetched);
        setOffset(LIMIT);
      } else {
        setPayments(prev => [...prev, ...fetched]);
        setOffset(currentOffset + LIMIT);
      }
      setTotal(res?.pagination?.total ?? res?.total ?? 0);
    } catch { /* ignore */ } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, statusFilter, fromDate, toDate, offset, getPaymentHistory]);

  useEffect(() => { fetchPayments(true); }, [search, statusFilter, fromDate, toDate]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const blob = await exportPaymentHistoryPDF(
        search || undefined,
        undefined,
        statusFilter || undefined,
        fromDate || undefined,
        toDate || undefined,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment_history_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Payment History"
        subtitle={`${total} transactions`}
        rightContent={
          <Button
            variant="glass"
            size="sm"
            leftIcon={exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            loading={exporting}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        }
      />

      {/* Filters */}
      <div className="space-y-3">
        <Input
          placeholder="Search by user email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />

        <div className="flex flex-wrap gap-2">
          {/* Status filter */}
          {STATUS_OPTIONS.map(s => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-accent/15 text-accent border border-accent/25'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2 text-sm text-white bg-transparent border border-white/10 focus:border-accent/50 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2 text-sm text-white bg-transparent border border-white/10 focus:border-accent/50 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payment List */}
      <GlassCard padding="none" rounded="2xl" className="mt-4">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters."
            icon={<CreditCard size={22} />}
          />
        ) : (
          <div className="divide-y divide-white/5">
            {payments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {p.user?.displayName || p.user?.email || p.listenerEmail || p.venterEmail || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p>
                </div>
                <div className="ml-3 text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white mb-1">{formatCurrency(p.amount ?? 0)}</p>
                  <Badge variant={STATUS_VARIANT[p.status] ?? 'default'} className="capitalize text-xs">
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      {payments.length < total && (
        <div className="flex justify-center mt-4">
          <Button variant="glass" size="sm" loading={loadingMore} onClick={() => fetchPayments(false)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
