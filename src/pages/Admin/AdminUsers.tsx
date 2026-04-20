import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, Users } from 'lucide-react';
import { Input } from '../../components/ui/Input';

const TABS = ['Venters', 'Listeners'] as const;
type Tab = typeof TABS[number];

const tabRole = (tab: Tab): 'venter' | 'listener' =>
  tab === 'Venters' ? 'venter' : 'listener';

const UserCard = ({ user, onClick }: { user: any; onClick: () => void }) => {
  const isBoth = user.accountType === 'both';
  return (
    <div
      className="glass rounded-2xl p-4 mb-3 cursor-pointer hover:bg-white/[0.06] transition-all"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-white truncate flex-1">
          {user.email}
        </p>
        {isBoth && (
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs text-white font-medium flex-shrink-0">
            Both
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">ID: {user.id}</p>
      <div className="flex gap-4">
        <p className="text-xs text-gray-400">
          Sessions: <span className="text-white font-medium">{user.stats?.totalSessions ?? 0}</span>
        </p>
        <p className="text-xs text-gray-400">
          Minutes: <span className="text-white font-medium">{user.stats?.totalMinutes ?? 0}</span>
        </p>
      </div>
    </div>
  );
};

export const AdminUsers = () => {
  const navigate = useNavigate();
  const { adminListUsers } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('Venters');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const LIMIT = 20;
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchUsers = useCallback(
    async (isRefresh = false, isLoadMore = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      try {
        const currentOffset = isRefresh ? 0 : offsetRef.current;
        const res = await adminListUsers(search || undefined, tabRole(activeTab), LIMIT, currentOffset);
        const fetched = res?.users ?? [];
        if (isRefresh) {
          setUsers(fetched);
          offsetRef.current = LIMIT;
        } else {
          setUsers(prev => [...prev, ...fetched]);
          offsetRef.current = currentOffset + LIMIT;
        }
        setTotal(res?.pagination?.total ?? res?.total ?? 0);
      } catch {
        /* ignore */
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeTab, search, adminListUsers],
  );

  // Refetch on tab change
  useEffect(() => {
    fetchUsers(true);
  }, [activeTab]);

  // Debounce search
  const isFirstSearch = useRef(true);
  useEffect(() => {
    if (isFirstSearch.current) { isFirstSearch.current = false; return; }
    const t = setTimeout(() => fetchUsers(true), 500);
    return () => clearTimeout(t);
  }, [search]);

  const handleLoadMore = () => {
    if (users.length < total && !loadingMore) fetchUsers(false, true);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-gray-500 mt-1">{total} total {activeTab.toLowerCase()}</p>
        </div>
        <button
          onClick={() => navigate('/admin/listener-requests')}
          className="glass px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          Listener Requests
        </button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by email or ID..."
        value={search}
        onChange={e => { setSearch(e.target.value); }}
        leftIcon={<Search size={16} />}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mt-4 mb-5">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); }}
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
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title={`No ${activeTab.toLowerCase()} found`}
          description="Try adjusting your search."
          icon={<Users size={22} />}
        />
      ) : (
        <>
          {users.map((u: any) => (
            <UserCard
              key={u.id}
              user={u}
              onClick={() => navigate(`/admin/users/${u.id}`)}
            />
          ))}

          {users.length < total && (
            <div className="flex justify-center mt-4">
              <Button
                variant="glass"
                size="sm"
                loading={loadingMore}
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
