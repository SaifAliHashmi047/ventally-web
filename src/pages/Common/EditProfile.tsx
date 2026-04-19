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
import { toastSuccess, toastError } from '../../utils/toast';
import { ChevronRight, Camera } from 'lucide-react';

// Maps EditProfile row → stepId in VenterQuestionsFlow
const PREFERENCE_ITEMS = [
  { key: 'gender',            label: 'EditProfile.gender',            stepId: 'gender',    displayKey: 'gender' },
  { key: 'race',              label: 'EditProfile.culturalBackground', stepId: 'race',      displayKey: 'race' },
  { key: 'culturalBackground',label: 'EditProfile.ethnicity',         stepId: 'ethnicity', displayKey: 'culturalBackground' },
  { key: 'ageGroup',          label: 'EditProfile.ageGroup',          stepId: 'age',       displayKey: 'ageGroup' },
  { key: 'lgbtqIdentity',     label: 'EditProfile.lgbtq',             stepId: 'lgbtq',     displayKey: 'lgbtqIdentity' },
  { key: 'faithOrBelief',     label: 'EditProfile.faith',             stepId: 'faith',     displayKey: 'faithOrBelief' },
  { key: 'specialTopics',     label: 'EditProfile.specialTopics',     stepId: 'topics',    displayKey: 'specialTopics', isArray: true },
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
    lastName: user?.lastName || '',
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
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
      toastSuccess(t('Common.operationSuccess'));
      navigate(-1);
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
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



      <GlassCard padding="none" rounded="2xl" className="mb-5">
        {PREFERENCE_ITEMS.map((item, i, arr) => {
          const value = getPreferenceValue(item);
          const isLast = i === arr.length - 1;
          return (
            <div
              key={item.key}
              className={`settings-item flex justify-between items-center px-4 py-8 cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}
              onClick={() => navigate(`/signup/questions/${(item as any).stepId}`, { state: { editMode: true } })}
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


    </div>
  );
};
