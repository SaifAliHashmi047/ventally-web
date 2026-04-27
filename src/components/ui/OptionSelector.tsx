import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { updateUser } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import type { RootState } from '../../store/store';
import { Check } from 'lucide-react';

interface OptionSelectorProps {
  title: string;
  options: string[];
  storeKey: string;
  multiSelect?: boolean;
}

export const OptionSelector = ({ title, options, storeKey, multiSelect = false }: OptionSelectorProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateProfile } = useAuth();
  const user = useSelector((state: RootState) => state.user.user as any);

  const initValue = user?.[storeKey];
  const [selected, setSelected] = useState<string | string[]>(
    multiSelect
      ? (Array.isArray(initValue) ? initValue : [])
      : (initValue || '')
  );
  const [saving, setSaving] = useState(false);

  const toggle = (opt: string) => {
    if (multiSelect) {
      setSelected(prev => {
        const arr = prev as string[];
        return arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt];
      });
    } else {
      setSelected(opt);
    }
  };

  const isSelected = (opt: string) =>
    multiSelect ? (selected as string[]).includes(opt) : selected === opt;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ [storeKey]: selected });
      dispatch(updateUser({ [storeKey]: selected }) as any);
      navigate(-1);
    } catch {
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={title} onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl" className="mb-5">
        {options.map((opt, i, arr) => {
          const active = isSelected(opt);
          const isLast = i === arr.length - 1;
          return (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              className={`settings-item flex justify-between items-center px-4 py-3 cursor-pointer ${!isLast ? 'border-b border-white/5' : ''} ${active ? 'bg-accent/5' : ''}`}
              style={{ borderBottomWidth: isLast ? 0 : undefined }}
            >
              <span className={`text-sm font-medium ${active ? 'text-accent' : 'text-white'}`}>{opt}</span>
              {active && (
                <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
                  <Check size={13} className="text-primary" />
                </div>
              )}
            </div>
          );
        })}
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        disabled={multiSelect ? (selected as string[]).length === 0 : !selected}
        onClick={handleSave}
      >
        {t('Common.save', 'Save')}
      </Button>
    </div>
  );
};
