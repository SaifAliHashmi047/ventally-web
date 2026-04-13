import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Clock } from 'lucide-react';

export const ListenerVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div className="flex-center" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 auto 32px' }}>
          <Clock size={40} color="white" />
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '16px' }}>
          {t('VerificationInProgress.title')}
        </h1>
        
        <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
          {t('VerificationInProgress.subtitle') || 'We are currently reviewing your application. This process usually takes 24-48 hours. We will notify you once your account is verified.'}
        </p>

        <div className="glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '40px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>{t('VerificationInProgress.nextSteps', 'What happens next?')}</h3>
          <ul style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>{t('VerificationInProgress.step1', 'Our team verifies your legal documents.')}</li>
            <li>{t('VerificationInProgress.step2', 'We review your training completion status.')}</li>
            <li>{t('VerificationInProgress.step3', 'Once approved, you will get access to the Listener Dashboard.')}</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="btn-primary" 
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
        >
          {t('Common.backToLogin')}
        </button>
      </div>
    </AuthLayout>
  );
};
