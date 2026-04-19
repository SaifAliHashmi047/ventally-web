import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionStep, type QuestionOption } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';

// Default LGBTQ options matching React Native
const getDefaultOptions = (): QuestionOption[] => [
  { id: 'Gay', labelKey: 'LGBTQIdentity.gay' },
  { id: 'Lesbian', labelKey: 'LGBTQIdentity.lesbian' },
  { id: 'Bisexual', labelKey: 'LGBTQIdentity.bisexual' },
  { id: 'Pansexual', labelKey: 'LGBTQIdentity.pansexual' },
  { id: 'Asexual', labelKey: 'LGBTQIdentity.asexual' },
  { id: 'Queer', labelKey: 'LGBTQIdentity.queer' },
  { id: 'Questioning', labelKey: 'LGBTQIdentity.questioning' },
  { id: 'Straight/Heterosexual', labelKey: 'LGBTQIdentity.straightHeterosexual' },
  { id: 'Prefer not to say', labelKey: 'LGBTQIdentity.preferNotToSay' },
];

export const LGBTQSelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedLGBTQ, setSelectedLGBTQ] = useState<string | undefined>(user?.lgbtqIdentity);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  // Helper to get role-based path prefix
  const getRolePrefix = useCallback(() => {
    return user?.role === 'listener' || user?.userType === 'listener' ? '/listener' : '/venter';
  }, [user]);

  const handleSelect = useCallback(async (value: string) => {
    setSelectedLGBTQ(value);

    if (!isEditMode) {
      // Onboarding mode: auto-save and navigate
      setTimeout(async () => {
        setLoading(true);
        dispatch(updateUser({ lgbtqIdentity: value }));
        try {
          await updateProfile({ lgbtqIdentity: value });
          navigate(`${getRolePrefix()}/special-topics`);
        } catch (error) {
          console.error('Error saving LGBTQ identity:', error);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isEditMode, dispatch, updateProfile, navigate, getRolePrefix]);

  const handleUpdate = useCallback(async () => {
    if (!selectedLGBTQ) return;
    setLoading(true);
    try {
      dispatch(updateUser({ lgbtqIdentity: selectedLGBTQ }));
      await updateProfile({ lgbtqIdentity: selectedLGBTQ });
      navigate(-1);
    } catch (error) {
      console.error('Error updating LGBTQ identity:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedLGBTQ, dispatch, updateProfile, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate(`${getRolePrefix()}/special-topics`);
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
        step={5}
        totalSteps={7}
        titleKey="LGBTQIdentity.title"
        options={options}
        selectedValue={selectedLGBTQ}
        onSelect={handleSelect}
        onBack={handleBack}
        onSkip={handleSkip}
      />
      {isEditMode && selectedLGBTQ && (
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
