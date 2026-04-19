import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useSessions } from '../../api/hooks/useSessions';
import { toastSuccess, toastError } from '../../utils/toast';
import { Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export const SessionRating = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { submitFeedback } = useSessions();
  const user = useSelector((state: RootState) => state.user.user as any);
  const session = useSelector((state: RootState) => state.session);
  const role = user?.userType || 'venter';

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { type = 'chat', chat } = location.state || {};

  const RATING_LABELS: Record<number, string> = {
    5: '⭐ ' + t('SessionRating.ratingAwesome'),
    4: '👍 ' + t('SessionRating.ratingGood'),
    3: '😊 ' + t('SessionRating.ratingOkay'),
    2: '😐 ' + t('SessionRating.ratingHelpful'),
    1: '😞 ' + t('SessionRating.ratingHorrible'),
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const revieweeId = session?.listenerId || chat?.listener?.userId || chat?.otherParticipant?.userId;
      await submitFeedback(id!, { rating, comment: review || undefined, sessionType: type, revieweeId });
      toastSuccess(t('SessionRating.thankYouTitle'));
      navigate(`/${role}/home`, { replace: true });
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">{t('SessionRating.title')}</h2>
          <p className="text-gray-500 mt-1">{t('SessionRating.guidedSub')}</p>
        </div>

        <GlassCard bordered>
          {/* Stars */}
          <div className="flex justify-center gap-4 mb-4">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setRating(n)}>
                <Star
                  size={36}
                  className={`transition-all duration-150 ${
                    n <= rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600 hover:text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-sm font-medium text-white mb-4">
              {RATING_LABELS[rating]}
            </p>
          )}

          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder={t('SessionRating.feedbackPlaceholder')}
            className="input-field w-full h-24 resize-none"
          />
        </GlassCard>

        <div className="mt-4 space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={rating === 0}
            onClick={handleSubmit}
          >
            {t('SessionRating.submit')}
          </Button>
          <Button variant="glass" fullWidth onClick={() => navigate(`/${role}/home`, { replace: true })}>
            {t('SessionRating.skip')}
          </Button>
        </div>
      </div>
    </div>
  );
};
