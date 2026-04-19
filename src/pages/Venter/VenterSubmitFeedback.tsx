import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';
import { MessageSquarePlus } from 'lucide-react';

export const VenterSubmitFeedback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    try {
      await apiInstance.post('support/feedback', { rating: 5, comment: feedback });
      toastSuccess(t('Feedback.successMessage'));
      navigate(-1);
    } catch (e: any) {
      toastError(e?.error || e?.message || t('Common.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Feedback.title')} onBack={() => navigate(-1)} />

      <GlassCard className="mb-4">
        <div className="flex items-start gap-3">
          <MessageSquarePlus size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('Feedback.description')}
          </p>
        </div>
      </GlassCard>

      <GlassCard bordered className="mb-4">
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder={t('Feedback.placeholder')}
          rows={5}
          className="input-field w-full resize-none text-sm leading-relaxed"
        />
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!feedback.trim()}
        onClick={handleSubmit}
      >
        {t('Feedback.submit')}
      </Button>
    </div>
  );
};
