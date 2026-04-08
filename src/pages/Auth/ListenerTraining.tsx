import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { AccordionItem } from '../../components/Shared/AccordionItem';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import listenerTopImage from '../../assets/images/listenerTopImage.png';

export const ListenerTraining = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>('module1');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const modules = t('ListenerTraining.complianceModules', { returnObjects: true }) as any[];

  const handleToggle = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllChecked = modules?.every(m => checkedItems[m.id]);

  const handleContinue = () => {
    if (isAllChecked) {
      navigate('/signup/listener-legal');
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

      <div style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '32px' }}>
        <img src={listenerTopImage} alt="Training" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '12px' }}>
          {t('ListenerTraining.title')}
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: '1.5' }}>
          {t('ListenerTraining.subtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="glass" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
          <Clock size={24} color="white" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>{t('ListenerTraining.hours')}</p>
          <p style={{ fontSize: '20px', fontWeight: 700 }}>2</p>
        </div>
        <div className="glass" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
          <BookOpen size={24} color="white" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>{t('ListenerTraining.modules')}</p>
          <p style={{ fontSize: '20px', fontWeight: 700 }}>8</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
        {modules?.map((module) => (
          <AccordionItem 
            key={module.id} 
            title={module.title} 
            isExpanded={expandedSection === module.id}
            onToggle={() => handleToggle(module.id)}
          >
            <p style={{ marginBottom: '16px' }}>{module.content}</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={checkedItems[module.id] || false}
                onChange={() => handleCheckboxChange(module.id)}
                style={{ width: '20px', height: '20px', borderRadius: '4px', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '14px', color: 'white' }}>{module.checkboxLabel}</span>
            </label>
          </AccordionItem>
        ))}
      </div>

      <button 
        onClick={handleContinue}
        className="btn-primary" 
        style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
        disabled={!isAllChecked}
      >
        {t('ListenerTraining.continue')}
      </button>
    </AuthLayout>
  );
};
