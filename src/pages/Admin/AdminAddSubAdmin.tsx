import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { useAdmin } from '../../api/hooks/useAdmin';
import { UserPlus, Check, Mail, Shield, Users, BarChart3, Bell } from 'lucide-react';

const PERMISSIONS = [
  { id: 'users', label: 'Manage Users', icon: Users, description: 'View and manage user accounts' },
  { id: 'reports', label: 'Manage Reports', icon: BarChart3, description: 'Review and take action on reports' },
  { id: 'listeners', label: 'Listener Requests', icon: UserPlus, description: 'Approve or reject listener applications' },
  { id: 'financial', label: 'Financial Stats', icon: Shield, description: 'View financial statistics and reports' },
  { id: 'notifications', label: 'Send Notifications', icon: Bell, description: 'Send system-wide notifications' },
];

export const AdminAddSubAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addSubAdmin } = useAdmin();

  const [email, setEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!email) {
      setError(t('AdminAddSubAdmin.emailRequired', 'Email is required'));
      return;
    }
    if (selectedPermissions.length === 0) {
      setError(t('AdminAddSubAdmin.permissionsRequired', 'Select at least one permission'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addSubAdmin({ email, permissions: selectedPermissions });
      navigate('/admin/sub-admins');
    } catch {
      setError(t('AdminAddSubAdmin.createFailed', 'Failed to create sub-admin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.addSubAdmin', 'Add Sub-Admin')}
        onBack={() => navigate(-1)}
      />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          {t('AdminAddSubAdmin.newSubAdmin', 'New Sub-Admin')}
        </h2>
        <p className="text-sm text-gray-400">
          {t('AdminAddSubAdmin.desc', 'Create a new sub-admin account with limited permissions')}
        </p>
      </div>

      <GlassCard className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('AdminAddSubAdmin.emailLabel', 'Email Address')}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                type="email"
                placeholder={t('AdminAddSubAdmin.emailPlaceholder', 'subadmin@example.com')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {t('AdminAddSubAdmin.selectPermissions', 'Select Permissions')}
        </h3>
        <p className="text-sm text-gray-400">
          {t('AdminAddSubAdmin.permissionsDesc', 'Choose what this sub-admin can access')}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {PERMISSIONS.map((perm) => {
          const Icon = perm.icon;
          const isSelected = selectedPermissions.includes(perm.id);
          return (
            <GlassCard
              key={perm.id}
              hover
              onClick={() => togglePermission(perm.id)}
              className={`cursor-pointer transition-all ${isSelected ? 'border-accent/50 bg-accent/5' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-accent/15' : 'glass'
                }`}>
                  <Icon size={18} className={isSelected ? 'text-accent' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{perm.label}</p>
                    {isSelected && <Check size={14} className="text-accent" />}
                  </div>
                  <p className="text-xs text-gray-500">{perm.description}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {error && (
        <div className="text-error text-sm mb-4 text-center">{error}</div>
      )}

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="flex-1"
          onClick={() => navigate(-1)}
        >
          {t('Common.cancel', 'Cancel')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          leftIcon={<UserPlus size={18} />}
          loading={loading}
          onClick={handleSubmit}
        >
          {t('AdminAddSubAdmin.create', 'Create Sub-Admin')}
        </Button>
      </div>
    </div>
  );
};
