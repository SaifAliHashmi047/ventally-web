import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { RootState } from '../../store/store';
import { useAuth } from '../../api/hooks/useAuth';
import { ChevronRight, Camera, User } from 'lucide-react';

const PREFERENCE_ITEMS = [
  { key: 'gender',            label: 'EditProfile.gender',            path: 'gender',         displayKey: 'gender'           },
  { key: 'culturalBackground',label: 'EditProfile.culturalBackground', path: 'racial-identity', displayKey: 'culturalBackground'},
  { key: 'ethnicity',         label: 'EditProfile.ethnicity',         path: 'ethnicity',      displayKey: 'ethnicity'        },
  { key: 'ageGroup',          label: 'EditProfile.ageGroup',          path: 'age-group',      displayKey: 'ageGroup'         },
  { key: 'lgbtq',             label: 'EditProfile.lgbtq',             path: 'lgbtq',          displayKey: 'lgbtqIdentity'    },
  { key: 'faith',             label: 'EditProfile.faith',             path: 'faith',          displayKey: 'faithOrBelief'    },
  { key: 'specialTopics',     label: 'EditProfile.specialTopics',     path: 'special-topics', displayKey: 'specialTopics', isArray: true },
];

export const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    nickname:  user?.nickname  || '',
    bio:       user?.bio       || '',
    phone:     user?.phone     || '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');

  const update = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors((prev: any) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: any = {};
    if (!form.firstName.trim()) errs.firstName = t('Nickname.nicknameRequired', 'First name is required');
    return errs;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await updateProfile({ ...form, ...(avatarPreview && avatarPreview !== user?.avatar ? { avatar: avatarPreview } : {}) });
      navigate(-1);
    } catch (e: any) {
      setErrors({ general: e?.error || t('Common.somethingWentWrong', 'Failed to update profile.') });
    } finally {
      setSaving(false);
    }
  };

  const getPreferenceValue = (item: typeof PREFERENCE_ITEMS[0]) => {
    const val = user?.[item.displayKey];
    if (!val) return '';
    if (item.isArray && Array.isArray(val)) return `${val.length} selected`;
    return typeof val === 'string' ? val : '';
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('EditProfile.title', 'Edit Profile')} onBack={() => navigate(-1)} />

      {/* Avatar */}
      <div className="flex flex-col items-center py-5">
        <label className="relative cursor-pointer group" htmlFor="avatar-upload">
          <div className="w-22 h-22 w-[88px] h-[88px] rounded-full glass flex items-center justify-center text-3xl font-bold text-white border-2 border-white/20 group-hover:border-accent/50 transition-colors overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{(form.firstName[0] || 'U').toUpperCase()}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full glass-accent flex items-center justify-center">
            <Camera size={14} className="text-accent" />
          </div>
        </label>
        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <p className="text-xs text-gray-500 mt-2">Tap to change photo</p>
      </div>

      {/* Basic Info */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-1">Basic Info</p>
      <GlassCard bordered className="mb-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={e => update('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={e => update('lastName', e.target.value)}
            />
          </div>
          <Input
            label="Nickname"
            value={form.nickname}
            onChange={e => update('nickname', e.target.value)}
            placeholder="@coolname"
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            type="tel"
          />
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1.5">Bio</p>
            <textarea
              value={form.bio}
              onChange={e => update('bio', e.target.value)}
              placeholder="Tell us a bit about yourself..."
              className="input-field w-full h-24 resize-none text-sm"
              maxLength={300}
            />
            <p className="text-xs text-gray-600 text-right">{form.bio.length}/300</p>
          </div>
          {errors.general && <p className="text-sm text-error">{errors.general}</p>}
        </div>
      </GlassCard>

      {/* Preferences / Demographics */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-1">
        {t('EditProfile.optionalQuestionsTitle', 'Preferences')}
      </p>
      <p className="text-xs text-gray-600 mb-3 px-1 leading-relaxed">
        {t('EditProfile.optionalQuestionsBody2', 'Your information is private and never shared with other users.')}
      </p>

      <GlassCard padding="none" rounded="2xl" className="mb-5">
        {PREFERENCE_ITEMS.map((item, i, arr) => {
          const value = getPreferenceValue(item);
          const isLast = i === arr.length - 1;
          return (
            <div
              key={item.key}
              className={`settings-item flex justify-between items-center px-4 py-3 cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}
              onClick={() => navigate(`/${role}/profile/${item.path}`)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{t(item.label, item.label)}</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {value && <span className="text-xs text-gray-500 max-w-[120px] truncate">{value}</span>}
                <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </GlassCard>

      <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSave}>
        {t('Profile.editProfile', 'Save Changes')}
      </Button>
    </div>
  );
};
