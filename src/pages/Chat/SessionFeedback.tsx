/**
 * VENTER — Session Feedback Screen (shown SECOND after SessionRating)
 * Matches RN SessionFeedbackScreen:
 *   - Mood emoji selector (5 moods)
 *   - Feedback text input (required)
 *   - Star rating (required, 1-5)
 *   - Submit → thank-you state → home
 *   - Skip → home
 */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Star } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import heartIcon from '../../assets/icons/heart.png';

// Same PNG icons as RN app
import happyIcon   from '../../assets/icons/happy.png';
import neutralIcon from '../../assets/icons/neutral.png';
import sadIcon     from '../../assets/icons/sad.png';
import anxiousIcon from '../../assets/icons/anxious.png';

// Mood emojis — same as RN MOOD_EMOJIS (uses happy icon for veryHappy too, matching RN)
const MOOD_EMOJIS = [
  { key: 'veryHappy', icon: happyIcon,   label: 'Very Happy' },
  { key: 'happy',     icon: happyIcon,   label: 'Happy'      },
  { key: 'neutral',   icon: neutralIcon, label: 'Neutral'    },
  { key: 'sad',       icon: sadIcon,     label: 'Sad'        },
  { key: 'verySad',   icon: anxiousIcon, label: 'Very Sad'   },
] as const;

export const SessionFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const session = useSelector((state: RootState) => state.session);
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';

  const { type = 'chat', chat } = location.state || {};

  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [feedback, setFeedback] = useState('');
  const [starRating, setStarRating] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-navigate home 3s after thank-you shown — matches RN
  useEffect(() => {
    if (!showThankYou) return;
    timerRef.current = setTimeout(() => {
      navigate(`/${role}/home`, { replace: true });
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showThankYou, navigate, role]);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toastError(t('Common.fillRequiredFields'));
      return;
    }
    if (starRating === 0) {
      toastError(t('Common.fillRequiredFields'));
      return;
    }

    const payload = {
      sessionType: type,
      sessionId: session?.sessionId || id,
      revieweeId: session?.listenerId,
      rating: starRating,
      comment: feedback.trim(),
    };

    setIsLoading(true);
    try {
      const res: any = await apiInstance.post('reviews', payload);
      if (res?.success || res?.data) {
        setShowThankYou(true);
      }
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setShowThankYou(true);
  };

  // ── Thank-you screen ──────────────────────────────────────────────────────
  if (showThankYou) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 animate-fade-in"
        onClick={() => navigate(`/${role}/home`, { replace: true })}
      >
        <GlassCard bordered className="w-full max-w-sm text-center py-12 cursor-pointer">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-semibold text-white">
              {t('SessionRating.thankYouTitle')}
            </h2>
            <img
              src={heartIcon}
              alt="heart"
              className="w-7 h-7 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(600%) hue-rotate(320deg) brightness(110%)' }}
            />
          </div>
        </GlassCard>
      </div>
    );
  }

  // ── Main feedback screen ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm space-y-5">

        {/* Title + subtitle */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-1">
            {t('SessionRating.moodCheckTitle')}
          </h2>
          <p className="text-sm text-white/60">
            {t('SessionRating.moodCheckSubtitle')}
          </p>
        </div>

        <GlassCard bordered>
          {/* Mood emoji selector */}
          <div className="flex justify-center gap-3 mb-5">
            {MOOD_EMOJIS.map(mood => (
              <button
                key={mood.key}
                onClick={() => setSelectedMood(mood.key)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  selectedMood === mood.key
                    ? 'bg-white/20 scale-110'
                    : 'bg-black/40 hover:bg-white/10'
                }`}
              >
                <img
                  src={mood.icon}
                  alt={mood.label}
                  className="w-7 h-7 object-contain"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                />
              </button>
            ))}
          </div>

          {/* Feedback label */}
          <p className="text-sm font-medium text-white mb-2">
            {t('SessionRating.feedbackLabel')}
          </p>

          {/* Feedback textarea — required */}
          <GlassCard
            bordered
            padding="none"
            rounded="2xl"
            className={`mb-4 ${!feedback.trim() ? 'border-error/30' : ''}`}
          >
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder={t('SessionRating.feedbackPlaceholder')}
              className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 resize-none outline-none text-sm"
              rows={4}
            />
          </GlassCard>

          {/* Star rating label */}
          <p className="text-sm font-medium text-white text-center mb-3">
            {t('SessionRating.helpfulRatingLabel')}
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-3 mb-5">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setStarRating(n)}>
                <Star
                  size={28}
                  className={`transition-all ${
                    n <= starRating
                      ? 'text-yellow-400 fill-yellow-400 scale-110'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              variant="glass"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!feedback.trim() || starRating === 0}
              onClick={handleSubmit}
            >
              {t('SessionRating.submit')}
            </Button>
            <Button
              variant="glass"
              size="lg"
              fullWidth
              onClick={handleSkip}
            >
              {t('SessionRating.skip')}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
