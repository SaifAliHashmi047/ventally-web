import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import type { RootState } from '../../store/store';
import { useAuth } from '../../api/hooks/useAuth';
import { ChevronRight } from 'lucide-react';

// stepId keys must match STEPS_CONFIG keys in VenterQuestionsFlow
const PREFERENCE_ITEMS = [
  { key: 'gender',            label: 'EditProfile.gender',            stepId: 'gender',    displayKey: 'gender' },
  { key: 'culturalBackground',label: 'EditProfile.culturalBackground', stepId: 'race',      displayKey: 'culturalBackground' },
  { key: 'ethnicity',         label: 'EditProfile.ethnicity',         stepId: 'ethnicity', displayKey: 'ethnicity' },
  { key: 'ageGroup',          label: 'EditProfile.ageGroup',          stepId: 'age',       displayKey: 'ageGroup' },
  { key: 'lgbtqIdentity',     label: 'EditProfile.lgbtq',             stepId: 'lgbtq',     displayKey: 'lgbtqIdentity' },
  { key: 'faithOrBelief',     label: 'EditProfile.faith',             stepId: 'faith',     displayKey: 'faithOrBelief' },
  { key: 'specialTopics',     label: 'EditProfile.specialTopics',     stepId: 'topics',    displayKey: 'specialTopics', isArray: true },
];

export const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getProfile } = useAuth();
  const user = useSelector((state: RootState) => state.user.user as any);
  const isVenter = useSelector((state: RootState) => (state.user as any).isVenter ?? (user?.userType === 'venter'));
  const rolePrefix = isVenter ? '/venter' : '/listener';

  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch fresh preferences from API on mount — matches native useFocusEffect pattern
  useEffect(() => {
    getProfile().catch(() => {}).finally(() => setLoadingProfile(false));
  }, []);

  const getPreferenceValue = (item: typeof PREFERENCE_ITEMS[0]) => {
    const val = user?.[item.displayKey];
    if (!val) return '';
    if (item.isArray && Array.isArray(val)) {
      return val.length > 0 ? t('EditProfile.selectedCount', { count: val.length, defaultValue: `${val.length} selected` }) : '';
    }
    return typeof val === 'string' ? val : '';
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('EditProfile.title', 'Edit Profile')} onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl" className="mb-5">
        {loadingProfile
          ? // Skeleton placeholders while API loads
            PREFERENCE_ITEMS.map((item) => (
              <div key={item.key} className="flex justify-between items-center px-4 py-5 border-b border-white/5 last:border-0">
                <div className="skeleton h-4 w-32 rounded-lg" />
                <div className="skeleton h-4 w-16 rounded-lg" />
              </div>
            ))
          : PREFERENCE_ITEMS.map((item, i, arr) => {
              const value = getPreferenceValue(item);
              const isLast = i === arr.length - 1;
              return (
                <div
                  key={item.key}
                  className={`settings-item flex justify-between items-center px-4 py-5 cursor-pointer hover:bg-white/5 transition-colors ${!isLast ? 'border-b border-white/5' : ''}`}
                  onClick={() => navigate(`${rolePrefix}/profile/preferences/${item.stepId}`)}
                >
                  <p className="text-sm font-medium text-white">{t(item.label, item.label)}</p>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    {value && <span className="text-xs text-white/50 max-w-[120px] truncate">{value}</span>}
                    <ChevronRight size={16} className="text-white/40" />
                  </div>
                </div>
              );
            })}
      </GlassCard>
    </div>
  );
};
