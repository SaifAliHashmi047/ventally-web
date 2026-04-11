import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Flag, ChevronRight, Search } from 'lucide-react';

export const AdminReports = () => {
  const navigate = useNavigate();
  const { getReports } = useAdmin();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getReports({ page, limit: LIMIT, status: filter });
        setReports(res?.reports ?? []);
        setTotal(res?.total ?? 0);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filter, page]);

  const STATUS_MAP: Record<string, { variant: any; label: string }> = {
    open: { variant: 'error', label: 'Open' },
    resolved: { variant: 'success', label: 'Resolved' },
    dismissed: { variant: 'default', label: 'Dismissed' },
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Reports" subtitle={`${total} total reports`} />

      <div className="flex gap-2">
        {['open', 'resolved', 'dismissed'].map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === s ? 'bg-error/15 text-error border border-error/25' : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : reports.length === 0 ? (
        <EmptyState title={`No ${filter} reports`} icon={<Flag size={22} />} />
      ) : (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <GlassCard key={report.id} hover onClick={() => navigate(`/admin/reports/${report.id}`)} padding="md" rounded="2xl" className="cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={STATUS_MAP[report.status]?.variant || 'default'} dot>
                      {STATUS_MAP[report.status]?.label || report.status}
                    </Badge>
                    <span className="text-xs text-gray-500">#{report.id?.slice(0, 8)}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{report.reason}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{report.details || 'No details provided'}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(report.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-500 flex-shrink-0 mt-1" />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {total > LIMIT && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {Math.ceil(total / LIMIT)}</p>
          <div className="flex gap-2">
            <Button variant="glass" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="glass" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};
