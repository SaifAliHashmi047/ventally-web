import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Plus, ShieldCheck, Search, ChevronRight } from 'lucide-react';

const statusVariant = (status: string) =>
  status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'default';

export const AdminSubAdmins = () => {
  const navigate = useNavigate();
  const { getSubAdmins } = useAdmin();
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const res = await getSubAdmins();
      setSubAdmins(res?.subAdmins ?? []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubAdmins(); }, []);

  const filtered = subAdmins.filter(sa =>
    !search ||
    sa.email?.toLowerCase().includes(search.toLowerCase()) ||
    sa.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Sub-Admins"
        subtitle="Manage platform administrators"
        rightContent={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/admin/sub-admins/add')}>
            Add Sub-Admin
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

      <div className="mt-4">
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No sub-admins yet"
            description="Add sub-admins to help manage the platform."
            icon={<ShieldCheck size={22} />}
            action={<Button variant="accent" size="sm" onClick={() => navigate('/admin/sub-admins/add')}>Add First Sub-Admin</Button>}
          />
        ) : (
          <div className="space-y-3 pb-24">
            {filtered.map((sa: any) => {
              const permCount = Array.isArray(sa.permissions)
                ? sa.permissions.length
                : Object.values(sa.permissions ?? {}).filter(Boolean).length;
              const role = sa.activeRole === 'sub_admin' ? 'Sub Admin' : 'Admin';

              return (
                <GlassCard
                  key={sa.id}
                  hover
                  onClick={() => navigate(`/admin/sub-admins/${sa.id}`)}
                  className="cursor-pointer"
                  padding="md"
                  rounded="2xl"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full glass-accent flex items-center justify-center text-base font-bold text-accent flex-shrink-0">
                      {(sa.email?.[0] || 'S').toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {sa.user?.displayName || sa.email}
                        </p>
                        <Badge variant={statusVariant(sa.status || 'active')} dot className="capitalize flex-shrink-0">
                          {sa.status || 'active'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{role} · {permCount} permission{permCount !== 1 ? 's' : ''}</p>
                    </div>

                    <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
