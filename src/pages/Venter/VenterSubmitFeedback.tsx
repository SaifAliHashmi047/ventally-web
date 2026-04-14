import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import apiInstance from '../../api/apiInstance';
import { MessageSquarePlus, CheckCircle } from 'lucide-react';

export const VenterSubmitFeedback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    setError('');
    try {
      await apiInstance.post('support/feedback', { rating: 5, comment: feedback });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.error || e?.message || t('Common.somethingWentWrong', 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title={t('Feedback.title', 'Feedback')} onBack={() => navigate(-1)} />
        <GlassCard bordered className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-success" />
          </div>
          <p className="text-lg font-bold text-white mb-2">{t('Feedback.successTitle', 'Feedback Submitted')}</p>
          <p className="text-sm text-gray-500 mb-6">{t('Feedback.successMessage', 'Your feedback has been submitted.')}</p>
          <Button variant="primary" onClick={() => navigate(-1)}>Done</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Feedback.title', 'Feedback')} onBack={() => navigate(-1)} />

      {/* Description */}
      <GlassCard className="mb-4">
        <div className="flex items-start gap-3">
          <MessageSquarePlus size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('Feedback.description', 'Your feedback helps us improve the space we\'re building for you. Tell us what\'s working and what we can do better.')}
          </p>
        </div>
      </GlassCard>

      <GlassCard bordered className="mb-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-300">{t('Feedback.placeholder', 'Add your feedback')}</p>
          <textarea
            value={feedback}
            onChange={e => { setFeedback(e.target.value); setError(''); }}
            placeholder={t('Feedback.placeholder', 'Add your feedback')}
            rows={5}
            className="input-field w-full resize-none text-sm leading-relaxed"
          />
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!feedback.trim()}
        onClick={handleSubmit}
      >
        {t('Feedback.submit', 'Submit')}
      </Button>
    </div>
  );
};
