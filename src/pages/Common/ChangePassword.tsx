import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiInstance from '../../api/apiInstance';
import { Lock } from 'lucide-react';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.current) errs.current = 'Current password required';
    if (form.newPwd.length < 8) errs.newPwd = 'At least 8 characters required';
    if (form.newPwd !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await apiInstance.put('auth/change-password', { currentPassword: form.current, newPassword: form.newPwd });
      setSuccess(true);
    } catch (e: any) {
      setErrors({ general: e?.response?.data?.message || 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title="Password Changed" onBack={() => navigate(-1)} />
        <GlassCard bordered className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-success" />
          </div>
          <p className="text-lg font-bold text-white mb-2">Password Updated!</p>
          <p className="text-sm text-gray-500 mb-6">Your password has been successfully changed.</p>
          <Button variant="primary" onClick={() => navigate(-2)}>Done</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Change Password" onBack={() => navigate(-1)} />
      <GlassCard bordered>
        <div className="space-y-4">
          <Input label="Current Password" isPassword value={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.value }))} error={errors.current} />
          <Input label="New Password" isPassword value={form.newPwd} onChange={e => setForm(p => ({ ...p, newPwd: e.target.value }))} error={errors.newPwd} hint="Minimum 8 characters" />
          <Input label="Confirm New Password" isPassword value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} error={errors.confirm} />
          {errors.general && <p className="text-sm text-error">{errors.general}</p>}
        </div>
      </GlassCard>
      <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSave}>Update Password</Button>
    </div>
  );
};
