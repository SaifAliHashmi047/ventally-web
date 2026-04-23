import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useEarnings } from '../../api/hooks/useEarnings';
import type { Payout } from '../../api/hooks/useEarnings';
import { Wallet, ArrowDownToLine } from 'lucide-react';

const PAGE_LIMIT = 20;

const getStatusVariant = (status: Payout['status']): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'completed': return 'success';
    case 'processing': return 'warning';
    case 'pending':    return 'warning';
    case 'failed':     return 'error';
    case 'cancelled':  return 'default';
    default:           return 'default';
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const PayoutSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPayouts } = useEarnings();

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchPayouts = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;
    if (!isRefresh && !hasMore) return;

    isFetchingRef.current = true;
    const offset = isRefresh ? 0 : offsetRef.current;

    if (isRefresh) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await getPayouts(PAGE_LIMIT, offset);
      if (res?.payouts) {
        if (isRefresh) setPayouts(res.payouts);
        else setPayouts(prev => [...prev, ...res.payouts]);
        offsetRef.current = offset + res.payouts.length;
        setHasMore(res.pagination?.hasMore ?? false);
      }
    } catch {
      setPayouts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore]);

  useEffect(() => { fetchPayouts(true); }, []);

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader title={t('Profile.payout', 'Payout')} onBack={() => navigate(-1)} />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : payouts.length === 0 ? (
        <EmptyState
          title={t('Payout.emptyTitle', 'No payouts yet')}
          description={t('Payout.emptyDescription', 'Your payout details will appear here once processed.')}
          icon={<Wallet size={22} />}
        />
      ) : (
        <div className="space-y-3">
          {payouts.map(payout => (
            <GlassCard key={payout.id} bordered padding="md" rounded="2xl">
              <div className="flex items-center justify-between">
                {/* Left — amount + date */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center flex-shrink-0 text-gray-400">
                    <ArrowDownToLine size={16} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">${payout.amount?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(payout.processedAt || payout.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Right — status badge */}
                <Badge variant={getStatusVariant(payout.status)} size="sm">
                  {payout.status}
                </Badge>
              </div>
            </GlassCard>
          ))}

          {hasMore && (
            <Button variant="glass" fullWidth loading={loadingMore} onClick={() => fetchPayouts(false)}>
              {t('Common.loadMore')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
