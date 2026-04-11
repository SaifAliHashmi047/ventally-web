import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRecovery } from '../../api/hooks/useRecovery';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export const VenterJourneyDashboard = () => {
  const navigate = useNavigate();
  const { getProgressHistory } = useRecovery();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgressHistory(60, 0)
      .then(res => setProgress(res?.progress ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Journey Calendar" onBack={() => navigate(-1)} />
      {loading ? (
        <div className="skeleton h-64 rounded-3xl" />
      ) : progress.length === 0 ? (
        <EmptyState title="No entries yet" description="Log your first progress entry!" icon={<Calendar size={22} />} />
      ) : (
        <div className="space-y-2">
          {progress.map((p: any) => (
            <GlassCard key={p.id} padding="sm" rounded="2xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${p.status === 'success' ? 'bg-success' : p.status === 'slip' ? 'bg-error' : 'bg-warning'}`} />
                <p className="text-sm font-medium text-white capitalize">{p.status}</p>
                <p className="text-xs text-gray-500 ml-auto">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              {p.notes && <p className="text-xs text-gray-500 mt-1 ml-6">{p.notes}</p>}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
