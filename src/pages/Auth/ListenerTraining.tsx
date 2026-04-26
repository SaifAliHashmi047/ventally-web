import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';
import { AccordionItem } from '../../components/Shared/AccordionItem';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import listenerTopImage from '../../assets/images/listenerTopImage.png';
import { Button } from '../../components/ui/Button';

export const ListenerTraining = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // Expanded mission block initially
  const [expandedSection, setExpandedSection] = useState<string | null>('module1');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showError, setShowError] = useState(false);

  const modules = t('ListenerTraining.complianceModules', { returnObjects: true }) as any[];

  const handleToggle = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newChecked = { ...checkedItems, [id]: checked };
    setCheckedItems(newChecked);
    
    if (checked && showError) {
        const allChecked = modules?.every(m => newChecked[m.id]);
        if (allChecked) setShowError(false);
    }
  };

  const isAllChecked = modules?.every(m => checkedItems[m.id]);

  const { isAccountChanging, resolve } = useAccountChangeFlow();
  const legacyAccountTypeChanging = (location.state as any)?.accountTypeChanging;
  const effectiveChanging = isAccountChanging || legacyAccountTypeChanging;

  const handleContinue = () => {
    if (isAllChecked) {
      navigate(resolve('listener-legal'));
    } else {
      setShowError(true);
    }
  };

  const trainingContent = (
    <>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', height: '220px' }}>
        <img src={listenerTopImage} alt="Training" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ height: '450px', overflowY: 'auto', paddingRight: '8px', marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '8px' }}>
              {t('ListenerTraining.title')}
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.5' }}>
              {t('ListenerTraining.subtitle')}
            </p>
          </div>

          {/* Expertise Container */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-pure)', marginBottom: '12px' }}>
                {t('ListenerTraining.expertise')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <div className="glass" style={{ padding: '8px 16px', borderRadius: '100px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-pure)' }}>{t('ListenerTraining.emotionalIntelligence')}</span>
                </div>
                <div className="glass" style={{ padding: '8px 16px', borderRadius: '100px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-pure)' }}>{t('ListenerTraining.activeListening')}</span>
                </div>
            </div>
          </div>

          {/* Course Overview */}
          <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px' }}>
                  {t('ListenerTraining.courseOverview')}
              </h3>
              <div className="glass" style={{ padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                      {t('ListenerTraining.courseDescription')}
                  </p>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass" style={{ padding: '16px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-pure)' }}>{t('ListenerTraining.hours')}</p>
                      <Clock size={20} color="white" />
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-pure)' }}>2</p>
                </div>
                <div className="glass" style={{ padding: '16px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-pure)' }}>{t('ListenerTraining.modules')}</p>
                      <BookOpen size={20} color="white" />
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-pure)' }}>7</p>
                </div>
              </div>
          </div>

          {/* Compliance Modules Accordions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {modules?.map((module) => (
              <AccordionItem 
                key={module.id} 
                title={module.title} 
                isExpanded={expandedSection === module.id}
                onToggle={() => handleToggle(module.id)}
              >
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                    {module.content}
                </p>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
                  <input 
                    type="checkbox" 
                    checked={checkedItems[module.id] || false}
                    onChange={(e) => handleCheckboxChange(module.id, e.target.checked)}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', accentColor: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-pure)', lineHeight: '1.4' }}>{module.checkboxLabel}</span>
                </label>
              </AccordionItem>
            ))}
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {showError && !isAllChecked && (
          <p style={{ color: '#FF5252', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
            {t('ListenerTraining.agreeAllTerms')}
          </p>
        )}
        <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
          {t('ListenerTraining.continue')}
        </Button>
      </div>
    </>
  );

  if (effectiveChanging) {
    return <div className="page-wrapper page-wrapper--wide animate-fade-in">{trainingContent}</div>;
  }
  return <AuthLayout>{trainingContent}</AuthLayout>;
};
