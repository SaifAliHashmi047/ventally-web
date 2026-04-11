import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Toggle } from '../../components/ui/Toggle';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { ShieldCheck, Lock, Edit } from 'lucide-react';

const ALL_PERMISSIONS = [
  'manage_users', 'manage_listeners', 'view_reports', 'take_action',
  'view_financial', 'manage_sub_admins', 'manage_settings', 'export_data', 'manage_crisis',
];

export const AdminRolesPermissions = () => {
  const { getRolesPermissions, updateRolePermissions } = useAdmin();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<any>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getRolesPermissions();
        setRoles(res?.roles ?? []);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const openEdit = (role: any) => {
    setEditModal(role);
    setEditPerms(role.permissions ?? []);
  };

  const togglePerm = (perm: string) => {
    setEditPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  const handleSave = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      await updateRolePermissions(editModal.role, editPerms);
      setRoles(prev => prev.map(r => r.role === editModal.role ? { ...r, permissions: editPerms } : r));
      setEditModal(null);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Roles & Permissions" subtitle="Manage what each role can access" />

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-48 rounded-3xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {roles.map((role: any) => (
            <GlassCard key={role.role} bordered>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center">
                    <ShieldCheck size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white capitalize">{role.role.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{role.permissions?.length ?? 0} permissions</p>
                  </div>
                </div>
                <Button variant="glass" size="sm" leftIcon={<Edit size={14} />} onClick={() => openEdit(role)}>
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(role.permissions ?? []).map((perm: string) => (
                  <Badge key={perm} variant="accent" className="capitalize">
                    {perm.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {(!role.permissions?.length) && (
                  <p className="text-sm text-gray-500">No permissions assigned</p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title={`Edit: ${editModal?.role?.replace(/_/g, ' ')}`} size="md">
        <div className="space-y-3 mb-6">
          {ALL_PERMISSIONS.map(perm => (
            <div key={perm} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <p className="text-sm text-white capitalize">{perm.replace(/_/g, ' ')}</p>
              <Toggle
                checked={editPerms.includes(perm)}
                onChange={() => togglePerm(perm)}
                size="sm"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setEditModal(null)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={saving} onClick={handleSave}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
};
