import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { useAdmin } from '../../api/hooks/useAdmin';
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from 'recharts';

interface PaymentRow { id: string; amount: number; type: string; status: string; createdAt: string; user?: any; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <p className="text-white font-semibold">{label}</p>
      <p className="text-gray-400">{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
  return null;
};

export const AdminFinancialStats = () => {
  const { getFinancialStats, getPaymentHistory } = useAdmin();
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [statsRes, paymentsRes] = await Promise.allSettled([getFinancialStats(), getPaymentHistory({ limit: 10 })]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value?.stats);
        if (paymentsRes.status === 'fulfilled') {
          setPayments(paymentsRes.value?.payments ?? []);
          setChartData(paymentsRes.value?.chartData ?? []);
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Financial Statistics" />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />) : [
          { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) ?? '0.00'}`, icon: DollarSign, color: '#32D74B' },
          { label: 'Monthly Revenue', value: `$${stats?.monthlyRevenue?.toFixed(2) ?? '0.00'}`, icon: TrendingUp, color: '#0A84FF' },
          { label: 'Total Payouts', value: `$${stats?.totalPayouts?.toFixed(2) ?? '0.00'}`, icon: CreditCard, color: '#C2AEBF' },
          { label: 'Active Subscribers', value: stats?.activeSubscribers ?? 0, icon: Users, color: '#FFD746' },
        ].map(({ label, value, icon: Icon, color }) => (
          <StatCard key={label} label={label} value={value} icon={<Icon size={20} />} iconColor={color} />
        ))}
      </div>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <GlassCard>
          <h2 className="text-base font-semibold text-white mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#32D74B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#32D74B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#32D74B" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Recent Payments */}
      <GlassCard padding="none" rounded="2xl">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-2xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="text-sm text-white">{p.user?.displayName || p.user?.email || 'Unknown'}</td>
                    <td className="text-sm font-semibold text-white">${p.amount?.toFixed(2)}</td>
                    <td className="text-xs text-gray-400 capitalize">{p.type?.replace(/_/g, ' ')}</td>
                    <td><span className={`text-xs font-medium ${p.status === 'success' ? 'text-success' : p.status === 'failed' ? 'text-error' : 'text-warning'}`}>{p.status}</span></td>
                    <td className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
