import { useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Star } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import {
  ListenerSessionShell,
  SessionTypeBadge,
} from '../../components/Listener/ListenerSessionShell';

export const ListenerSessionRating = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const session = useSelector((state: RootState) => state.session);

  const { type = 'chat', chat } = (location.state || {}) as { type?: string; chat?: unknown };
  const sessionKind = useMemo(
    () => (type === 'call' ? 'call' : 'chat') as 'call' | 'chat',
    [type],
  );

  const [starRating, setStarRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const navigateHome = () => {
    navigate('/listener/home', { replace: true });
  };

  const handleBack = () => {
    if (!id) {
      navigate('/listener/home', { replace: true });
      return;
    }
    navigate(`/listener/session/${id}/feedback`, {
      replace: true,
      state: { chat, type: sessionKind },
    });
  };

  const runSuccessExit = () => {
    setShowSuccessOverlay(true);
    window.setTimeout(() => {
      setShowSuccessOverlay(false);
      navigateHome();
    }, 2200);
  };

  const handleSubmit = async () => {
    const payload = {
      sessionType: session?.sessionType || sessionKind,
      sessionId: session?.sessionId || id,
      revieweeId: session?.venterId,
      rating: starRating,
      comment: '',
    };

    setIsLoading(true);
    try {
      const res: any = await apiInstance.post('reviews', payload);
      if (res?.success || res?.data) {
        runSuccessExit();
      }
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    runSuccessExit();
  };

  return (
    <ListenerSessionShell
      title={t('ListenerRating.title')}
      subtitle={t('ListenerRating.subtitle')}
      onBack={handleBack}
      badge={<SessionTypeBadge kind={sessionKind} />}
      className="justify-center"
    >
      <GlassCard
        bordered
        padding="none"
        className="w-full rounded-3xl overflow-hidden border-white/10 bg-black/25 backdrop-blur-xl shadow-xl"
      >
        <div className="px-4 sm:px-8 pt-6 sm:pt-10 pb-2 text-center">
          <p className="text-xs sm:text-sm text-white/45 max-w-md mx-auto leading-relaxed">
            {t('ListenerRating.guidedSub')}
          </p>
        </div>

        <div className="px-4 sm:px-8 pb-8 sm:pb-10">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 max-w-lg mx-auto">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStarRating(n)}
                className="p-2 sm:p-2.5 rounded-2xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-all duration-150 ${n <= starRating
                      ? 'text-white fill-white drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                      : 'text-white/20 hover:text-white/35'
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/25 px-4 sm:px-6 py-4 sm:py-5">
          <Button
            variant={starRating > 0 ? 'primary' : 'glass'}
            size="lg"
            fullWidth
            loading={isLoading}
            className="min-h-[50px] sm:min-h-[52px] rounded-2xl"
            onClick={starRating > 0 ? handleSubmit : handleSkip}
          >
            {starRating > 0 ? t('Common.submit') : t('SessionRating.skip')}
          </Button>
        </div>
      </GlassCard>

      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <GlassCard
            bordered
            className="w-full max-w-md rounded-3xl p-8 sm:p-10 text-center border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl animate-scale-up"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('ListenerRating.earningsLogged')}</h3>
            <p className="text-sm text-white/55 leading-relaxed">{t('ListenerRating.earningsLoggedSub')}</p>
          </GlassCard>
        </div>
      )}
    </ListenerSessionShell>
  );
};
