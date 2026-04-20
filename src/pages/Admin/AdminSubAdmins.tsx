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

const ALL_PERMISSIONS = [
  'view', 'edit', 'delete', 'suspend', 'accessAdminPanel',
  'manage_users', 'manage_listeners', 'view_reports', 'take_action',
  'view_financial', 'manage_sub_admins', 'manage_settings', 'export_data', 'manage_crisis',
];

const statusVariant = (status: string) =>
  status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'default';

export const AdminSubAdmins = () => {
  const navigate = useNavigate();
  const { getSubAdmins, createSubAdmin, deleteSubAdmin } = useAdmin();
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const fetchSubAdmins = async () => {
    try {
      const res = await getSubAdmins();
      setSubAdmins(res?.subAdmins ?? []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubAdmins(); }, []);

  const togglePerm = (perm: string) =>
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);

  const handleAdd = async () => {
    if (!newEmail.includes('@')) { setErrors({ email: 'Enter a valid email' }); return; }
    setAdding(true);
    try {
      // Build permissions object for native API compatibility
      const permissionsObj: Record<string, boolean> = {};
      ALL_PERMISSIONS.forEach(p => { permissionsObj[p] = selectedPerms.includes(p); });
      await createSubAdmin({ email: newEmail, permissions: permissionsObj });
      setAddModal(false);
      setNewEmail(''); setSelectedPerms([]);
      fetchSubAdmins();
    } catch { /* ignore */ } finally {
      setAdding(false);
    }
  };

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
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setAddModal(true)}>
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
            action={<Button variant="accent" size="sm" onClick={() => setAddModal(true)}>Add First Sub-Admin</Button>}
          />
        ) : (
          <div className="space-y-3">
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

      {/* Add Sub-Admin Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-3xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Add Sub-Admin</h2>

            <div className="space-y-4 mb-4">
              <Input
                label="Email Address"
                placeholder="admin@example.com"
                value={newEmail}
                onChange={e => { setNewEmail(e.target.value); setErrors({}); }}
                error={errors.email}
              />

              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Permissions</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map(perm => (
                    <button
                      key={perm}
                      onClick={() => togglePerm(perm)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium capitalize text-left transition-all ${
                        selectedPerms.includes(perm)
                          ? 'bg-accent/15 text-accent border border-accent/25'
                          : 'glass text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {perm.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="glass" fullWidth onClick={() => { setAddModal(false); setNewEmail(''); setSelectedPerms([]); }}>
                Cancel
              </Button>
              <Button variant="primary" fullWidth loading={adding} onClick={handleAdd}>
                Add Sub-Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
