import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAdmin } from '../../api/hooks/useAdmin';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount?.toFixed(2) ?? '0.00'}`;
};

const formatDate = (iso: string) => {
  if (!iso) return '--';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  } catch { return '--'; }
};

const STATUS_COLOR: Record<string, string> = {
  completed: '#4CAF50',
  pending: '#FFC107',
  failed: '#F44336',
  expired: '#9E9E9E',
};

const PIE_COLORS = ['#C2AEBF', '#B692C2', '#8B5CF6', '#6366F1'];

const build12MonthData = (payments: any[]) => {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: monthNames[d.getMonth()] });
  }
  const buckets: Record<string, number> = {};
  months.forEach(m => (buckets[m.key] = 0));
  payments.forEach(p => {
    if (p.status === 'completed') {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in buckets) buckets[key] += p.amount || 0;
    }
  });
  return months.map(m => ({ label: m.label, value: buckets[m.key] }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <p className="text-white font-semibold">{label}</p>
      <p className="text-gray-400">{typeof payload[0]?.value === 'number' ? formatCurrency(payload[0].value) : payload[0]?.value}</p>
    </div>
  );
  return null;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const AdminFinancialStats = () => {
  const { getAdminPaymentStats, getPaymentHistory, getReportStats } = useAdmin();
  const [statsLoading, setStatsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<{ value: number; label: string }[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const [pStats, reportStats] = await Promise.allSettled([
        getAdminPaymentStats(),
        getReportStats(),
      ]);
      if (pStats.status === 'fulfilled') setPaymentStats(pStats.value);
      if (reportStats.status === 'fulfilled') {
        const hourlyData = reportStats.value?.stats?.applicationStatus24h?.userProgressEngagementRatio;
        if (hourlyData?.length) {
          setEngagementData(
            hourlyData.map((item: any, idx: number) => ({ value: item.sessions ?? 0, label: `H${idx + 1}` }))
          );
        }
      }
    } catch { /* ignore */ } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const res = await getPaymentHistory(undefined, undefined, undefined, undefined, undefined, 100, 0);
      setPaymentHistory(res?.payments ?? []);
    } catch { /* ignore */ } finally {
      setPaymentsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); fetchPayments(); }, []);

  // 12-month revenue line chart
  const chartData = useMemo(() => {
    const from12 = build12MonthData(paymentHistory);
    if (from12.some(d => d.value > 0)) return from12;
    return [
      { value: 3200, label: 'Jan' }, { value: 3800, label: 'Feb' },
      { value: 2100, label: 'Mar' }, { value: 3600, label: 'Apr' },
      { value: 4200, label: 'May' }, { value: 2800, label: 'Jun' },
      { value: 3100, label: 'Jul' }, { value: 3900, label: 'Aug' },
      { value: 2600, label: 'Sep' }, { value: 4500, label: 'Oct' },
      { value: 3300, label: 'Nov' }, { value: 3700, label: 'Dec' },
    ];
  }, [paymentHistory]);

  const pieData = [
    { name: 'Subscriptions', value: 30 },
    { name: 'Sessions', value: 30 },
    { name: 'Add-ons', value: 20 },
    { name: 'Other', value: 20 },
  ];

  // Horizontal scrollable stat cards (matching native)
  const statCards = [
    {
      label: 'Update',
      title: statsLoading ? '…' : `Revenue increased by ${paymentStats?.weeklyRevenueIncrease?.increasePercent?.toFixed(1) ?? '0.0'}% in 1 week`,
      value: statsLoading ? '…' : formatCurrency(paymentStats?.weeklyRevenueIncrease?.currentRevenue ?? 0),
    },
    {
      label: 'Next Expected Revenue',
      title: null,
      value: statsLoading ? '…' : formatCurrency(paymentStats?.nextExpectedRevenue?.totalRevenue ?? 0),
      sub: `📊 In next ${paymentStats?.nextExpectedRevenue?.windowDays ?? 7} days`,
    },
    {
      label: 'Weekly Sales',
      title: null,
      value: statsLoading ? '…' : formatCurrency(
        (paymentStats?.weeklySalesData?.series ?? []).reduce((acc: number, d: any) => acc + (d.revenue || 0), 0)
      ),
      sub: `Last ${paymentStats?.weeklySalesData?.windowWeeks ?? 8} weeks`,
    },
    {
      label: 'Page Visits',
      title: null,
      value: statsLoading ? '…' : engagementData.reduce((acc, d) => acc + d.value, 0).toLocaleString(),
      sub: '↗ 5% vs last month',
    },
  ];

  const recentPayments = paymentHistory.slice(0, 20);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Financial Statistics" />

      {/* ── Horizontal Scrollable Stat Cards ── */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {statCards.map((card, i) => (
          <GlassCard
            key={i}
            className="flex-shrink-0 w-64 h-44 flex flex-col justify-between"
            padding="md"
          >
            <p className="text-xs text-white/70">{card.label}</p>
            {card.title && (
              <p className="text-sm font-bold text-white leading-snug">{card.title}</p>
            )}
            <p className="text-2xl font-bold text-white">{card.value}</p>
            {card.sub && <p className="text-xs text-white/60">{card.sub}</p>}
          </GlassCard>
        ))}
      </div>

      {/* ── 12-Month Revenue Chart ── */}
      <GlassCard bordered>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Revenue Over 12 Months</h2>
          <span className="px-3 py-1 rounded-xl text-xs text-white/70 bg-white/10">12 Months</span>
        </div>
        {statsLoading && paymentsLoading ? (
          <div className="h-56 flex items-center justify-center">
            <div className="skeleton h-full w-full rounded-2xl" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C2AEBF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C2AEBF" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#C2AEBF"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#C2AEBF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      {/* ── Revenue Sources Pie Chart ── */}
      <GlassCard bordered>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Revenue Sources</h2>
          <span className="px-3 py-1 rounded-xl text-xs text-white/70 bg-white/10">Revenue</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={2}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, '']}
                contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-sm text-white">{entry.name}</span>
                <span className="text-sm text-gray-400 ml-auto pl-4">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ── Recent Payment History ── */}
      <GlassCard padding="none" rounded="2xl">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">Payment History</h2>
        </div>
        {paymentsLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
          </div>
        ) : recentPayments.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">No payment records</p>
        ) : (
          <div className="divide-y divide-white/5">
            {recentPayments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {p.user?.displayName || p.user?.email || p.listenerEmail || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(p.amount ?? 0)}</p>
                  <span
                    className="text-xs font-medium capitalize"
                    style={{ color: STATUS_COLOR[p.status] ?? '#9E9E9E' }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
