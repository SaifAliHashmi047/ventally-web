import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { ArrowLeft } from 'lucide-react';

const LEGAL_STEPS = [
  { id: 'waiver', titleKey: 'ListenerLiabilityWaiver.title', contentKey: 'ListenerLiabilityWaiver' },
  { id: 'payment', titleKey: 'PaymentTermsAcknowledgment.title', contentKey: 'PaymentTermsAcknowledgment' },
  { id: 'agreement', titleKey: 'ListenerAgreement.title', contentKey: 'ListenerAgreement' },
  { id: 'nda', titleKey: 'ListenerNDA.title', contentKey: 'ListenerNDA' },
  { id: 'conduct', titleKey: 'ListenerCodeOfConduct.title', contentKey: 'ListenerCodeOfConduct' },
];

export const ListenerLegalFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const step = LEGAL_STEPS[currentStep];
  
  // Note: For simplicity in the demo, I'll use a generic renderer. 
  // In a real app, each would have specific layouts if needed.
  
  const handleContinue = () => {
    if (currentStep < LEGAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/signup/verification');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <AuthLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={handleBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 600 }}>
          {currentStep + 1} / {LEGAL_STEPS.length}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>{t(step.titleKey)}</h1>
      </div>

      <div className="glass" style={{ flex: 1, overflowY: 'auto', padding: '24px', borderRadius: '24px', marginBottom: '32px', maxHeight: '400px' }}>
        {/* Render content based on keys. Each legal doc has a slightly different structure in translation files. */}
        <p style={{ color: 'var(--text-pure)', marginBottom: '16px', fontWeight: 600 }}>{t(`${step.contentKey}.effectiveDate`)}</p>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{t(`${step.contentKey}.introText1`)}</p>
        
        {/* Placeholder for legal sections if they exist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>
                Legal terms and conditions content for {t(step.titleKey)} will be displayed here as per the mobile application's translations.
            </p>
        </div>
      </div>

      <button 
        onClick={handleContinue}
        className="btn-primary" 
        style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
      >
        {t('Common.acceptAndContinue')}
      </button>
    </AuthLayout>
  );
};
