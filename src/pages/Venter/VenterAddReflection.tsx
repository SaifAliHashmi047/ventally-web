import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { useReflections } from '../../api/hooks/useReflections';
import { toastSuccess, toastError } from '../../utils/toast';
import { PenLine } from 'lucide-react';

export const VenterAddReflection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addReflection } = useReflections();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addReflection(text.trim());
      toastSuccess(t('VenterHome.reflectionSuccess.message'));
      navigate('/venter/reflections');
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('VenterHome.addReflection')} />

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center">
          <PenLine size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-white">{t('VenterHome.addReflectionSubtitle')}</p>
          <p className="text-xs text-white/80">{t('VenterHome.reflectionPrompt')}</p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t('VenterHome.reflectionPlaceholder')}
        className="input-field w-full min-h-64 resize-none text-base leading-relaxed"
        autoFocus
        maxLength={2000}
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-600">{text.length}/2000</p>
        <p className="text-xs text-gray-600">{new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        disabled={!text.trim()}
        onClick={handleSave}
      >
        {t('VenterHome.saveReflection')}
      </Button>
    </div>
  );
};
