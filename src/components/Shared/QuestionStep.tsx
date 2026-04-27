import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BubblePattern } from './BubblePattern';

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
  selectedValues?: string[];
  onSelect: (value: string) => void;
  onBack: () => void;
  onSkip?: () => void;
  onContinue?: () => void;
  continueText?: string;
  skipText?: string;
  loading?: boolean;
  useBubblePattern?: boolean;
}

export const QuestionStep = ({
  step,
  totalSteps,
  titleKey,
  options,
  selectedValue,
  selectedValues,
  onSelect,
  onBack,
  onSkip,
  onContinue,
  continueText,
  skipText,
  loading = false,
  useBubblePattern = false,
}: QuestionStepProps) => {
  const { t } = useTranslation();

  const isSelected = (id: string) =>
    selectedValues
      ? selectedValues.includes(id)
      : selectedValue === id;

  const hasSelection = selectedValues
    ? selectedValues.length > 0
    : !!selectedValue;

  const showContinue = hasSelection && onContinue;
  const showSkip = !!onSkip;
  const showBottomBtn = showContinue || showSkip;

  const btnLabel = showContinue
    ? (continueText || t('QuestionStep.continue', 'Continue'))
    : (skipText || t('QuestionStep.skip', 'Skip'));

  const handleBottomAction = showContinue ? onContinue : onSkip;

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-48px)] relative">
      {/* ── Absolute Header — keeps headers top-aligned while content centers ── */}
      <div className="absolute top-0 left-0 right-0 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <ArrowLeft size={18} />
          </button>
          
          <div
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            {t('QuestionStep.stepOf', {
              step: String(step),
              total: String(totalSteps),
              defaultValue: `Step ${step}/${totalSteps}`,
            })}
          </div>
        </div>
      </div>

      {/* ── Vertically Centered Main Content ── */}
      <div className="flex-1 flex flex-col justify-center mt-16 mb-4">
        <h1 className="text-xl font-bold text-white text-center mb-8">
          {t(titleKey)}
        </h1>

        {useBubblePattern ? (
          <BubblePattern 
            options={options}
            selectedValue={selectedValue}
            selectedValues={selectedValues}
            onSelect={onSelect}
            className="mb-8"
          />
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 mb-8 pr-1 scrollbar-hide max-h-[50vh]">
            {options.map((option) => {
              const selected = isSelected(option.id);
              const label = option.labelKey ? t(option.labelKey) : (option.label || option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
                  style={{
                    background: selected
                      ? 'rgba(255,255,255,0.14)'
                      : 'rgba(255,255,255,0.04)',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <span className={`text-sm flex-1 text-left ${selected ? 'font-semibold text-white' : 'font-normal text-white/90'}`}>
                    {label}
                  </span>
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 ml-4 flex items-center justify-center border-2 transition-all"
                    style={{
                      borderColor: selected ? '#C2AEBF' : 'rgba(255,255,255,0.35)',
                      background: selected ? '#C2AEBF' : 'transparent',
                    }}
                  >
                    {selected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom action button ── */}
      {showBottomBtn && (
      <div className="mt-auto pb-4">
        <button
          onClick={handleBottomAction}
          disabled={loading}
          className="btn w-full py-4 text-sm font-semibold transition-all"
          style={
            showContinue
              ? {
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white',
                  backdropFilter: 'blur(20px)',
                }
              : {
                  background: 'transparent',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.6)',
                }
          }
        >
          {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : btnLabel}
        </button>
      </div>
      )}
    </div>
  );
};
