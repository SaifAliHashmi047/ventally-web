import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, FileText, ChevronRight, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AdminListenerRequests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getListenerRequests } = useAdmin();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getListenerRequests(status);
      setRequests(res?.requests ?? res ?? []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status]);

  const filtered = requests.filter(req =>
    !search || req.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Admin.moderation.listenerRequests.title', 'Listener Requests')} />

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 bg-white/10 text-white text-sm border border-white/10 rounded-2xl px-4 py-2 outline-none focus:border-accent appearance-none cursor-pointer"
          >
            <option value="pending" className="bg-gray-800">Pending</option>
            <option value="verified" className="bg-gray-800">Verified</option>
            <option value="rejected" className="bg-gray-800">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No requests found"
            icon={<FileText size={22} />}
          />
        ) : (
          <div className="space-y-3 pb-24">
            {filtered.map((req) => (
              <GlassCard
                key={req.id}
                hover
                onClick={() => navigate(`/admin/listener-requests/${req.id}`)}
                className="cursor-pointer border-white/5"
                padding="md"
                rounded="2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg glass flex items-center justify-center border border-white/5">
                    <FileText size={20} className="text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{req.email || req.user?.email}</p>
                    <p className="text-xs text-white/40 mt-0.5">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={status === 'verified' ? 'success' : status === 'rejected' ? 'error' : 'warning'} className="capitalize rounded-full text-[10px] px-2.5 py-0.5 font-bold">
                      {req.status || status}
                    </Badge>
                    <ChevronRight size={18} className="text-white/20" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
