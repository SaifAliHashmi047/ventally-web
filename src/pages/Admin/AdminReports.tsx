import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, AlertTriangle } from 'lucide-react';

const TABS = ['Pending', 'Resolved'] as const;
type Tab = typeof TABS[number];

const tabStatus = (tab: Tab) => tab.toLowerCase();

const formatDate = (s: string) => {
  if (!s) return '';
  const d = new Date(s);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const ReportCard = ({ report, onClick }: { report: any; onClick: () => void }) => (
  <div
    className="glass rounded-2xl p-4 mb-3 cursor-pointer hover:bg-white/[0.06] transition-all relative"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-white">
        #{report.id?.substring(0, 8)}
      </span>
      {report.reason && (
        <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-medium text-white">
          {report.reason}
        </span>
      )}
    </div>
    <p className="text-sm text-white/80 mb-0.5">
      Reported: <span className="text-gray-400">{report.reported_email}</span>
    </p>
    <p className="text-sm text-white/80 mb-2">
      By: <span className="text-gray-400">{report.reporter_email}</span>
    </p>
    {report.status === 'resolved' && report.resolution && (
      <p className="text-xs text-gray-500 mb-2">Result: {report.resolution}</p>
    )}
    <p className="text-xs text-gray-600 absolute bottom-3 right-4">{formatDate(report.created_at)}</p>
  </div>
);

export const AdminReports = () => {
  const navigate = useNavigate();
  const { getReports } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('Pending');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const LIMIT = 20;
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchReports = useCallback(async (isRefresh = false, isLoadMore = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentOffset = isRefresh ? 0 : offsetRef.current;
      const res = await getReports(tabStatus(activeTab), LIMIT, currentOffset);
      const fetched = res?.reports ?? [];

      if (isRefresh) {
        setReports(fetched);
        offsetRef.current = LIMIT;
      } else {
        setReports(prev => [...prev, ...fetched]);
        offsetRef.current = currentOffset + LIMIT;
      }
      setTotal(res?.pagination?.total ?? res?.total ?? 0);
    } catch { /* ignore */ } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, getReports]);

  useEffect(() => { fetchReports(true); }, [activeTab]);

  const isFirstSearch = useRef(true);
  useEffect(() => {
    if (isFirstSearch.current) { isFirstSearch.current = false; return; }
    const t = setTimeout(() => fetchReports(true), 500);
    return () => clearTimeout(t);
  }, [search]);

  // Client-side filter by search
  const filtered = reports.filter(r =>
    !search ||
    r.id?.toLowerCase().includes(search.toLowerCase()) ||
    r.reported_email?.toLowerCase().includes(search.toLowerCase()) ||
    r.reporter_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Moderation</h1>
        <p className="text-gray-500 mt-1">{total} total reports</p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by ID or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={<Search size={16} />}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mt-4 mb-5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white/10 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} reports`}
          description="All clear! No reports to review."
          icon={<AlertTriangle size={22} />}
        />
      ) : (
        <>
          {filtered.map((r: any) => (
            <ReportCard
              key={r.id}
              report={r}
              onClick={() => navigate(`/admin/reports/${r.id}`)}
            />
          ))}
          {reports.length < total && (
            <div className="flex justify-center mt-4">
              <Button variant="glass" size="sm" loading={loadingMore} onClick={() => fetchReports(false, true)}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
