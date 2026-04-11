import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Plus, ShieldCheck, Trash2, Edit, ChevronRight } from 'lucide-react';

const ALL_PERMISSIONS = [
  'manage_users', 'manage_listeners', 'view_reports', 'take_action',
  'view_financial', 'manage_sub_admins', 'manage_settings', 'export_data', 'manage_crisis',
];

export const AdminSubAdmins = () => {
  const navigate = useNavigate();
  const { getSubAdmins, addSubAdmin, removeSubAdmin } = useAdmin();
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const togglePerm = (perm: string) => {
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  const handleAdd = async () => {
    if (!newEmail.includes('@')) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    setAdding(true);
    try {
      await addSubAdmin({ email: newEmail, permissions: selectedPerms });
      setAddModal(false);
      setNewEmail(''); setSelectedPerms([]);
      fetchSubAdmins();
    } catch { /* ignore */ } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this sub-admin?')) return;
    try {
      await removeSubAdmin(id);
      setSubAdmins(prev => prev.filter(s => s.id !== id));
    } catch { /* ignore */ }
  };

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

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : subAdmins.length === 0 ? (
        <EmptyState
          title="No sub-admins yet"
          description="Add sub-admins to help manage the platform."
          icon={<ShieldCheck size={22} />}
          action={<Button variant="accent" size="sm" onClick={() => setAddModal(true)}>Add First Sub-Admin</Button>}
        />
      ) : (
        <div className="space-y-3">
          {subAdmins.map((sa: any) => (
            <GlassCard key={sa.id} padding="md" rounded="2xl">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full glass-accent flex items-center justify-center text-base font-bold text-accent">
                  {(sa.user?.firstName?.[0] || sa.email?.[0] || 'S').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{sa.user?.displayName || sa.user?.email || sa.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(sa.permissions ?? []).slice(0, 3).map((p: string) => (
                      <Badge key={p} variant="default" size="sm" className="capitalize">{p.replace(/_/g, ' ')}</Badge>
                    ))}
                    {sa.permissions?.length > 3 && (
                      <Badge variant="default" size="sm">+{sa.permissions.length - 3} more</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/sub-admins/${sa.id}`)}
                    className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleRemove(sa.id)}
                    className="p-2 rounded-xl glass text-gray-400 hover:text-error transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Sub-Admin" size="md">
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
          <Button variant="glass" fullWidth onClick={() => setAddModal(false)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={adding} onClick={handleAdd}>Add Sub-Admin</Button>
        </div>
      </Modal>
    </div>
  );
};
