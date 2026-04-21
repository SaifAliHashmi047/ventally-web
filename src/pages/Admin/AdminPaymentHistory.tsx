import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Loader2 } from 'lucide-react';

const formatAmount = (amount: number) => {
  if (!amount && amount !== 0) return '--';
  return `${amount.toFixed(2)}`;
};

const formatDate = (iso: string) => {
  if (!iso) return '--';
  try {
    const d = new Date(iso);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return isToday ? `Today ${timeStr}` : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) + ` ${timeStr}`;
  } catch {
    return '--';
  }
};

export const AdminPaymentHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPaymentHistory } = useAdmin();

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;
  const offsetRef = useRef(0);

  const fetchPayments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setLoading(true);
      offsetRef.current = 0;
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await getPaymentHistory(
        undefined, undefined, undefined, undefined, undefined,
        LIMIT, offsetRef.current
      );
      const data = res?.payments ?? [];
      
      if (isRefresh) {
        setPayments(data);
        offsetRef.current = LIMIT;
      } else {
        setPayments(prev => [...prev, ...data]);
        offsetRef.current += LIMIT;
      }
      setTotal(res?.pagination?.total ?? 0);
    } catch (err) {
      console.warn('Failed to load payment history:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getPaymentHistory]);

  useEffect(() => {
    fetchPayments(true);
  }, []);

  return (
    <div className="page-wrapper animate-fade-in pb-20 max-w-2xl mx-auto">
      <PageHeader
        title={t('Admin.financialStats.paymentHistory.title', 'Payment History')}
        onBack={() => navigate(-1)}
        centered
      />

      <div className="px-1 space-y-3 mt-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-[22px]" />
          ))
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 font-medium">No payment history found.</p>
          </div>
        ) : (
          <>
            {payments.map((payment) => (
              <GlassCard key={payment.id} className="p-0 border-white/10 rounded-[22px] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[18px] font-bold text-white">
                    {formatAmount(payment.amount)}
                  </span>
                  <span className="text-[14px] font-normal text-white/80">
                    {formatDate(payment.createdAt)}
                  </span>
                </div>
              </GlassCard>
            ))}
            
            {payments.length < total && (
              <button 
                onClick={() => fetchPayments(false)}
                className="w-full py-4 text-white/40 text-sm font-medium hover:text-white transition-colors"
                disabled={loadingMore}
              >
                {loadingMore ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
