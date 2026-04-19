import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionStep, type QuestionOption } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';

// Default racial options matching React Native
const getDefaultOptions = (): QuestionOption[] => [
  { id: 'Black', labelKey: 'RacialIdentity.black' },
  { id: 'White', labelKey: 'RacialIdentity.white' },
  { id: 'Asian', labelKey: 'RacialIdentity.asian' },
  { id: 'Native Indian', labelKey: 'RacialIdentity.nativeIndian' },
  { id: 'Pacific Islander', labelKey: 'RacialIdentity.pacificIslander' },
  { id: 'Middle Eastern', labelKey: 'RacialIdentity.middleEastern' },
  { id: 'North African', labelKey: 'RacialIdentity.northAfrican' },
  { id: 'Multiracial', labelKey: 'RacialIdentity.multiracial' },
  { id: 'Other', labelKey: 'RacialIdentity.other' },
];

export const RacialIdentitySelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedRacial, setSelectedRacial] = useState<string | undefined>(user?.culturalBackground);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  // Helper to get role-based path prefix
  const getRolePrefix = useCallback(() => {
    return user?.role === 'listener' || user?.userType === 'listener' ? '/listener' : '/venter';
  }, [user]);

  const handleSelect = useCallback(async (value: string) => {
    setSelectedRacial(value);

    if (!isEditMode) {
      // Onboarding mode: auto-save and navigate
      setTimeout(async () => {
        setLoading(true);
        dispatch(updateUser({ culturalBackground: value }));
        try {
          await updateProfile({ culturalBackground: value });
          navigate(`${getRolePrefix()}/ethnicity`);
        } catch (error) {
          console.error('Error saving racial identity:', error);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isEditMode, dispatch, updateProfile, navigate, getRolePrefix]);

  const handleUpdate = useCallback(async () => {
    if (!selectedRacial) return;
    setLoading(true);
    try {
      dispatch(updateUser({ culturalBackground: selectedRacial }));
      await updateProfile({ culturalBackground: selectedRacial });
      navigate(-1);
    } catch (error) {
      console.error('Error updating racial identity:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedRacial, dispatch, updateProfile, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate(`${getRolePrefix()}/ethnicity`);
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
        step={2}
        totalSteps={7}
        titleKey="RacialIdentity.title"
        options={options}
        selectedValue={selectedRacial}
        onSelect={handleSelect}
        onBack={handleBack}
        onSkip={handleSkip}
      />
      {isEditMode && selectedRacial && (
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
