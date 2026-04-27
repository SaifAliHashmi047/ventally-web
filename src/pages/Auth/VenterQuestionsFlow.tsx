import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { QuestionStep } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';

// ── All 7 steps with complete options — matches native exactly ──────────────
const STEPS_CONFIG: Record<string, {
  step: number;
  titleKey: string;
  userKey: string;         // key in user Redux state
  apiField: string;        // field name sent to auth/profile
  next: string | 'finish';
  multiSelect?: boolean;
  useBubblePattern?: boolean;
  options: { id: string; labelKey: string; isPrimary?: boolean }[];
}> = {
  gender: {
    step: 1, titleKey: 'GenderIdentity.title', userKey: 'gender', apiField: 'genderIdentity',
    next: 'race',
    useBubblePattern: true,
    options: [
      { id: 'Man',                    labelKey: 'GenderIdentity.man',                  isPrimary: true },
      { id: 'Woman',                  labelKey: 'GenderIdentity.woman',                isPrimary: true },
      { id: 'Non-binary',             labelKey: 'GenderIdentity.nonBinary' },
      { id: 'Gender non-conforming',  labelKey: 'GenderIdentity.genderNonConforming' },
      { id: 'Questioning',            labelKey: 'GenderIdentity.questioning' },
      { id: 'Prefer not to say',      labelKey: 'GenderIdentity.preferNotToSay' },
    ],
  },
  race: {
    step: 2, titleKey: 'RacialIdentity.title', userKey: 'culturalBackground', apiField: 'culturalBackground',
    next: 'ethnicity',
    options: [
      { id: 'Black',            labelKey: 'RacialIdentity.black' },
      { id: 'White',            labelKey: 'RacialIdentity.white' },
      { id: 'Asian',            labelKey: 'RacialIdentity.asian' },
      { id: 'Native Indian',    labelKey: 'RacialIdentity.nativeIndian' },
      { id: 'Pacific Islander', labelKey: 'RacialIdentity.pacificIslander' },
      { id: 'Middle Eastern',   labelKey: 'RacialIdentity.middleEastern' },
      { id: 'North African',    labelKey: 'RacialIdentity.northAfrican' },
      { id: 'Multiracial',      labelKey: 'RacialIdentity.multiracial' },
      { id: 'Other',            labelKey: 'RacialIdentity.other' },
    ],
  },
  ethnicity: {
    step: 3, titleKey: 'Ethnicity.title', userKey: 'ethnicity', apiField: 'ethnicity',
    next: 'age',
    options: [
      { id: 'African Diaspora',  labelKey: 'Ethnicity.africanDiaspora' },
      { id: 'Caribbean',         labelKey: 'Ethnicity.caribbean' },
      { id: 'North African',     labelKey: 'Ethnicity.northAfrican' },
      { id: 'Hispanic',          labelKey: 'Ethnicity.hispanic' },
      { id: 'Pacific Islander',  labelKey: 'Ethnicity.pacificIslander' },
      { id: 'Middle Eastern',    labelKey: 'Ethnicity.middleEastern' },
      { id: 'Asian',             labelKey: 'Ethnicity.asian' },
      { id: 'Indigenous',        labelKey: 'Ethnicity.indigenous' },
      { id: 'European',          labelKey: 'Ethnicity.european' },
      { id: 'Other',             labelKey: 'Ethnicity.other' },
      { id: 'Prefer not to say', labelKey: 'Ethnicity.preferNotToSay' },
      { id: 'Multiple',          labelKey: 'Ethnicity.multiple' },
    ],
  },
  age: {
    step: 4, titleKey: 'AgeGroup.title', userKey: 'ageGroup', apiField: 'ageGroup',
    next: 'lgbtq',
    options: [
      { id: '18-24',          labelKey: 'AgeGroup.age18to24' },
      { id: '25-34',          labelKey: 'AgeGroup.age25to34' },
      { id: '35-44',          labelKey: 'AgeGroup.age35to44' },
      { id: '45-54',          labelKey: 'AgeGroup.age45to54' },
      { id: '55-64',          labelKey: 'AgeGroup.age55to64' },
      { id: '65+',            labelKey: 'AgeGroup.age65Plus' },
      { id: 'Prefer not to say', labelKey: 'AgeGroup.preferNotToSay' },
    ],
  },
  lgbtq: {
    step: 5, titleKey: 'LGBTQIdentity.title', userKey: 'lgbtqIdentity', apiField: 'lgbtqIdentity',
    next: 'topics',
    useBubblePattern: true,
    options: [
      { id: 'Gay',                    labelKey: 'LGBTQIdentity.gay' },
      { id: 'Lesbian',                labelKey: 'LGBTQIdentity.lesbian' },
      { id: 'Bisexual',               labelKey: 'LGBTQIdentity.bisexual' },
      { id: 'Pansexual',              labelKey: 'LGBTQIdentity.pansexual' },
      { id: 'Asexual',                labelKey: 'LGBTQIdentity.asexual' },
      { id: 'Queer',                  labelKey: 'LGBTQIdentity.queer' },
      { id: 'Questioning',            labelKey: 'LGBTQIdentity.questioning' },
      { id: 'Straight/Heterosexual',  labelKey: 'LGBTQIdentity.straightHeterosexual' },
      { id: 'Prefer not to say',      labelKey: 'LGBTQIdentity.preferNotToSay' },
    ],
  },
  topics: {
    step: 6, titleKey: 'SpecialTopics.title', userKey: 'specialTopics', apiField: 'specialTopics',
    next: 'faith',
    multiSelect: true,
    options: [
      { id: 'Mental Health',    labelKey: 'SpecialTopics.mentalHealth' },
      { id: 'Life & Identity',  labelKey: 'SpecialTopics.lifeIdentity' },
      { id: 'Relationships',    labelKey: 'SpecialTopics.relationships' },
      { id: 'Health & Medical', labelKey: 'SpecialTopics.healthMedical' },
      { id: 'Work & Finances',  labelKey: 'SpecialTopics.workFinances' },
    ],
  },
  faith: {
    step: 7, titleKey: 'FaithOrBelief.title', userKey: 'faithOrBelief', apiField: 'faithOrBelief',
    next: 'finish',
    options: [
      { id: 'Christian',                 labelKey: 'FaithOrBelief.christian',           isPrimary: true },
      { id: 'Muslim',                    labelKey: 'FaithOrBelief.muslim',              isPrimary: true },
      { id: 'Sikh',                      labelKey: 'FaithOrBelief.sikh' },
      { id: 'Hindu',                     labelKey: 'FaithOrBelief.hindu',               isPrimary: true },
      { id: 'Buddhist',                  labelKey: 'FaithOrBelief.buddhist',            isPrimary: true },
      { id: 'Jewish',                    labelKey: 'FaithOrBelief.jewish' },
      { id: 'No religion',               labelKey: 'FaithOrBelief.noReligion' },
      { id: 'Spiritual (not religious)', labelKey: 'FaithOrBelief.spiritualNotReligious', isPrimary: true },
      { id: 'Other',                     labelKey: 'FaithOrBelief.other' },
    ],
  },
};

