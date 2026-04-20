import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Search, ShieldCheck } from 'lucide-react';

const PERMISSIONS = ['view', 'edit', 'delete', 'suspend', 'accessAdminPanel'];

const PERMISSION_LABELS: Record<string, string> = {
  view: 'View Content',
  edit: 'Edit Content',
  delete: 'Delete Content',
  suspend: 'Suspend Users',
  accessAdminPanel: 'Access Admin Panel',
};

export const AdminRolesPermissions = () => {
  const navigate = useNavigate();
  const { getSubAdmins, deleteSubAdmin, updateSubAdminPermissions } = useAdmin();

  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actioning, setActioning] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const fetchSubAdmins = async () => {
    try {
      const res = await getSubAdmins();
      setSubAdmins(res?.subAdmins ?? []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubAdmins(); }, []);

  const filtered = subAdmins.filter(sa =>
    !search || sa.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleRemove = async () => {
    if (!selectedIds.length || !confirm(`Remove ${selectedIds.length} sub-admin(s)?`)) return;
    setActioning(true);
    try {
      await Promise.all(selectedIds.map(id => deleteSubAdmin(id)));
      setSelectedIds([]);
      fetchSubAdmins();
    } catch { /* ignore */ } finally {
      setActioning(false);
    }
  };

  const openChangeRole = () => {
    // Pre-fill permissions from first selected (if single)
    if (selectedIds.length === 1) {
      const sa = subAdmins.find(a => a.id === selectedIds[0]);
      if (sa) {
        const perms: string[] = Array.isArray(sa.permissions)
          ? sa.permissions
          : Object.entries(sa.permissions ?? {}).filter(([, v]) => v).map(([k]) => k);
        setSelectedPerms(perms);
      }
    } else {
      setSelectedPerms([]);
    }
    setShowPermModal(true);
  };

  const handleSavePermissions = async () => {
    setActioning(true);
    try {
      const permissionsObj: Record<string, boolean> = {};
      PERMISSIONS.forEach(p => { permissionsObj[p] = selectedPerms.includes(p); });
      await Promise.all(selectedIds.map(id => updateSubAdminPermissions(id, { permissions: permissionsObj })));
      setSelectedIds([]);
      setShowPermModal(false);
      fetchSubAdmins();
    } catch { /* ignore */ } finally {
      setActioning(false);
    }
  };

  const permCount = (sa: any): number =>
    Array.isArray(sa.permissions)
      ? sa.permissions.length
      : Object.values(sa.permissions ?? {}).filter(Boolean).length;

  return (
    <div className="page-wrapper animate-fade-in pb-28">
      <PageHeader title="Roles & Permissions" />

      {/* Search */}
      <Input
        placeholder="Search sub-admins..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={<Search size={16} />}
      />

      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No sub-admins found" icon={<ShieldCheck size={22} />} />
        ) : (
          <GlassCard padding="none" rounded="2xl">
            {filtered.map((sa, i) => {
              const isSelected = selectedIds.includes(sa.id);
              const count = permCount(sa);
              const role = sa.activeRole === 'sub_admin' ? 'Sub Admin' : 'Admin';

              return (
                <div
                  key={sa.id}
                  onClick={() => navigate(`/admin/sub-admins/${sa.id}`)}
                  className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors ${
                    i < filtered.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    onClick={e => { e.stopPropagation(); toggleSelect(sa.id); }}
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent border-accent'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L4 8.56 1.72 6.28a1 1 0 00-1.41 1.41l3 3a1 1 0 001.41 0l7-7a1 1 0 00-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{sa.email}</p>
                    <p className="text-xs text-gray-500">{count} permissions enabled</p>
                  </div>

                  {/* Role badge */}
                  <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium text-white/70 flex-shrink-0">
                    {role}
                  </span>
                </div>
              );
            })}
          </GlassCard>
        )}
      </div>

      {/* Bottom Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Button
              variant="danger"
              fullWidth
              loading={actioning}
              onClick={handleRemove}
              disabled={actioning}
            >
              Remove ({selectedIds.length})
            </Button>
            <Button
              variant="glass"
              fullWidth
              onClick={openChangeRole}
              disabled={actioning}
            >
              Change Role
            </Button>
          </div>
        </div>
      )}

      {/* Permission Picker Modal */}
      {showPermModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-3xl p-6 w-full max-w-md border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Select Permissions</h2>

            {/* Select / Deselect All */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedPerms(PERMISSIONS)}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                  selectedPerms.length === PERMISSIONS.length
                    ? 'bg-white/10 border-white/40 text-white'
                    : 'border-white/20 text-gray-400'
                }`}
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedPerms([])}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                  selectedPerms.length === 0
                    ? 'bg-white/10 border-white/40 text-white'
                    : 'border-white/20 text-gray-400'
                }`}
              >
                Deselect All
              </button>
            </div>

            {/* Permission List */}
            <div className="space-y-2 mb-6">
              {PERMISSIONS.map(perm => (
                <div key={perm} className="glass rounded-xl flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-white">{PERMISSION_LABELS[perm]}</span>
                  <Toggle
                    checked={selectedPerms.includes(perm)}
                    onChange={() =>
                      setSelectedPerms(prev =>
                        prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
                      )
                    }
                    size="sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="glass" fullWidth onClick={() => setShowPermModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                fullWidth
                loading={actioning}
                disabled={selectedPerms.length === 0}
                onClick={handleSavePermissions}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
