import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const { isAccountChanging, resolve } = useAccountChangeFlow();
  const legacyAccountTypeChanging = (location.state as any)?.accountTypeChanging;
  const effectiveChanging = isAccountChanging || legacyAccountTypeChanging;
  const step = LEGAL_STEPS[currentStep];

  const handleContinue = () => {
    if (currentStep < LEGAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate(resolve('verification'));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const sections = t(`${step.contentKey}.sections`, { returnObjects: true }) as any[];

  const legalContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={handleBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 600 }}>
          {currentStep + 1} / {LEGAL_STEPS.length}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-pure)' }}>{t(step.titleKey)}</h1>
      </div>

      <div style={{ height: '400px', overflowY: 'auto', paddingRight: '12px', marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '16px' }}>{t(`${step.contentKey}.effectiveDate`)}</p>
        <p style={{ color: 'var(--text-pure)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{t(`${step.contentKey}.introText1`)}</p>
        
        {/* Support introText2 if exists in NDA or Waiver */}
        {t(`${step.contentKey}.introText2`) !== `${step.contentKey}.introText2` && (
             <p style={{ color: 'var(--text-pure)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{t(`${step.contentKey}.introText2`)}</p>
        )}

        {sections && Array.isArray(sections) && sections.map((section: any, idx: number) => (
            <div key={idx} style={{ marginBottom: '24px' }}>
                {section.title && <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px' }}>{section.title}</h3>}
                
                {/* Single Array of text blocks */}
                {section.paragraphs && section.paragraphs.map((para: string, pIdx: number) => (
                    <p key={pIdx} style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>{para}</p>
                ))}

                {/* Standard Bullet Arrays (used in Liability Waiver and Code of Conduct) */}
                {section.bullets && (
                    <ul style={{ paddingLeft: '16px', marginBottom: '12px' }}>
                        {section.bullets.map((bullet: string, bIdx: number) => (
                            <li key={bIdx} style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px', listStyleType: 'disc' }}>
                                {bullet.startsWith('• ') ? bullet.substring(2) : bullet}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Subsections Array format (Used in NDA and Agreement) */}
                {section.subsections && section.subsections.map((sub: any, sIdx: number) => (
                   <div key={sIdx} style={{ marginBottom: '16px' }}>
                       {sub.title && <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '8px' }}>{sub.title}</h4>}
                       {sub.text && <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>{sub.text}</p>}
                       {sub.bullets && (
                           <ul style={{ paddingLeft: '16px', marginBottom: '12px' }}>
                                {sub.bullets.map((bullet: string, bIdx: number) => (
                                    <li key={bIdx} style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px', listStyleType: 'disc' }}>
                                        {bullet.startsWith('• ') ? bullet.substring(2) : bullet}
                                    </li>
                                ))}
                            </ul>
                       )}
                   </div> 
                ))}
            </div>
        ))}
        
        {/* Render signature closing block if it exists (Liability Waiver) */}
        {t(`${step.contentKey}.signatures.title`) !== `${step.contentKey}.signatures.title` && (
            <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px' }}>{t(`${step.contentKey}.signatures.title`)}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>{t(`${step.contentKey}.signatures.text`)}</p>
            </div>
        )}
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
        {t('Common.acceptAndContinue')}
      </Button>
    </>
  );

  if (effectiveChanging) {
    return <div className="page-wrapper page-wrapper--wide animate-fade-in">{legalContent}</div>;
  }
  return <AuthLayout>{legalContent}</AuthLayout>;
};
