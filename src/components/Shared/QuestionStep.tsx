import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import tickIcon from '../../assets/icons/tick.png';

export interface QuestionOption {
  id: string;
  label?: string;
  labelKey?: string;
  isPrimary?: boolean;
}

interface QuestionStepProps {
  step: number;
  totalSteps: number;
  titleKey: string;
  options: QuestionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

export const QuestionStep = ({
  step,
  totalSteps,
  titleKey,
  options,
  selectedValue,
  onSelect,
  onBack,
  onSkip
}: QuestionStepProps) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 600 }}>
          {step} / {totalSteps}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>
          {t(titleKey)}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
        {options.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <div 
              key={option.id}
              onClick={() => onSelect(option.id)}
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
                {option.labelKey ? t(option.labelKey) : option.label}
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
        <button 
          onClick={onSkip}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '15px', textDecoration: 'underline', cursor: 'pointer', padding: '12px' }}
        >
          {t('Common.skip')}
        </button>
      </div>
      
      <style>{`
        .selected-option {
          background: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </div>
  );
};
