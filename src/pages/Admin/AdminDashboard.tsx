import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../api/hooks/useAdmin';
import { StatCard } from '../../components/ui/StatCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import {
  Users, TrendingUp, UserPlus, Clock,
  BarChart3, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const formatNumber = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
const formatChange = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;

const FALLBACK_CARDS = [
  { key: 'activeUsers', label: 'Active Users', value: '--', change: '--', positive: true },
  { key: 'monthlySessions', label: 'Monthly Sessions', value: '--', change: '--', positive: false },
  { key: 'newSignups', label: 'New Signups', value: '--', change: '--', positive: true },
  { key: 'listenerOnlineMinutes', label: 'Listener Minutes', value: '--', change: '--', positive: true },
];

const STAT_ICONS = [Users, BarChart3, UserPlus, Clock];
const STAT_COLORS = ['var(--primary)', '#C2AEBF', '#32D74B', '#FFD746'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-gray-400">{payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getReportStats } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [lineData, setLineData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getReportStats();
        const cards24h = res?.stats?.applicationStatus24h?.cards;
        const hourlyData = res?.stats?.applicationStatus24h?.userProgressEngagementRatio;

        if (cards24h) {
          setCards([
            {
              key: 'activeUsers', label: 'Active Users',
              value: formatNumber(cards24h.activeUsers?.value ?? 0),
              change: formatChange(cards24h.activeUsers?.changePercent ?? 0),
              positive: (cards24h.activeUsers?.changePercent ?? 0) >= 0,
            },
            {
              key: 'monthlySessions', label: 'Monthly Sessions',
              value: formatNumber(cards24h.monthlySessions?.value ?? 0),
              change: formatChange(cards24h.monthlySessions?.changePercent ?? 0),
              positive: (cards24h.monthlySessions?.changePercent ?? 0) >= 0,
            },
            {
              key: 'newSignups', label: 'New Signups',
              value: formatNumber(cards24h.newSignups?.value ?? 0),
              change: formatChange(cards24h.newSignups?.changePercent ?? 0),
              positive: (cards24h.newSignups?.changePercent ?? 0) >= 0,
            },
            {
              key: 'listenerOnlineMinutes', label: 'Listener Minutes',
              value: formatNumber(cards24h.listenerOnlineMinutes?.value ?? 0),
              change: formatChange(cards24h.listenerOnlineMinutes?.changePercent ?? 0),
              positive: (cards24h.listenerOnlineMinutes?.changePercent ?? 0) >= 0,
            },
          ]);
        }

        if (hourlyData?.length) {
          const BUCKETS = period === 'week' ? 7 : 12;
          const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const now = new Date();
          const bucketSize = Math.ceil(hourlyData.length / BUCKETS);
          const aggregated = Array.from({ length: BUCKETS }, (_, bi) => {
            const slice = hourlyData.slice(bi * bucketSize, (bi + 1) * bucketSize);
            const avg = slice.length ? slice.reduce((s: number, x: any) => s + (x.activeUsers ?? 0), 0) : 0;
            const label = period === 'week'
              ? DAYS[new Date(now).setDate(now.getDate() - (BUCKETS - 1 - bi)) && new Date(now).getDay()]
              : MONTHS[(now.getMonth() - (11 - bi) + 12) % 12];
            return { value: avg, label };
          });
          setLineData(aggregated);
          setBarData(aggregated);
        }
      } catch (e) {
        console.error('Admin stats fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform Overview — Last 24 Hours</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? FALLBACK_CARDS.map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-3xl" />
          ))
          : cards.map((card, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <StatCard
                key={card.key}
                label={card.label}
                value={card.value}
                change={card.change}
                changePositive={card.positive}
                icon={<Icon size={20} />}
                iconColor={STAT_COLORS[i]}
              />
            );
          })
        }
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Progress Line Chart */}
        <GlassCard>
          <h2 className="text-base font-semibold text-white mb-4">User Engagement</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData.length ? lineData : [{ value: 0, label: '--' }]}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#C2AEBF"
                strokeWidth={2}
                dot={false}
                fill="rgba(194,174,191,0.1)"
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Session Traffic Bar Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Session Traffic</h2>
            <div className="flex gap-1">
              {(['week', 'month'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    period === p
                      ? 'bg-accent/15 text-accent border border-accent/25'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData.length ? barData : [{ value: 0, label: '--' }]} barCategoryGap="25%">
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" fill="#C2AEBF" fillOpacity={0.8} radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Quick Admin Links */}
      <div>
        <h2 className="section-title mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Manage Users', path: '/admin/users', icon: Users },
            { label: 'Listener Requests', path: '/admin/listener-requests', icon: UserPlus },
            { label: 'View Reports', path: '/admin/reports', icon: BarChart3 },
            { label: 'Financial Stats', path: '/admin/financial', icon: TrendingUp },
          ].map(({ label, path, icon: Icon }) => (
            <GlassCard
              key={path}
              hover
              onClick={() => navigate(path)}
              padding="md"
              rounded="2xl"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl glass flex items-center justify-center text-accent">
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{label}</p>
              </div>
              <ChevronRight size={14} className="text-gray-500 flex-shrink-0" />
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
