import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRecovery } from '../../api/hooks/useRecovery';
import { TrendingUp, Calendar, Target, ChevronRight, Plus, Flame } from 'lucide-react';

export const VenterRecoveryDashboard = () => {
  const navigate = useNavigate();
  const { getDashboard } = useRecovery();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(res => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Recovery Dashboard"
        subtitle="Track your journey to wellness"
        rightContent={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/venter/recovery/log')}>
            Log Progress
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Current Streak"
              value={`${data?.streak?.current ?? 0} days`}
              icon={<Flame size={20} />}
              iconColor="#FF6B35"
              className="sm:col-span-2"
            />
            <StatCard
              label="Days Sober"
              value={data?.daysSober ?? 0}
              icon={<Target size={20} />}
              iconColor="#32D74B"
            />
          </div>

          {data?.recentProgress?.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-title">Recent Progress</h2>
                <button onClick={() => navigate('/venter/recovery/journey')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                  Full Journey <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {data.recentProgress.slice(0, 5).map((p: any) => (
                  <GlassCard key={p.id} padding="sm" rounded="2xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        p.status === 'success' ? 'bg-success' : p.status === 'slip' ? 'bg-error' : 'bg-warning'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white capitalize">{p.status}</p>
                        {p.notes && <p className="text-xs text-gray-500 truncate">{p.notes}</p>}
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No progress logged yet"
              description="Start logging your recovery journey!"
              icon={<TrendingUp size={22} />}
              action={
                <Button variant="accent" size="sm" onClick={() => navigate('/venter/recovery/log')}>
                  Log First Entry
                </Button>
              }
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="glass" leftIcon={<Calendar size={16} />} onClick={() => navigate('/venter/recovery/journey')}>
              Journey Calendar
            </Button>
            <Button variant="glass" leftIcon={<TrendingUp size={16} />} onClick={() => navigate('/venter/recovery/summary')}>
              Progress Summary
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
