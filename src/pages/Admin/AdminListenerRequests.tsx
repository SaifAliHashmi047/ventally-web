import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { UserCheck, ChevronRight, Clock } from 'lucide-react';

export const AdminListenerRequests = () => {
  const navigate = useNavigate();
  const { getListenerRequests } = useAdmin();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getListenerRequests(filter);
        setRequests(res?.requests ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filter]);

  const STATUS_FILTERS = ['pending', 'approved', 'rejected'];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Listener Applications" subtitle="Review and approve listener verification requests" />

      <div className="flex gap-2">
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === s
                ? 'bg-accent/15 text-accent border border-accent/25'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState title={`No ${filter} requests`} icon={<UserCheck size={22} />} />
      ) : (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <GlassCard
              key={req.id}
              hover
              onClick={() => navigate(`/admin/listener-requests/${req.id}`)}
              padding="md"
              rounded="2xl"
              className="cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-base font-semibold text-white flex-shrink-0">
                  {(req.user?.firstName?.[0] || 'L').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">
                      {req.user?.displayName || `${req.user?.firstName} ${req.user?.lastName}`}
                    </p>
                    <Badge
                      variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}
                      dot
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{req.user?.email}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={11} />
                    Submitted {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
