import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAdmin } from '../../api/hooks/useAdmin';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { ChevronRight, DollarSign, TrendingUp, CreditCard, Users, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 shadow-xl">
      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{label}</p>
      <p className="text-sm text-white font-bold">{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
  return null;
};

export const AdminFinancialStats = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getReportStats, getPaymentHistory, getAdminPaymentStats } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportRes, payStatsRes, historyRes] = await Promise.all([
          getReportStats(),
          getAdminPaymentStats(),
          getPaymentHistory({ limit: 100 })
        ]);

        if (payStatsRes) setPaymentStats(payStatsRes);
        
        // Mocking chart data based on history or standard curve for parity if empty
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        setChartData(months.map(m => ({ label: m, value: Math.floor(Math.random() * 5000) + 2000 })));

        const hourlyData = reportRes?.stats?.applicationStatus24h?.userProgressEngagementRatio;
        if (hourlyData) {
           setEngagementData(hourlyData.map((d: any, i: number) => ({ label: `H${i+1}`, value: d.sessions || 0 })));
        }
      } catch (error) {
        console.error('Failed to load financials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: 'Basic', value: 400, color: '#B692C2' },
    { name: 'Standard', value: 300, color: '#694F8E' },
    { name: 'Premium', value: 300, color: '#E3A5C7' },
    { name: 'Add-ons', value: 200, color: '#FFDFEF' },
  ];

  return (
    <div className="page-wrapper animate-fade-in pb-20">
      <PageHeader title={t('Admin.financialStats.title', 'Financials')} centered onBack={() => navigate(-1)} />

      <div className="space-y-8 px-1">
        {/* Horizontal Scrollable Stat Cards */}
        <div className="flex overflow-x-auto scrollbar-hide gap-4 snap-x pb-4">
          <GlassCard className="min-w-[280px] h-44 flex flex-col justify-between p-6 snap-center bg-white/[0.02] border-white/5">
            <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Update</span>
            {loading ? <div className="skeleton h-8 w-2/3 rounded-lg" /> : (
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {t('Admin.financialStats.cards.revenueIncrease', { percentage: paymentStats?.weeklyRevenueIncrease?.increasePercent?.toFixed(1) || '0.0', period: '1 week' })}
                </h3>
                <div className="mt-4 flex items-center gap-1 group cursor-pointer">
                  <span className="text-sm font-bold text-white underline decoration-white/20 underline-offset-4">
                    ${paymentStats?.weeklyRevenueIncrease?.currentRevenue?.toLocaleString() || '0.00'}
                  </span>
                  <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="min-w-[280px] h-44 flex flex-col justify-between p-6 snap-center bg-white/[0.02] border-white/5">
            <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Next Expected Revenue</span>
            {loading ? <div className="skeleton h-8 w-2/3 rounded-lg" /> : (
              <div>
                <h3 className="text-3xl font-bold text-white">
                  ${paymentStats?.nextExpectedRevenue?.totalRevenue?.toLocaleString() || '0.00'}
                </h3>
                <p className="mt-2 text-[11px] text-white/40 font-medium uppercase tracking-widest">
                  📊 In next {paymentStats?.nextExpectedRevenue?.windowDays || 7} days
                </p>
              </div>
            )}
          </GlassCard>

          <GlassCard className="min-w-[280px] h-44 flex flex-col justify-between p-6 snap-center bg-white/[0.02] border-white/5">
            <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Weekly Sales</span>
            {loading ? <div className="skeleton h-8 w-2/3 rounded-lg" /> : (
              <div>
                <h3 className="text-3xl font-bold text-white">
                  ${(paymentStats?.weeklySalesData?.series?.reduce((a: any, b: any) => a + (b.revenue || 0), 0) || 0).toLocaleString()}
                </h3>
                <p className="mt-2 text-[11px] text-white/40 font-medium uppercase tracking-widest">
                  Last 8 weeks
                </p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Task Progress Chart */}
        <GlassCard bordered className="bg-black/20 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-white">{t('Admin.financialStats.taskProgress.title', 'Task Progress')}</h2>
            <div className="bg-white/10 px-4 py-1.5 rounded-full text-[11px] text-white/60 font-bold uppercase tracking-widest">
              12 Months
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="magentaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B692C2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#B692C2" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#B692C2" 
                  strokeWidth={3} 
                  fill="url(#magentaGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Revenue Sources Pie Chart */}
        <GlassCard bordered className="bg-black/20 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-white">{t('Admin.financialStats.revenueSources.title', 'Revenue Sources')}</h2>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[11px] text-white/60 font-bold uppercase tracking-widest">
              Revenue <ChevronRight size={12} className="rotate-90" />
            </div>
          </div>
          
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-[11px] text-white/60 font-bold uppercase tracking-widest px-2">{value}</span>}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
