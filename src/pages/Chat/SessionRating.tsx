/**
 * VENTER — Session Rating Screen (shown FIRST after session ends)
 * Matches RN SessionRatingScreen:
 *   - Rating label buttons (Helpful / Awesome / Good / Okay / Horrible)
 *   - Tip slider (positive ratings) or apology message (negative ratings)
 *   - Send Tip / Continue / Skip → navigates to SessionFeedback
 */
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { toastSuccess, toastError } from '../../utils/toast';
import apiInstance from '../../api/apiInstance';

// Same PNG icons as RN app
import happyIcon from '../../assets/icons/happy.png';
import sadIcon   from '../../assets/icons/sad.png';

// Rating options — same order as RN ALL_RATINGS
const POSITIVE_RATINGS = ['ratingHelpful', 'ratingAwesome', 'ratingGood'] as const;
const NEGATIVE_RATINGS = ['ratingOkay', 'ratingHorrible'] as const;
const ALL_RATINGS = [...POSITIVE_RATINGS, ...NEGATIVE_RATINGS] as const;

const MIN_TIP = 1;
const MAX_TIP = 100;

export const SessionRating = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const session = useSelector((state: RootState) => state.session);
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';

  const { type = 'chat', chat } = location.state || {};

  const [selectedRating, setSelectedRating] = useState<string>('ratingHelpful');
  const [tipAmount, setTipAmount] = useState(25);
  const [isLoading, setIsLoading] = useState(false);

  const isNegative = NEGATIVE_RATINGS.includes(selectedRating as any);

  // Navigate to SessionFeedback (second screen in venter flow)
  const goToFeedback = () => {
    navigate(`/${role}/session/${id}/feedback`, {
      replace: true,
      state: { chat, type },
    });
  };

  const handleSendTip = async () => {
    const sessionId = session?.sessionId || id;
    if (!sessionId) { goToFeedback(); return; }
    setIsLoading(true);
    try {
      await apiInstance.post(`session/${sessionId}/tip`, {
        amountCurrency: tipAmount,
        message: 'Thanks for the support',
      });
      toastSuccess(t('SessionRating.tipSent'));
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
    goToFeedback();
  };

  const handleReportIssue = () => {
    navigate(`/${role}/report`, { state: { chat, type, conversationId: id } });
  };

  // Tip slider position %
  const sliderPct = ((tipAmount - MIN_TIP) / (MAX_TIP - MIN_TIP)) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm space-y-5">

        {/* Icon — happy or sad PNG matching RN getRatingIcon() */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center">
            <img
              src={isNegative ? sadIcon : happyIcon}
              alt={isNegative ? 'sad' : 'happy'}
              className="w-12 h-12 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white text-center">
          {t('SessionRating.title')}
        </h2>

        {/* Rating label buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {ALL_RATINGS.map(key => {
            const isSelected = selectedRating === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedRating(key)}
                className={`px-4 py-2 rounded-full text-sm transition-all border ${
                  isSelected
                    ? 'text-white border-white/60 font-semibold'
                    : 'text-white/60 border-white/15 hover:border-white/30'
                }`}
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                {t(`SessionRating.${key}`)}
              </button>
            );
          })}
        </div>

        {/* Report an issue */}
        <div className="flex justify-center">
          <button
            onClick={handleReportIssue}
            className="px-5 py-2 rounded-full text-sm text-white/60 border border-white/15 hover:border-white/30 transition-all"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            {t('SessionRating.reportIssue')}
          </button>
        </div>

        {/* Tip / Apology card */}
        <GlassCard bordered>
          {isNegative ? (
            /* Apology message for negative ratings */
            <p className="text-sm text-white text-center leading-relaxed mb-6">
              {t('SessionRating.apologyMessage')}
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-white text-center mb-4">
                {t('SessionRating.tipHeading')}
              </p>

              {/* Tip amount labels */}
              <div className="flex justify-between text-sm text-white mb-3">
                <span>$ {MIN_TIP}</span>
                <span>$ {MAX_TIP}</span>
              </div>

              {/* Slider */}
              <div className="relative mb-6 px-1">
                <input
                  type="range"
                  min={MIN_TIP}
                  max={MAX_TIP}
                  value={tipAmount}
                  onChange={e => setTipAmount(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, white ${sliderPct}%, rgba(255,255,255,0.2) ${sliderPct}%)`,
                  }}
                />
                {/* Value bubble */}
                <div
                  className="absolute -top-8 bg-white text-black text-xs font-bold px-2 py-0.5 rounded-lg pointer-events-none"
                  style={{ left: `calc(${sliderPct}% - 18px)` }}
                >
                  ${tipAmount}
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              variant="glass"
              size="lg"
              fullWidth
              loading={isLoading}
              onClick={isNegative ? goToFeedback : handleSendTip}
            >
              {t(isNegative ? 'SessionRating.continue' : 'SessionRating.sendTip')}
            </Button>
            <Button variant="glass" size="lg" fullWidth onClick={goToFeedback}>
              {t('SessionRating.skip')}
            </Button>
          </div>
        </GlassCard>

        {/* Disclaimer — only for positive ratings */}
        {!isNegative && (
          <p className="text-xs text-white/60 text-center">
            🔒 {t('SessionRating.tipsDisclaimer')}
          </p>
        )}
      </div>
    </div>
  );
};
