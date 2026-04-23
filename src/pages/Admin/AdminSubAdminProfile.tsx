import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Toggle } from '../../components/ui/Toggle';
import { useAdmin } from '../../api/hooks/useAdmin';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { GlassModal } from '../../components/ui/GlassModal';
import { CheckCircle } from 'lucide-react';

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

export const AdminSubAdminProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSubAdminDetail, updateSubAdminPermissions, deleteSubAdmin } = useAdmin();
  const { t } = useTranslation()
  const [subAdmin, setSubAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    getSubAdminDetail(id)
      .then((res: any) => {
        const sa = res?.subAdmin ?? res;
        setSubAdmin(sa);
        // Normalise permissions to boolean map
        if (sa?.permissions) {
          if (Array.isArray(sa.permissions)) {
            const obj: Record<string, boolean> = {};
            sa.permissions.forEach((p: string) => { obj[p] = true; });
            setPermissions(obj);
          } else {
            setPermissions(sa.permissions);
          }
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const togglePermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateSubAdminPermissions(id!, { permissions });
      setShowSuccessModal(true);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleRemove = async () => {
    setIsDeleteModalVisible(false);
    setRemoving(true);
    try {
      await deleteSubAdmin(id!);
      toast.success(t('Admin.success.adminDeleted', 'Sub Admin removed successfully'));
      navigate('/admin/sub-admins');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Common.error', 'Error removing sub admin'));
    } finally {
      setRemoving(false);
    }
  };

  const statusVariant = (status: string) =>
    status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'default';

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-10 w-48 rounded-2xl" />
      <div className="skeleton h-32 rounded-3xl" />
      <div className="skeleton h-64 rounded-3xl" />
    </div>
  );

  if (!subAdmin) return (
    <div className="page-wrapper page-wrapper--wide">
      <PageHeader title="Sub-Admin Not Found" onBack={() => navigate(-1)} />
    </div>
  );

  const permKeys = Object.keys(permissions).length > 0
    ? Object.keys(permissions)
    : Object.keys(PERMISSION_LABELS);

  return (
    <div className="  animate-fade-in">
      <PageHeader title="Sub-Admin Profile" onBack={() => navigate('/admin/sub-admins')} />

      {/* Profile Card */}
      <GlassCard bordered className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-lg font-bold text-white">
            {(subAdmin.email?.[0] || 'S').toUpperCase()}
          </div>
          <Badge variant={statusVariant(subAdmin.status || 'active')} dot className="capitalize">
            {subAdmin.status || 'active'}
          </Badge>
        </div>

        <p className="text-lg font-bold text-white mb-1">{subAdmin.email}</p>
        <div className="space-y-0.5 text-sm text-gray-400">
          <p>ID: <span className="text-white/70">{subAdmin.id}</span></p>
          <p>Role: <span className="text-white/70 capitalize">{(subAdmin.userType || subAdmin.activeRole || 'sub_admin').replace('_', ' ')}</span></p>
        </div>
      </GlassCard>

      {/* Permissions Card */}
      <GlassCard bordered className="mb-4" padding="none">
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-base font-semibold text-white text-center">Permissions</p>
        </div>
        <div className="divide-y divide-white/5">
          {permKeys.map(key => (
            <div key={key} className="flex items-center justify-between px-5 py-3.5">
              <p className="text-sm text-white">
                {PERMISSION_LABELS[key] || key.replace(/_/g, ' ')}
              </p>
              <Toggle
                checked={!!permissions[key]}
                onChange={() => togglePermission(key)}
                size="sm"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Actions */}
      <Button variant="primary" fullWidth loading={saving} onClick={handleUpdate} className='mb-3 mt-5' >
        Update Permissions
      </Button>
      <Button
        variant="danger"
        fullWidth
        loading={removing}
        onClick={() => setIsDeleteModalVisible(true)}
      >
        {t('Common.remove', 'Remove Sub-Admin')}
      </Button>

      <GlassModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        icon={<CheckCircle className="text-accent" />}
        title={t('Admin.success.permissionsUpdated', 'Permissions Updated')}
        message={t('Admin.success.permissionsSubtitle', 'The sub-admin permissions have been successfully updated.')}
        primaryButtonText={t('Common.done', 'Done')}
        onPrimaryPress={() => navigate('/admin/sub-admins')}
      />

      <GlassModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        title={t('Admin.subAdminProfile.deleteConfirmTitle', 'Remove Sub Admin')}
        message={t('Admin.subAdminProfile.deleteConfirmMessage', 'Are you sure you want to remove this sub admin? This action cannot be undone.')}
        primaryButtonText={t('Common.remove', 'Remove')}
        onPrimaryPress={handleRemove}
        secondaryButtonText={t('Common.cancel', 'Cancel')}
        onSecondaryPress={() => setIsDeleteModalVisible(false)}
      />
    </div>
  );
};
