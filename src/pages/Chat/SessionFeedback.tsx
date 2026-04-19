import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useSessions } from '../../api/hooks/useSessions';
import { toastSuccess, toastError } from '../../utils/toast';
import { Star } from 'lucide-react';

const TOPICS = ['Anxiety', 'Relationships', 'Work Stress', 'Depression', 'Family', 'Loneliness', 'Other'];

export const SessionFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { submitFeedback } = useSessions();
  const session = useSelector((state: RootState) => state.session);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { type = 'chat', chat } = location.state || {};

  const toggleTopic = (topic: string) =>
    setTopics(prev => prev.includes(topic) ? prev.filter(x => x !== topic) : [...prev, topic]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const revieweeId = session?.listenerId || chat?.listener?.userId || chat?.otherParticipant?.userId;
      await submitFeedback(id!, { rating, comment, topics, sessionType: type, revieweeId });
      toastSuccess(t('SessionRating.thankYouTitle'));
      navigate(`/${location.pathname.split('/')[1]}/session/${id}/rating`, { replace: true });
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('SessionRating.title')} />

      <GlassCard bordered>
        <p className="text-center text-sm text-gray-400 mb-4">{t('SessionRating.moodCheckSubtitle')}</p>

        {/* Star Rating */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setRating(n)}>
              <Star size={32} className={`transition-all ${n <= rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600'}`} />
            </button>
          ))}
        </div>

        {/* Topics */}
        <p className="section-label mb-3">{t('SessionRating.helpfulRatingLabel')}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {TOPICS.map(topic => (
            <button key={topic} onClick={() => toggleTopic(topic)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
                topics.includes(topic) ? 'bg-accent/15 text-accent border border-accent/25' : 'glass text-gray-400'
              }`}
            >{topic}</button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={t('SessionRating.feedbackPlaceholder')}
          className="input-field w-full h-24 resize-none"
        />
      </GlassCard>

      <Button variant="primary" size="lg" fullWidth loading={submitting} onClick={handleSubmit}>
        {t('SessionRating.submit')}
      </Button>
      <Button variant="glass" fullWidth onClick={() => navigate(-1)} className="mt-2">
        {t('SessionRating.skip')}
      </Button>
    </div>
  );
};
