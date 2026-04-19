import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Star } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';

export const ListenerSessionRating = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const session = useSelector((state: RootState) => state.session);
  const user = useSelector((state: RootState) => state.user.user as any);

  const { type = 'chat' } = location.state || {};

  const [starRating, setStarRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);

  const navigateHome = () => {
    navigate('/listener/home', { replace: true });
  };

  const handleSubmit = async () => {
    const payload = {
      sessionType: session?.sessionType || type,
      sessionId: session?.sessionId || id,
      // Listener reviews the VENTER (opposite of venter reviewing listener)
      revieweeId: session?.venterId,
      rating: starRating,
      comment: '', // Listener comment is optional/empty per RN app
    };

    setIsLoading(true);
    try {
      const res: any = await apiInstance.post('reviews', payload);
      if (res?.success || res?.data) {
        setShowEarningsModal(true);
        setTimeout(() => {
          setShowEarningsModal(false);
          navigateHome();
        }, 2000);
      }
    } catch (err: any) {
      toastError(err?.error || t('Common.somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setShowEarningsModal(true);
    setTimeout(() => {
      setShowEarningsModal(false);
      navigateHome();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm">
        <GlassCard bordered>
          {/* Title */}
          <div className="text-center mb-6 px-2">
            <h2 className="text-xl font-semibold text-white mb-1">
              {t('ListenerRating.title')}
            </h2>
            <p className="text-sm text-white/60">
              {t('ListenerRating.subtitle')}
            </p>
            <p className="text-xs text-white/40 mt-1">
              {t('ListenerRating.guidedSub')}
            </p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setStarRating(n)}>
                <Star
                  size={36}
                  className={`transition-all duration-150 ${
                    n <= starRating
                      ? 'text-yellow-400 fill-yellow-400 scale-110'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Single button — Submit if rated, Skip if not */}
          <Button
            variant="glass"
            size="lg"
            fullWidth
            loading={isLoading}
            onClick={starRating > 0 ? handleSubmit : handleSkip}
            className="rounded-t-none -mx-4 -mb-4 w-[calc(100%+2rem)] rounded-b-2xl border-t border-white/10"
          >
            {starRating > 0 ? t('Common.submit') : t('SessionRating.skip')}
          </Button>
        </GlassCard>
      </div>

      {/* Earnings Logged Modal */}
      <Modal
        isOpen={showEarningsModal}
        onClose={() => {}}
        title={t('ListenerRating.earningsLogged')}
        size="sm"
      >
        <p className="text-sm text-gray-400 text-center">
          {t('ListenerRating.earningsLoggedSub')}
        </p>
      </Modal>
    </div>
  );
};
