import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionStep, type QuestionOption } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';

// Default faith options matching React Native
const getDefaultOptions = (): QuestionOption[] => [
  { id: 'Christian', labelKey: 'FaithOrBelief.christian', isPrimary: true },
  { id: 'Muslim', labelKey: 'FaithOrBelief.muslim', isPrimary: true },
  { id: 'Sikh', labelKey: 'FaithOrBelief.sikh', isPrimary: true },
  { id: 'Hindu', labelKey: 'FaithOrBelief.hindu', isPrimary: true },
  { id: 'Buddhist', labelKey: 'FaithOrBelief.buddhist', isPrimary: true },
  { id: 'Jewish', labelKey: 'FaithOrBelief.jewish' },
  { id: 'No religion', labelKey: 'FaithOrBelief.noReligion' },
  { id: 'Spiritual (not religious)', labelKey: 'FaithOrBelief.spiritualNotReligious' },
  { id: 'Other', labelKey: 'FaithOrBelief.other' },
  { id: 'Prefer not to say', labelKey: 'FaithOrBelief.preferNotToSay' },
];

export const FaithOrBeliefSelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedFaith, setSelectedFaith] = useState<string | undefined>(user?.faithOrBelief);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  const handleSelect = useCallback(async (value: string) => {
    setSelectedFaith(value);

    if (!isEditMode) {
      // Onboarding mode: auto-save and navigate
      setTimeout(async () => {
        setLoading(true);
        dispatch(updateUser({ faithOrBelief: value }));
        try {
          await updateProfile({ faithOrBelief: value });
          // Navigate based on role
          if (user?.role === 'listener' || user?.userType === 'listener') {
            navigate('/listener/training');
          } else {
            navigate('/venter/plan');
          }
        } catch (error) {
          console.error('Error saving faith or belief:', error);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isEditMode, dispatch, updateProfile, navigate, user]);

  const handleUpdate = useCallback(async () => {
    if (!selectedFaith) return;
    setLoading(true);
    try {
      dispatch(updateUser({ faithOrBelief: selectedFaith }));
      await updateProfile({ faithOrBelief: selectedFaith });
      navigate(-1);
    } catch (error) {
      console.error('Error updating faith or belief:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedFaith, dispatch, updateProfile, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    // Navigate based on role
    if (user?.role === 'listener' || user?.userType === 'listener') {
      navigate('/listener/training');
    } else {
      navigate('/venter/plan');
    }
  }, [navigate, user]);

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
        step={7}
        totalSteps={7}
        titleKey="FaithOrBelief.title"
        options={options}
        selectedValue={selectedFaith}
        onSelect={handleSelect}
        onBack={handleBack}
        onSkip={handleSkip}
      />
      {isEditMode && selectedFaith && (
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
