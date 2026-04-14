import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiInstance from '../../api/apiInstance';
import { Mail, CheckCircle } from 'lucide-react';

export const UpdateEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!newEmail.includes('@')) return 'Please enter a valid email address.';
    if (!currentPassword) return 'Please enter your current password to confirm.';
    return '';
  };

  const handleUpdate = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await apiInstance.post('security/update-credential', {
        type: 'email',
        newValue: newEmail,
        password: currentPassword,
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.error || e?.message || 'Failed to update email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('Security.changeEmail', 'Change Email')} onBack={() => navigate(-1)} />
        <GlassCard bordered className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-success" />
          </div>
          <p className="text-lg font-bold text-white mb-2">Email Updated</p>
          <p className="text-sm text-gray-500 mb-6">
            A verification link may have been sent to your new email address.
          </p>
          <Button variant="primary" onClick={() => navigate(-2)}>Done</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Security.changeEmail', 'Change Email')} onBack={() => navigate(-1)} />

      <GlassCard bordered className="mb-4">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Update your email address</p>
            <p className="text-xs text-gray-500">Enter your new email and confirm with your password.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label={t('Security.changeEmail', 'New Email Address')}
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setError(''); }}
            placeholder="your@email.com"
          />
          <Input
            label="Current Password"
            isPassword
            value={currentPassword}
            onChange={e => { setCurrentPassword(e.target.value); setError(''); }}
          />
          {error && (
            <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2">{error}</p>
          )}
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!newEmail || !currentPassword}
        onClick={handleUpdate}
      >
        {t('Security.changeEmail', 'Update Email')}
      </Button>
    </div>
  );
};
