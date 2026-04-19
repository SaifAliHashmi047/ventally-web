import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionStep, type QuestionOption } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';

// Default ethnicity options matching React Native
const getDefaultOptions = (): QuestionOption[] => [
  { id: 'African Diaspora', labelKey: 'Ethnicity.africanDiaspora' },
  { id: 'Caribbean', labelKey: 'Ethnicity.caribbean' },
  { id: 'North African', labelKey: 'Ethnicity.northAfrican' },
  { id: 'Hispanic', labelKey: 'Ethnicity.hispanic' },
  { id: 'Pacific Islander', labelKey: 'Ethnicity.pacificIslander' },
  { id: 'Middle Eastern', labelKey: 'Ethnicity.middleEastern' },
  { id: 'Asian', labelKey: 'Ethnicity.asian' },
  { id: 'Indigenous', labelKey: 'Ethnicity.indigenous' },
  { id: 'European', labelKey: 'Ethnicity.european' },
  { id: 'Multiple', labelKey: 'Ethnicity.multiple' },
  { id: 'Other', labelKey: 'Ethnicity.other' },
  { id: 'Prefer not to say', labelKey: 'Ethnicity.preferNotToSay' },
];

export const EthnicitySelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedEthnicity, setSelectedEthnicity] = useState<string | undefined>(user?.ethnicity);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  // Helper to get role-based path prefix
  const getRolePrefix = useCallback(() => {
    return user?.role === 'listener' || user?.userType === 'listener' ? '/listener' : '/venter';
  }, [user]);

  const handleSelect = useCallback(async (value: string) => {
    setSelectedEthnicity(value);

    if (!isEditMode) {
      // Onboarding mode: auto-save and navigate
      setTimeout(async () => {
        setLoading(true);
        dispatch(updateUser({ ethnicity: value }));
        try {
          await updateProfile({ ethnicity: value });
          navigate(`${getRolePrefix()}/age-group`);
        } catch (error) {
          console.error('Error saving ethnicity:', error);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isEditMode, dispatch, updateProfile, navigate, getRolePrefix]);

  const handleUpdate = useCallback(async () => {
    if (!selectedEthnicity) return;
    setLoading(true);
    try {
      dispatch(updateUser({ ethnicity: selectedEthnicity }));
      await updateProfile({ ethnicity: selectedEthnicity });
      navigate(-1);
    } catch (error) {
      console.error('Error updating ethnicity:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedEthnicity, dispatch, updateProfile, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate(`${getRolePrefix()}/age-group`);
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
        step={3}
        totalSteps={7}
        titleKey="Ethnicity.title"
        options={options}
        selectedValue={selectedEthnicity}
        onSelect={handleSelect}
        onBack={handleBack}
        onSkip={handleSkip}
      />
      {isEditMode && selectedEthnicity && (
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
