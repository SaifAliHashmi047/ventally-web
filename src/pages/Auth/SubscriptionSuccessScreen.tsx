import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubscriptionSuccessScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti on success logic
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B35', '#A5B5E1', '#E1BEE7']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B35', '#A5B5E1', '#E1BEE7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex flex-col items-center justify-center mb-6 shadow-glow-primary">
          <Sparkles size={44} className="text-primary animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          {t('SubscriptionSuccess.title', 'You are all set!')}
        </h1>
        
        <p className="text-base text-gray-400 leading-relaxed mb-10 max-w-sm">
          {t('SubscriptionSuccess.desc', 'Your subscription is now active. Enjoy premium features and start your wellness journey with us.')}
        </p>

        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => navigate('/venter/home')}
        >
          {t('SubscriptionSuccess.goToDashboard', 'Go to Dashboard')}
        </Button>
      </div>
    </AuthLayout>
  );
};
