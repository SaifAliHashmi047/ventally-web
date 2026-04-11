import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { useRecovery } from '../../api/hooks/useRecovery';
import { TrendingUp, Target, Flame, Calendar } from 'lucide-react';

export const VenterProgressSummary = () => {
  const navigate = useNavigate();
  const { getSummary } = useRecovery();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary('month')
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Progress Summary" onBack={() => navigate(-1)} />
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Success Days" value={summary?.successDays ?? 0} icon={<TrendingUp size={18} />} iconColor="#32D74B" />
            <StatCard label="Current Streak" value={`${summary?.currentStreak ?? 0}d`} icon={<Flame size={18} />} iconColor="#FF6B35" />
            <StatCard label="Total Days" value={summary?.totalDays ?? 0} icon={<Calendar size={18} />} iconColor="#C2AEBF" />
            <StatCard label="Best Streak" value={`${summary?.bestStreak ?? 0}d`} icon={<Target size={18} />} iconColor="#0A84FF" />
          </div>
          {summary?.notes && (
            <GlassCard>
              <p className="text-xs text-gray-500 mb-2">Insights</p>
              <p className="text-sm text-white">{summary.notes}</p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
};
