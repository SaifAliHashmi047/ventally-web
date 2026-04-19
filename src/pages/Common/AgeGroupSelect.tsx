import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionStep, type QuestionOption } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';

// Default age group options matching React Native
const getDefaultOptions = (): QuestionOption[] => [
  { id: '18-24', labelKey: 'AgeGroup.age18to24' },
  { id: '25-34', labelKey: 'AgeGroup.age25to34' },
  { id: '35-44', labelKey: 'AgeGroup.age35to44' },
  { id: '45-54', labelKey: 'AgeGroup.age45to54' },
  { id: '55-64', labelKey: 'AgeGroup.age55to64' },
  { id: '65+', labelKey: 'AgeGroup.age65Plus' },
  { id: 'Prefer not to say', labelKey: 'AgeGroup.preferNotToSay' },
];

export const AgeGroupSelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | undefined>(user?.ageGroup);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  // Helper to get role-based path prefix
  const getRolePrefix = useCallback(() => {
    return user?.role === 'listener' || user?.userType === 'listener' ? '/listener' : '/venter';
  }, [user]);

  const handleSelect = useCallback(async (value: string) => {
    setSelectedAgeGroup(value);

    if (!isEditMode) {
      // Onboarding mode: auto-save and navigate
      setTimeout(async () => {
        setLoading(true);
        dispatch(updateUser({ ageGroup: value }));
        try {
          await updateProfile({ ageGroup: value });
          // Skip LGBTQ if needed, otherwise go to special topics
          navigate(`${getRolePrefix()}/lgbtq-identity`);
        } catch (error) {
          console.error('Error saving age group:', error);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isEditMode, dispatch, updateProfile, navigate, getRolePrefix]);

  const handleUpdate = useCallback(async () => {
    if (!selectedAgeGroup) return;
    setLoading(true);
    try {
      dispatch(updateUser({ ageGroup: selectedAgeGroup }));
      await updateProfile({ ageGroup: selectedAgeGroup });
      navigate(-1);
    } catch (error) {
      console.error('Error updating age group:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedAgeGroup, dispatch, updateProfile, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate(`${getRolePrefix()}/lgbtq-identity`);
  }, [navigate, getRolePrefix]);

  if (loading) {
    return (
      <div className="page-wrapper flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <QuestionStep
        step={4}
        totalSteps={7}
        titleKey="AgeGroup.title"
        options={options}
        selectedValue={selectedAgeGroup}
        onSelect={handleSelect}
        onBack={handleBack}
        onSkip={handleSkip}
      />
      {isEditMode && selectedAgeGroup && (
        <button
          onClick={handleUpdate}
          className="btn btn-primary w-full mt-6"
        >
          {t('Common.update', 'Update')}
        </button>
      )}
    </div>
  );
};
