import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, UserCircle, ChevronRight, Filter } from 'lucide-react';

export const AdminUsers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getUsers } = useAdmin();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers({ search, type: filterType !== 'all' ? filterType : undefined });
      setUsers(res?.users ?? []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filterType]);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Admin.users.title', 'Users')} />

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <Input
            placeholder={t('Admin.users.searchPlaceholder', 'Search users by name or email...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 bg-white/10 text-white text-sm border border-white/10 rounded-2xl px-4 py-2 outline-none focus:border-accent appearance-none cursor-pointer"
          >
            <option value="all" className="bg-gray-800">All Roles</option>
            <option value="venter" className="bg-gray-800">Venters</option>
            <option value="listener" className="bg-gray-800">Listeners</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-3xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            title={t('Admin.users.emptyTitle', 'No users found')}
            icon={<UserCircle size={22} />}
          />
        ) : (
          <div className="space-y-3 pb-24">
            {users.map((user) => (
              <GlassCard
                key={user.id}
                hover
                onClick={() => navigate(`/admin/users/${user.id}`)}
                className="cursor-pointer border-white/5"
                padding="md"
                rounded="2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-lg font-bold text-white/40 border border-white/5">
                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.displayName || 'Anonymous'}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant={user.userType === 'listener' ? 'accent' : 'default'} className="rounded-full text-[9px] uppercase tracking-wider px-2 py-0.5">
                        {user.userType || 'Venter'}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'success' : 'error'} dot className="rounded-full text-[9px] uppercase tracking-wider px-2 py-0.5">
                        {user.status || 'active'}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20" />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
