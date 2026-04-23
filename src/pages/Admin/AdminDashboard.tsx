import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../../api/hooks/useAdmin';
import { StatCard } from '../../components/ui/StatCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { AdminHomeHeader } from '../../components/ui/AdminHomeHeader';
import {
  Users, TrendingUp, UserPlus, Clock,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

const formatNumber = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
const formatChange = (pct: number) => `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Aggregate hourly API data into 7 (week) or 12 (month) buckets.
 * Matches the RN AdminHome aggregation logic exactly.
 */
const buildChartData = (
  hourlyData: any[],
  period: 'week' | 'month',
  setLine: (d: any[]) => void,
  setBar: (d: any[]) => void,
) => {
  const BUCKETS = period === 'week' ? 7 : 12;
  const now = new Date();
  const bucketSize = Math.ceil(hourlyData.length / BUCKETS);

  const aggregated = Array.from({ length: BUCKETS }, (_, bi) => {
    const slice = hourlyData.slice(bi * bucketSize, (bi + 1) * bucketSize);
    const total = slice.reduce((s: number, x: any) => s + (x.activeUsers ?? 0), 0);

    let label: string;
    if (period === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - (BUCKETS - 1 - bi));
      label = DAYS[d.getDay()];
    } else {
      label = MONTHS[(now.getMonth() - (11 - bi) + 12) % 12];
    }
    return { value: total, label };
  });

  setLine(aggregated);
  setBar(aggregated);
};

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

  // Stable ref — prevents getReportStats from being a changing dep that re-triggers the effect
  const adminHook = useAdmin();
  const getReportStatsRef = useRef(adminHook.getReportStats);

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [lineData, setLineData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  // Fetch stats once on mount — period change rebuilds chart labels from cached data
  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getReportStatsRef.current();
        if (cancelled) return;

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
          buildChartData(hourlyData, period, setLineData, setBarData);
        }
      } catch (e) {
        console.error('Admin stats fetch failed:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in pb-14">
      {/* Header Matches Native HomeHeader */}
      <AdminHomeHeader 
        title={t('Admin.home.welcome')} 
        subtitle={t('Admin.home.adminStore')} 
      />

      <div className="px-1">
        <h2 className="text-lg font-bold text-white mb-4">{t('Admin.home.overview')}</h2>
        
        {/* Stats Grid - 2x2 to match native */}
        <div className="grid grid-cols-2 gap-4 mb-8">
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

        {/* User Progress Line Chart - Matches Native Params */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-white mb-4">{t('Admin.home.userProgress')}</h3>
          <GlassCard>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={lineData.length ? lineData : [{ value: 0, label: '--' }]}>
                <defs>
                  <linearGradient id="colorMagenda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C2AEBF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C2AEBF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#C2AEBF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMagenda)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Session Traffic Bar Chart - Matches Native Highlighting */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">{t('Admin.home.sessionTraffic')}</h3>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
              className="bg-white/10 text-white text-xs border border-white/10 rounded-xl px-3 py-1.5 outline-none focus:border-accent"
            >
              <option value="week" className="bg-gray-800 text-white">{t('Common.week', 'Week')}</option>
              <option value="month" className="bg-gray-800 text-white">{t('Common.month', 'Month')}</option>
            </select>
          </div>
          
          <GlassCard>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData.length ? barData : [{ value: 0, label: '--' }]} barGap={8}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={20}>
                  {barData.map((entry, index) => {
                    const maxVal = Math.max(...barData.map(d => d.value));
                    const isMax = entry.value === maxVal && entry.value > 0;
                    return (
                      <Cell key={`cell-${index}`} fill={isMax ? '#C2AEBF' : 'rgba(255,255,255,0.8)'} />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
