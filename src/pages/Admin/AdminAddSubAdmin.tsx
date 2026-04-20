import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { GlassModal } from '../../components/ui/GlassModal';
import { useAdmin } from '../../api/hooks/useAdmin';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminAddSubAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createSubAdmin } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Native app permissions list
  const PERMISSIONS = [
    { key: 'view', label: 'View Content' },
    { key: 'edit', label: 'Edit Content' },
    { key: 'delete', label: 'Delete Content' },
    { key: 'suspend', label: 'Suspend Users' },
    { key: 'accessAdminPanel', label: 'Access Admin Panel' }
  ];

  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {})
  );

  const togglePermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreate = async () => {
    if (!email || !password) {
      toast.error(t('Admin.addSubAdmin.emptyFields', 'Please fill in all fields'));
      return;
    }

    setLoading(true);
    try {
      await createSubAdmin({
        email,
        password,
        permissions
      });
      setShowSuccess(true);
      
      // Native flow: Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Common.error', 'Failed to create sub-admin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto">
      <PageHeader
        title={t('Admin.addSubAdmin.title', 'Add Sub Admin')}
        onBack={() => navigate(-1)}
      />

      <div className="space-y-6 pb-24">
        {/* Form Inputs (Pill shaped) */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2 ml-1">
              {t('Admin.addSubAdmin.email', 'Email Address')}
            </label>
            <Input
              type="email"
              placeholder={t('Admin.addSubAdmin.emailPlaceholder', 'Enter email address')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full !bg-black/20 border-white/20 h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2 ml-1">
              {t('Admin.addSubAdmin.password', 'Password')}
            </label>
            <Input
              type="password"
              placeholder={t('Admin.addSubAdmin.passwordPlaceholder', 'Set password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full !bg-black/20 border-white/20 h-12"
            />
          </div>
        </div>

        {/* Permissions Card */}
        <GlassCard padding="none" rounded="2.5rem" className="overflow-hidden bg-black/10 border-white/5">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-base font-bold text-white text-center">
              {t('Admin.addSubAdmin.permissions', 'Permissions')}
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {PERMISSIONS.map((perm) => (
              <div key={perm.key} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-medium text-white/90">{perm.label}</span>
                <Toggle
                  checked={permissions[perm.key]}
                  onChange={() => togglePermission(perm.key)}
                  size="sm"
                  /** Native switch color #3E3E6A */
                  className="[&>[data-state=checked]]:bg-[#3E3E6A]" 
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Create Button (Pill shaped) */}
        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleCreate}
            loading={loading}
            className="rounded-full h-14 text-base font-bold shadow-lg shadow-primary/20"
          >
            {t('Admin.addSubAdmin.create', 'Create')}
          </Button>
        </div>
      </div>

      {/* Success Modal (Native Match) */}
      <GlassModal
        isOpen={showSuccess}
        onClose={() => {}}
        showCloseButton={false}
      >
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4 border border-success/30">
            <Check size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('Common.success', 'Success')}
          </h2>
          <p className="text-white/60 mb-6">
            {t('Admin.addSubAdmin.successMsg', 'Sub Admin account has been created successfully.')}
          </p>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-success animate-progress-3s" />
          </div>
          <p className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">
            {t('Common.redirecting', 'Redirecting...')}
          </p>
        </div>
      </GlassModal>
    </div>
  );
};
