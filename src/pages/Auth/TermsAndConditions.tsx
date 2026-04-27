import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { TermsAndConditionsContent } from '../../components/Shared/TermsAndConditionsContent';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const TermsAndConditions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);
  const role = user?.role || user?.userType || 'venter';

  const handleAccept = () => {
    if (role === 'listener') {
      navigate('/signup/questions', { state: { userType: role } });
    } else {
      navigate('/signup/nickname', { state: { userType: role } });
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
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>{t('TermsAndConditions.title')}</h1>
      </div>

      <TermsAndConditionsContent />

      <Button
        onClick={handleAccept}
        fullWidth
      >
        {t('Common.accept')}
      </Button>
    </AuthLayout>
  );
};
