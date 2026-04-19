import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionStep, type QuestionOption } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';

// Default gender options matching React Native
const getDefaultOptions = (): QuestionOption[] => [
  { id: 'Man', labelKey: 'GenderIdentity.man', isPrimary: true },
  { id: 'Woman', labelKey: 'GenderIdentity.woman', isPrimary: true },
  { id: 'Non-binary', labelKey: 'GenderIdentity.nonBinary' },
  { id: 'Gender non-conforming', labelKey: 'GenderIdentity.genderNonConforming' },
  { id: 'Questioning', labelKey: 'GenderIdentity.questioning' },
  { id: 'Prefer not to say', labelKey: 'GenderIdentity.preferNotToSay' },
];

export const GenderIdentitySelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedGender, setSelectedGender] = useState<string | undefined>(user?.gender);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  // Helper to get role-based path prefix
  const getRolePrefix = useCallback(() => {
    return user?.role === 'listener' || user?.userType === 'listener' ? '/listener' : '/venter';
  }, [user]);

  const handleSelect = useCallback(async (value: string) => {
    setSelectedGender(value);

    if (!isEditMode) {
      // Onboarding mode: auto-save and navigate
      setTimeout(async () => {
        setLoading(true);
        dispatch(updateUser({ gender: value }));
        try {
          await updateProfile({ genderIdentity: value });
          navigate(`${getRolePrefix()}/racial-identity`);
        } catch (error) {
          console.error('Error saving gender identity:', error);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isEditMode, dispatch, updateProfile, navigate, getRolePrefix]);

  const handleUpdate = useCallback(async () => {
    if (!selectedGender) return;
    setLoading(true);
    try {
      dispatch(updateUser({ gender: selectedGender }));
      await updateProfile({ genderIdentity: selectedGender });
      navigate(-1);
    } catch (error) {
      console.error('Error updating gender identity:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGender, dispatch, updateProfile, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate(`${getRolePrefix()}/racial-identity`);
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
        step={1}
        totalSteps={7}
        titleKey="GenderIdentity.title"
        options={options}
        selectedValue={selectedGender}
        onSelect={handleSelect}
        onBack={handleBack}
        onSkip={handleSkip}
      />
      {isEditMode && selectedGender && (
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
