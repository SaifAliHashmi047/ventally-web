import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import { ArrowLeft, Check } from 'lucide-react';

export const OptionalQuestionsHero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);
  const role = user?.role || user?.userType || 'venter';

  const handleSkipAll = () => {
    if (role === 'listener') {
      navigate('/signup/listener-training');
    } else {
      navigate('/signup/choose-plan');
    }
  };

  return (
    <AuthLayout>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '16px' }}>
          {t('OptionalQuestions.title')}
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: '1.6' }}>
          {t('OptionalQuestions.introText')}
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
          {t('OptionalQuestions.sectionHeader')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((num) => (
            <div key={num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div 
                className="flex items-center justify-center flex-shrink-0 bg-white rounded-full mt-0.5" 
                style={{ width: '20px', height: '20px' }}
              >
                <Check size={13} className="text-black" strokeWidth={3} />
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.4' }}>
                {t(`OptionalQuestions.bullet${num}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button
        className='!w-full'
          variant="primary"
 
          fullWidth
          onClick={() => navigate('/signup/questions/gender')}
        >
          {t('OptionalQuestions.continue')}
        </Button>
        <Button
        className='!w-full'
 
          fullWidth
          onClick={handleSkipAll}
        >
          {t('OptionalQuestions.skipAll')}
        </Button>
      </div>
    </AuthLayout>
  );
};
