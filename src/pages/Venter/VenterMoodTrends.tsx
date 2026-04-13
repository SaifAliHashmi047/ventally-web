import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useMood } from '../../api/hooks/useMood';
import { MOOD_CONFIG, type MoodType } from '../../components/ui/MoodSelector';
import { MoodBarChart } from '../../components/charts/MoodBarChart';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <p className="text-white font-semibold">{label}</p>
      <p className="text-gray-400 capitalize">{payload[0]?.payload?.label}: {payload[0]?.value}</p>
    </div>
  );
  return null;
};

export const VenterMoodTrends = () => {
  const { getMoodStats } = useMood();
  const [distribution, setDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMoodStats(30);
        if (res?.mood_distribution) {
          const allMoods = ['happy', 'neutral', 'sad', 'anxious', 'mad'];
          const moodMap: Record<string, number> = {};
          res.mood_distribution.forEach((d: any) => {
            if (d.mood_type) moodMap[d.mood_type.toLowerCase()] = parseInt(d.count, 10);
          });
          setDistribution(allMoods.map(m => ({ value: moodMap[m] || 0, label: m })));
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const total = distribution.reduce((sum, d) => sum + d.value, 0);
  const topMood = distribution.reduce((best, d) => d.value > best.value ? d : best, { value: 0, label: '' });

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Mood Trends" subtitle="Your mood patterns over the last 30 days" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <GlassCard>
          <p className="text-xs text-gray-500 mb-1">Total Logs</p>
          <p className="text-xl font-bold text-white">{total}</p>
        </GlassCard>
        {topMood.label && (
          <GlassCard className="sm:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Dominant Mood</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{MOOD_CONFIG[topMood.label as MoodType]?.emoji}</span>
              <p className="text-xl font-bold capitalize" style={{ color: MOOD_CONFIG[topMood.label as MoodType]?.text }}>
                {topMood.label}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{topMood.value} days</p>
          </GlassCard>
        )}
      </div>

      {/* Bar Chart */}
      {loading ? (
        <div className="skeleton h-48 rounded-3xl" />
      ) : (
        <GlassCard>
          <p className="section-title mb-4">Mood Distribution</p>
          <MoodBarChart data={distribution} />
        </GlassCard>
      )}

      {/* Mood Breakdown */}
      <GlassCard padding="none" rounded="2xl">
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-base font-semibold text-white">Breakdown</p>
        </div>
        {distribution.map((d, i) => {
          const config = MOOD_CONFIG[d.label as MoodType];
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={d.label} className={`px-5 py-3 flex items-center gap-4 ${i < distribution.length - 1 ? 'border-b border-white/5' : ''}`}>
              <span className="text-xl w-8 text-center">{config?.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <p className="text-sm font-medium capitalize" style={{ color: config?.text }}>{d.label}</p>
                  <p className="text-sm font-semibold text-white">{pct}%</p>
                </div>
                <div className="h-1.5 rounded-full bg-white/8">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: config?.text }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 w-10 text-right">{d.value}d</p>
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
};