export const VenterQuestionsFlow = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.user.user);
  // edit mode: comes via role-specific route (/venter/profile/preferences/:stepId)
  // OR from profile settings page passing state
  const editMode = location.pathname.includes('/preferences/') || !!(location.state as any)?.editMode;

  const config = STEPS_CONFIG[stepId || 'gender'];

  // ── Local selection state seeded from Redux user ──
  const userValue = config ? (user as any)[config.userKey] : undefined;
  const [selected, setSelected] = useState<string | string[]>(
    config?.multiSelect
      ? (Array.isArray(userValue) ? userValue : [])
      : (userValue || '')
  );
  const [loading, setLoading] = useState(false);

  // Re-seed when stepId changes OR when user Redux state updates (e.g. after profile API fetch)
  useEffect(() => {
    if (!config) return;
    const v = (user as any)[config.userKey];
    setSelected(config.multiSelect ? (Array.isArray(v) ? v : []) : (v || ''));
  }, [stepId, user]);

  if (!config) return null;

  const handleSelect = (value: string) => {
    if (config.multiSelect) {
      setSelected(prev => {
        const arr = prev as string[];
        return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      });
    } else {
      setSelected(value);
      // In signup flow, auto-advance after 500ms (matches native 800ms behaviour)
      if (!editMode) {
        setTimeout(() => saveAndAdvance(value), 500);
      }
    }
  };

  const saveAndAdvance = async (value?: string) => {
    const payload = config.multiSelect ? (selected as string[]) : (value ?? selected as string);
    if (!payload || (Array.isArray(payload) && payload.length === 0)) return;

    setLoading(true);
    try {
      // Update Redux optimistically
      dispatch(updateUser({ [config.userKey]: payload }));
      // Persist to API — matches native apiInstance.put('auth/profile', { field: value })
      await apiInstance.put('auth/profile', { [config.apiField]: payload });

      if (editMode) {
        toastSuccess(t('Common.success', 'Saved'));
        navigate(-1);
      } else {
        // Advance to next step
        if (config.next === 'finish') {
          const role = user?.role || (user as any)?.userType || 'venter';
          if (role === 'listener') {
            navigate('/signup/listener-training');
          } else {
            navigate('/signup/choose-plan');
          }
        } else {
          navigate(`/signup/questions/${config.next}`);
        }
      }
    } catch {
      toastError(t('Common.error', 'Failed to save'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (editMode) {
      navigate(-1);
      return;
    }
    if (config.next === 'finish') {
      const role = user?.role || (user as any)?.userType || 'venter';
      if (role === 'listener') {
        navigate('/signup/listener-training');
      } else {
        navigate('/signup/choose-plan');
      }
    } else {
      navigate(`/signup/questions/${config.next}`);
    }
  };

  const selectedValue = config.multiSelect ? undefined : (selected as string);
  const selectedValues = config.multiSelect ? (selected as string[]) : undefined;
  const hasSelection = config.multiSelect
    ? (selected as string[]).length > 0
    : !!(selected as string);

  const content = (
    <QuestionStep
      step={config.step}
      totalSteps={7}
      titleKey={config.titleKey}
      options={config.options}
      selectedValue={selectedValue}
      selectedValues={selectedValues}
      onSelect={handleSelect}
      onBack={() => navigate(-1)}
      onSkip={editMode ? undefined : handleSkip}
      onContinue={config.multiSelect ? () => saveAndAdvance() : (editMode && hasSelection ? () => saveAndAdvance() : undefined)}
      continueText={editMode ? t('Common.update', 'Update') : undefined}
      skipText={undefined}
      loading={loading}
      useBubblePattern={config.useBubblePattern}
    />
  );

  // In edit mode, render within the app layout (no auth background)
  if (editMode) {
    return (
      <div
        className="animate-fade-in"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 20px 32px',
        }}
      >
        {content}
      </div>
    );
  }

  return <AuthLayout hideGlass>{content}</AuthLayout>;
};
