import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../../api/hooks/useAdmin';
import { StatCard } from '../../components/ui/StatCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import {
  Users, TrendingUp, UserPlus, Clock,
  BarChart3, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

const formatNumber = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
const formatChange = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;

const FALLBACK_CARDS = [
  { key: 'activeUsers', labelKey: 'Admin.home.activeUsers', value: '--', change: '--', positive: true },
  { key: 'monthlySessions', labelKey: 'Admin.home.monthlySessions', value: '--', change: '--', positive: false },
  { key: 'newSignups', labelKey: 'Admin.home.newSignups', value: '--', change: '--', positive: true },
  { key: 'listenerOnlineMinutes', labelKey: 'Admin.home.listenerOnlineMinutes', value: '--', change: '--', positive: true },
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
  const { t } = useTranslation();
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
              key: 'activeUsers', labelKey: 'Admin.home.activeUsers',
              value: formatNumber(cards24h.activeUsers?.value ?? 0),
              change: formatChange(cards24h.activeUsers?.changePercent ?? 0),
              positive: (cards24h.activeUsers?.changePercent ?? 0) >= 0,
            },
            {
              key: 'monthlySessions', labelKey: 'Admin.home.monthlySessions',
              value: formatNumber(cards24h.monthlySessions?.value ?? 0),
              change: formatChange(cards24h.monthlySessions?.changePercent ?? 0),
              positive: (cards24h.monthlySessions?.changePercent ?? 0) >= 0,
            },
            {
              key: 'newSignups', labelKey: 'Admin.home.newSignups',
              value: formatNumber(cards24h.newSignups?.value ?? 0),
              change: formatChange(cards24h.newSignups?.changePercent ?? 0),
              positive: (cards24h.newSignups?.changePercent ?? 0) >= 0,
            },
            {
              key: 'listenerOnlineMinutes', labelKey: 'Admin.home.listenerOnlineMinutes',
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
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('Admin.home.overview', 'Overview')}</h1>
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
                label={t(card.labelKey)}
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

      {/* Charts Column */}
      <div className="flex flex-col mt-6 gap-8 pb-14">
        {/* User Progress Line Chart */}
        <div>
          <h2 className="text-base font-bold text-white mb-4">{t('Admin.home.userProgress', 'User Progress')}</h2>
          <GlassCard>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={lineData.length ? lineData : [{ value: 0, label: '--' }]}>
              <defs>
                <linearGradient id="colorMagenda" x1="0" y1="0" x2="0" y2="1">
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
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMagenda)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
        </div>

        {/* Session Traffic Bar Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">{t('Admin.home.sessionTraffic', 'Session Traffic')}</h2>
            <div className="flex gap-1">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
                  className="bg-white/10 text-white text-xs border border-white/10 rounded-xl px-3 py-1.5 outline-none focus:border-accent appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em', paddingRight: '2rem' }}
                >
                  <option value="week" className="bg-gray-800 text-white">Week</option>
                  <option value="month" className="bg-gray-800 text-white">Month</option>
                </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData.length ? barData : [{ value: 0, label: '--' }]} barCategoryGap="25%">
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {barData.map((entry, index) => {
                  const maxVal = Math.max(...barData.map(d => d.value));
                  const isMax = entry.value === maxVal && entry.value > 0;
                  return (
                    <Cell key={`cell-${index}`} fill={isMax ? '#C2AEBF' : '#FFFFFF'} fillOpacity={isMax ? 1 : 0.8} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};
