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
import { toast } from 'react-toastify';
import { GlassModal } from '../../components/ui/GlassModal';
import { useTranslation } from 'react-i18next';

const PERMISSIONS = [
  'view', 'edit', 'delete', 'suspend', 'accessAdminPanel',
  'manage_users', 'manage_listeners', 'view_reports', 'take_action',
  'view_financial', 'manage_sub_admins', 'manage_settings', 'export_data', 'manage_crisis',
];

const PERMISSION_LABELS: Record<string, string> = {
  view: 'View Content',
  edit: 'Edit Content',
  delete: 'Delete Content',
  suspend: 'Suspend Users',
  accessAdminPanel: 'Access Admin Panel',
  manage_users: 'Manage Users',
  manage_listeners: 'Manage Listeners',
  view_reports: 'View Reports',
  take_action: 'Take Action',
  view_financial: 'View Financial',
  manage_sub_admins: 'Manage Sub-Admins',
  manage_settings: 'Manage Settings',
  export_data: 'Export Data',
  manage_crisis: 'Manage Crisis',
};

export const AdminRolesPermissions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getSubAdmins, deleteSubAdmin, updateSubAdminPermissions } = useAdmin();

  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actioning, setActioning] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    !search || sa.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleRemove = async () => {
    setShowDeleteModal(false);
    setActioning(true);
    try {
      await Promise.all(selectedIds.map(id => deleteSubAdmin(id)));
      toast.success(t('Admin.success.adminDeleted', 'Sub Admin(s) removed successfully'));
      setSelectedIds([]);
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Common.error', 'Error removing sub admin(s)'));
    } finally {
      setActioning(false);
    }
  };

  const openChangeRole = () => {
    if (selectedIds.length === 1) {
      const sa = subAdmins.find(a => a.id === selectedIds[0]);
      if (sa) {
        let perms: string[] = [];
        if (Array.isArray(sa.permissions)) {
          perms = sa.permissions;
        } else if (sa.permissions) {
          perms = Object.entries(sa.permissions).filter(([, v]) => v).map(([k]) => k);
        }
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
      toast.success('Permissions updated');
    } catch { 
      toast.error('Failed to update permissions');
    } finally {
      setActioning(false);
    }
  };

  const permCount = (sa: any): number =>
    Array.isArray(sa.permissions)
      ? sa.permissions.length
      : Object.values(sa.permissions ?? {}).filter(Boolean).length;

  return (
    <div className="page-wrapper animate-fade-in pb-28">
      <PageHeader title="Roles & Permissions" onBack={() => navigate('/admin/settings')} />

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
          <GlassCard padding="none" rounded="2xl" bordered>
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
                    className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent border-accent text-white'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{sa.email}</p>
                    <p className="text-xs text-gray-500">{count} permissions enabled</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider flex-shrink-0">
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
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 border-t border-white/10 bg-black/80 backdrop-blur-xl animate-slide-up">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Button
              variant="danger"
              fullWidth
              loading={actioning}
              onClick={() => setShowDeleteModal(true)}
              disabled={actioning}
              className="rounded-full h-12"
            >
              {t('Common.remove', 'Remove')} ({selectedIds.length})
            </Button>
            <Button
              variant="glass"
              fullWidth
              onClick={openChangeRole}
              disabled={actioning}
              className="rounded-full h-12 border-white/10"
            >
              Change Role
            </Button>
          </div>
        </div>
      )}

      {/* Permission Picker Modal */}
      {showPermModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark rounded-[2.5rem] p-8 w-full max-w-md border border-white/10 overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Permissions</h2>

            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3 mb-8 scrollbar-hide">
              {PERMISSIONS.map(perm => (
                <div key={perm} className="glass rounded-2xl flex items-center justify-between px-5 py-4 border border-white/5">
                  <span className="text-sm font-medium text-white/80">{PERMISSION_LABELS[perm]}</span>
                  <Toggle
                    checked={selectedPerms.includes(perm)}
                    onChange={() =>
                      setSelectedPerms(prev =>
                        prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
                      )
                    }
                    size="sm"
                    className="[&>[data-state=checked]]:bg-[#3E3E6A]"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                fullWidth 
                loading={actioning}
                disabled={selectedPerms.length === 0} 
                onClick={handleSavePermissions}
                className="rounded-full h-14 font-bold"
              >
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                fullWidth 
                onClick={() => setShowPermModal(false)}
                className="rounded-full h-12 text-white/40"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('Admin.subAdminProfile.deleteConfirmTitle', 'Remove Sub Admin')}
        description={t('Admin.subAdminProfile.deleteConfirmMessage', 'Are you sure you want to remove the selected sub admin(s)? This action cannot be undone.')}
        primaryAction={{
          label: t('Common.remove', 'Remove'),
          onClick: handleRemove,
        }}
        secondaryAction={{
          label: t('Common.cancel', 'Cancel'),
          onClick: () => setShowDeleteModal(false),
        }}
      />
    </div>
  );
};
