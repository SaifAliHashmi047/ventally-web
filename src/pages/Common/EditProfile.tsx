import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { RootState } from '../../store/store';
import { useAuth } from '../../api/hooks/useAuth';

export const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const user = useSelector((state: RootState) => state.user.user as any);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const update = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors((prev: any) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: any = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await updateProfile(form);
      navigate(-1);
    } catch (e: any) {
      setErrors({ general: e?.error || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Edit Profile" onBack={() => navigate(-1)} />

      {/* Avatar Placeholder */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-xl font-bold text-white border-2 border-white/20 cursor-pointer hover:border-primary/40 transition-colors">
          {(form.firstName[0] || 'U').toUpperCase()}
        </div>
        <p className="text-xs text-gray-500 mt-2">Tap to change photo</p>
      </div>

      <GlassCard bordered>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} error={errors.firstName} />
            <Input label="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
          </div>
          <Input label="Nickname" value={form.nickname} onChange={e => update('nickname', e.target.value)} placeholder="@coolname" />
          <Input label="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} type="tel" />
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1.5">Bio</p>
            <textarea
              value={form.bio}
              onChange={e => update('bio', e.target.value)}
              placeholder="Tell us a bit about yourself..."
              className="input-field w-full h-24 resize-none"
              maxLength={300}
            />
            <p className="text-xs text-gray-600 text-right">{form.bio.length}/300</p>
          </div>
          {errors.general && <p className="text-sm text-error">{errors.general}</p>}
        </div>
      </GlassCard>

      <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
