import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';
import tickIcon from '../../assets/icons/tick.png';

interface QuestionOption {
  id: string;
  labelKey: string;
}

const getDefaultOptions = (): QuestionOption[] => [
  { id: 'Mental Health', labelKey: 'SpecialTopics.mentalHealth' },
  { id: 'Life & Identity', labelKey: 'SpecialTopics.lifeIdentity' },
  { id: 'Relationships', labelKey: 'SpecialTopics.relationships' },
  { id: 'Health & Medical', labelKey: 'SpecialTopics.healthMedical' },
  { id: 'Work & Finances', labelKey: 'SpecialTopics.workFinances' },
];

export const SpecialTopicsSelect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const user = useSelector((state: RootState) => state.user.user);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(user?.specialTopics || []);
  const [options] = useState<QuestionOption[]>(getDefaultOptions);
  const [loading, setLoading] = useState(false);

  // Helper to get role-based path prefix
  const getRolePrefix = useCallback(() => {
    return user?.role === 'listener' || user?.userType === 'listener' ? '/listener' : '/venter';
  }, [user]);

  const handleToggle = useCallback((topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  }, []);

  const handleContinue = useCallback(async () => {
    if (selectedTopics.length === 0) return;

    setLoading(true);
    try {
      dispatch(updateUser({ specialTopics: selectedTopics }));
      await updateProfile({ specialTopics: selectedTopics });
      if (isEditMode) {
        navigate(-1);
      } else {
        navigate(`${getRolePrefix()}/faith-or-belief`);
      }
    } catch (error) {
      console.error('Error saving special topics:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTopics, isEditMode, dispatch, updateProfile, navigate, getRolePrefix]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    navigate(`${getRolePrefix()}/faith-or-belief`);
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button 
            onClick={handleBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 600 }}>
            6 / 7
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>
            {t('SpecialTopics.title')}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
          {options.map((option) => {
            const isSelected = selectedTopics.includes(option.id);
            return (
              <div 
                key={option.id}
                onClick={() => handleToggle(option.id)}
                className={`glass card-hover ${isSelected ? 'selected-option' : ''}`}
                style={{ 
                  padding: '16px 20px', 
                  borderRadius: '16px', 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: isSelected ? '1px solid var(--text-pure)' : '1px solid transparent',
                  transition: 'var(--transition-fast)'
                }}
              >
                <span style={{ fontSize: '16px', color: isSelected ? 'var(--text-pure)' : 'var(--text-main)', fontWeight: isSelected ? 600 : 500 }}>
                  {t(option.labelKey)}
                </span>
                {isSelected && (
                  <div className="flex-center" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white' }}>
                    <img src={tickIcon} alt="selected" style={{ width: '12px', height: '12px', filter: 'invert(1)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {selectedTopics.length > 0 && (
            <button
              onClick={handleContinue}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {t('Common.continue', 'Continue')}
            </button>
          )}
          <button 
            onClick={handleSkip}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '15px', textDecoration: 'underline', cursor: 'pointer', padding: '12px' }}
          >
            {t('Common.skip')}
          </button>
        </div>
      </div>
    </div>
  );
};
