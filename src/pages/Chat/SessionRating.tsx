import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Lock 
} from 'lucide-react';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { toastSuccess, toastError } from '../../utils/toast';
import apiInstance from '../../api/apiInstance';

// PNG icons matching native app
import happyIcon from '../../assets/icons/happy.png';
import sadIcon   from '../../assets/icons/sad.png';

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
  
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';
  const { type = 'chat', chat } = location.state || {};

  const [selectedRating, setSelectedRating] = useState<string>('ratingHelpful');
  const [tipAmount, setTipAmount] = useState(25);
  const [isLoading, setIsLoading] = useState(false);

  const isNegative = NEGATIVE_RATINGS.includes(selectedRating as any);

  const goToFeedback = () => {
    navigate(`/${role}/session/${id}/feedback`, {
      replace: true,
      state: { chat, type },
    });
  };

  const handleSendTip = async () => {
    if (!id) { goToFeedback(); return; }
    setIsLoading(true);
    try {
      await apiInstance.post(`session/${id}/tip`, {
        amountCurrency: tipAmount,
        message: 'Thanks for the support',
      });
      toastSuccess(t('SessionRating.tipSent'));
      goToFeedback();
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportIssue = () => {
    navigate(`/${role}/report`, { state: { chat, type, conversationId: id } });
  };

  const handleSkip = () => {
    goToFeedback();
  };

  // Slider position %
  const sliderPct = ((tipAmount - MIN_TIP) / (MAX_TIP - MIN_TIP)) * 100;

  return (
    <div className="page-wrapper animate-fade-in mb-8">
      <PageHeader title="" onBack={() => navigate(-1)} />

      <div className="flex flex-col items-center space-y-6 max-w-sm mx-auto">
        
        {/* Rating Icon Container */}
        <div className="w-24 h-24 rounded-[32px] glass-dark flex items-center justify-center mt-2 shadow-xl border border-white/5">
          <img
            src={isNegative ? sadIcon : happyIcon}
            alt="rating"
            className="w-12 h-12 object-contain brightness-0 invert"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center tracking-tight px-4 leading-tight">
          {t('SessionRating.title')}
        </h2>

        {/* Rating Pills */}
        <div className="flex flex-wrap justify-center gap-2 px-2">
          {ALL_RATINGS.map(key => {
            const isSelected = selectedRating === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedRating(key)}
                className={`px-5 py-2.5 rounded-full text-[13px] transition-all border ${
                  isSelected
                    ? 'text-white border-white/90 font-bold bg-white/10'
                    : 'text-white/60 border-white/10 bg-black/10 hover:border-white/20'
                }`}
              >
                {t(`SessionRating.${key}`)}
              </button>
            );
          })}
        </div>

        {/* Report an Issue Pill */}
        <button
          onClick={handleReportIssue}
          className="px-6 py-2.5 rounded-full text-[13px] text-white/80 border border-white/10 bg-black/10 hover:border-white/20 transition-all font-medium"
        >
          {t('SessionRating.reportIssue')}
        </button>

        {/* Main Action Card */}
        <div className="w-full">
          <GlassCard bordered padding="lg" rounded="3xl" className="bg-white/[0.02]">
            {isNegative ? (
              <div className="py-2">
                <p className="text-base font-medium text-white text-center leading-relaxed mb-10">
                  {t('SessionRating.apologyMessage')}
                </p>
                <div className="space-y-3">
                  <Button variant="glass" size="lg" fullWidth onClick={goToFeedback}>
                    {t('SessionRating.continue')}
                  </Button>
                  <Button variant="glass-bordered" size="lg" fullWidth onClick={handleSkip}>
                    {t('SessionRating.skip')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-[15px] font-medium text-white text-center mb-6">
                  {t('SessionRating.tipHeading')}
                </p>

                {/* Tip Bounds */}
                <div className="flex justify-between text-sm font-medium text-white mb-4 px-1">
                  <span>$ {MIN_TIP}</span>
                  <span>$ {MAX_TIP}</span>
                </div>

                {/* Custom Slider */}
                <div className="relative mb-12 flex items-center mt-10">
                  {/* Tooltip Bubble */}
                  <div 
                    className="absolute -top-10 h-8 min-w-[50px] bg-white rounded-lg flex items-center justify-center transition-all duration-75"
                    style={{ left: `calc(${sliderPct}% - 25px)` }}
                  >
                    <span className="text-black font-bold text-[13px]">$ {tipAmount}</span>
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                  </div>

                  <input
                    type="range"
                    min={MIN_TIP}
                    max={MAX_TIP}
                    value={tipAmount}
                    onChange={e => setTipAmount(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white ${sliderPct}%, rgba(255,255,255,0.2) ${sliderPct}%)`,
                    }}
                  />
                  {/* Thumb overlay */}
                  <div 
                    className="absolute h-5 w-5 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${sliderPct}% - 10px)` }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    variant="glass" 
                    size="lg" 
                    fullWidth 
                    onClick={handleSendTip}
                    loading={isLoading}
                    className="bg-black/30 h-[56px] font-bold text-base"
                  >
                    {t('SessionRating.sendTip')}
                  </Button>
                  <Button 
                    variant="glass-bordered" 
                    size="lg" 
                    fullWidth 
                    onClick={handleSkip}
                    className="h-[56px] font-bold text-base"
                  >
                    {t('SessionRating.skip')}
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Tips Disclaimer */}
        {!isNegative && (
          <div className="flex items-center justify-center gap-2 px-6 py-2">
            <Lock size={14} className="text-white flex-shrink-0" />
            <p className="text-[13px] text-white font-medium text-center leading-snug">
              {t('SessionRating.tipsDisclaimer')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
