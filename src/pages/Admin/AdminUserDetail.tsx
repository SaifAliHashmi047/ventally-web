import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Mail, Phone, Calendar, Shield, Ban, CheckCircle, User } from 'lucide-react';

export const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserDetail, toggleUserStatus } = useAdmin();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    getUserDetail(id!)
      .then(res => setUser(res?.user ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: 'suspend' | 'activate' | 'ban') => {
    setActing(true);
    try {
      await toggleUserStatus(id!, action);
      setUser((prev: any) => ({ ...prev, isActive: action === 'activate' }));
      setActionModal(null);
    } catch { /* ignore */ } finally {
      setActing(false);
    }
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-10 w-48 rounded-2xl" /><div className="skeleton h-64 rounded-3xl" /></div>;
  if (!user) return <div className="page-wrapper"><PageHeader title="User Not Found" onBack={() => navigate(-1)} /></div>;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="User Detail" onBack={() => navigate('/admin/users')} />

      <GlassCard bordered>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-xl font-bold text-white">
            {(user.firstName?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.displayName || `${user.firstName} ${user.lastName}`}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user.userType === 'listener' ? 'accent' : 'primary'} className="capitalize">{user.userType}</Badge>
              <Badge variant={user.isActive ? 'success' : 'error'} dot>{user.isActive ? 'Active' : 'Suspended'}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Phone, label: 'Phone', value: user.phone || 'Not provided' },
            { icon: Calendar, label: 'Joined', value: new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
            { icon: User, label: 'Sessions', value: user.totalSessions ?? '0' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0"><Icon size={14} /></div>
              <div><p className="text-xs text-gray-500">{label}</p><p className="text-sm font-medium text-white mt-0.5">{value}</p></div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex gap-3">
        {user.isActive ? (
          <Button variant="danger" fullWidth leftIcon={<Ban size={16} />} onClick={() => setActionModal('suspend')}>Suspend User</Button>
        ) : (
          <Button variant="primary" fullWidth leftIcon={<CheckCircle size={16} />} onClick={() => setActionModal('activate')}>Activate User</Button>
        )}
        <Button variant="danger" size="md" leftIcon={<Shield size={16} />} onClick={() => setActionModal('ban')}>Ban</Button>
      </div>

      <Modal isOpen={!!actionModal} onClose={() => setActionModal(null)} title={`Confirm: ${actionModal} user`} size="sm">
        <p className="text-sm text-gray-400 mb-4">Are you sure you want to {actionModal} {user.displayName || user.email}?</p>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setActionModal(null)}>Cancel</Button>
          <Button variant="primary" fullWidth loading={acting} onClick={() => handleAction(actionModal as any)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
};
