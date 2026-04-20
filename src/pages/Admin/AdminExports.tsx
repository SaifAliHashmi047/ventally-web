import { useState, useEffect, useCallback, useRef } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, Download, Loader2, Package, CheckCircle2 } from 'lucide-react';

const TABS = ['Venters', 'Listeners'] as const;
type Tab = typeof TABS[number];
const tabRole = (tab: Tab): 'venter' | 'listener' => tab === 'Venters' ? 'venter' : 'listener';

export const AdminExports = () => {
  const { getIntegrations, updateExportStatus, exportIntegrationsPDF } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('Venters');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const LIMIT = 20;
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchItems = useCallback(async (isRefresh = false, isLoadMore = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentOffset = isRefresh ? 0 : offsetRef.current;
      const res = await getIntegrations(search || undefined, tabRole(activeTab), undefined, LIMIT, currentOffset);
      const data = res?.items ?? res?.users ?? [];
      if (isRefresh) {
        setItems(data);
        offsetRef.current = LIMIT;
      } else {
        setItems(prev => [...prev, ...data]);
        offsetRef.current = currentOffset + LIMIT;
      }
      setTotal(res?.pagination?.total ?? res?.total ?? 0);
    } catch { /* ignore */ } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, search, getIntegrations]);

  useEffect(() => { fetchItems(true); }, [activeTab]);

  const isFirstSearch = useRef(true);
  useEffect(() => {
    if (isFirstSearch.current) { isFirstSearch.current = false; return; }
    const t = setTimeout(() => fetchItems(true), 500);
    return () => clearTimeout(t);
  }, [search]);

  const handleToggleExport = async (item: any) => {
    const isExported = item.exportStatus === 'exported';
    setExportingId(item.id);
    try {
      if (!isExported) {
        await updateExportStatus(item.id, { exportStatus: 'exported' });
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, exportStatus: 'exported' } : i));
      } else {
        // Already exported → download PDF for this user
        const blob = await exportIntegrationsPDF(undefined, undefined, undefined, 250, item.id);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_export_${item.id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* ignore */ } finally {
      setExportingId(null);
    }
  };

  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const blob = await exportIntegrationsPDF(search || undefined, tabRole(activeTab));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exports_${tabRole(activeTab)}_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Exports & Integrations"
        subtitle={`${total} ${activeTab.toLowerCase()}`}
        rightContent={
          <Button
            variant="glass"
            size="sm"
            leftIcon={exportingAll ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            loading={exportingAll}
            onClick={handleExportAll}
          >
            Export All
          </Button>
        }
      />

      {/* Search */}
      <Input
        placeholder="Search by email or ID..."
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
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your search or filters."
          icon={<Package size={22} />}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => {
            const isExported = item.exportStatus === 'exported';
            const isExportingThis = exportingId === item.id;

            return (
              <GlassCard key={item.id} bordered padding="none" rounded="2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate">{item.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ID: {item.id}</p>
                  </div>
                  <span className="ml-3 px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-medium text-white/70 capitalize flex-shrink-0">
                    {item.accountType ?? tabRole(activeTab)}
                  </span>
                </div>

                {/* Stats row */}
                <p className="text-xs text-gray-500 px-4 pb-2">
                  Sessions: <span className="text-white">{item.stats?.totalSessions ?? 0}</span>
                  &nbsp;·&nbsp;
                  Minutes: <span className="text-white">{item.stats?.totalMinutes ?? 0}</span>
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-0 border-t border-b border-white/10">
                  {[
                    { label: 'Total Sessions', value: (item.stats?.totalSessions ?? 0).toLocaleString() },
                    { label: 'Total Minutes', value: (item.stats?.totalMinutes ?? 0).toLocaleString() },
                    { label: 'Total Payout', value: `$${(item.stats?.totalPayout ?? 0).toLocaleString()}` },
                  ].map((s, i, arr) => (
                    <div key={s.label} className={`p-3 ${i < arr.length - 1 ? 'border-r border-white/10' : ''}`}>
                      <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                      <p className="text-xl font-bold text-white">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Export button */}
                <div className="px-4 py-3">
                  <Button
                    variant={isExported ? 'glass' : 'primary'}
                    fullWidth
                    size="sm"
                    loading={isExportingThis}
                    leftIcon={
                      isExportingThis
                        ? <Loader2 size={14} className="animate-spin" />
                        : isExported
                          ? <Download size={14} />
                          : <CheckCircle2 size={14} />
                    }
                    onClick={() => handleToggleExport(item)}
                  >
                    {isExportingThis ? '…' : isExported ? 'Download PDF' : 'Mark Exported'}
                  </Button>
                </div>
              </GlassCard>
            );
          })}

          {items.length < total && (
            <div className="flex justify-center mt-2">
              <Button variant="glass" size="sm" loading={loadingMore} onClick={() => fetchItems(false, true)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
