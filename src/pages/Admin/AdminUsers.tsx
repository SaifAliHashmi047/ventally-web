import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, Plus, ChevronRight, Shield, Trash2, Edit } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export const AdminUsers = () => {
  const navigate = useNavigate();
  const { getUsers, toggleUserStatus } = useAdmin();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        page,
        limit: LIMIT,
        search: search || undefined,
        type: filter !== 'all' ? filter : undefined,
      });
      setUsers(res?.users ?? []);
      setTotal(res?.total ?? 0);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, filter]);
  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const FILTERS = ['all', 'venter', 'listener'];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Users"
        subtitle={`${total} total users`}
      />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          leftIcon={<Search size={16} />}
          containerClassName="flex-1"
        />
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-primary/15 text-primary border border-primary/25'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <GlassCard padding="none" rounded="2xl">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="cursor-pointer" onClick={() => navigate(`/admin/users/${u.id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                          {(u.firstName?.[0] || u.displayName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.displayName || `${u.firstName} ${u.lastName}`}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={u.userType === 'listener' ? 'accent' : 'primary'} className="capitalize">
                        {u.userType}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={u.isActive ? 'success' : 'error'} dot>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <ChevronRight size={16} className="text-gray-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {Math.ceil(total / LIMIT)}
          </p>
          <div className="flex gap-2">
            <Button variant="glass" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="glass" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
