import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Info, Check, ArrowRight } from 'lucide-react';

export const VenterCrisisDisclaimer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const fromChat = location.state?.fromChat || false;

  const points = [
    t('Crisis.disclaimer1', 'Ventally is not a substitute for professional mental health services.'),
    t('Crisis.disclaimer2', 'Our listeners are trained peers, not licensed therapists.'),
    t('Crisis.disclaimer3', 'If you are experiencing a life-threatening emergency, please call 911.'),
    t('Crisis.disclaimer4', 'Crisis resources are available 24/7 through the 988 Lifeline.'),
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Crisis.title', 'Crisis Support')}
        onBack={() => {
          // If coming from chat, navigate to dashboard instead of back to chat
          if (fromChat) {
            navigate('/venter/dashboard', { replace: true });
          } else {
            navigate(-1);
          }
        }}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Info size={40} className="text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t('Crisis.disclaimer', 'Important Information')}
        </h2>
      </div>

      <GlassCard className="mb-6">
        <div className="space-y-4">
          {points.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={12} className="text-primary" />
              </div>
              <p className="text-sm text-gray-300">{point}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight size={20} />}
          onClick={() => navigate('/venter/crisis-immediate-help', { state: { fromChat } })}
        >
          {t('Common.continue', 'Continue')}
        </Button>

        <Button
          variant="glass"
          size="lg"
          fullWidth
          onClick={() => navigate('/venter/home')}
        >
          {t('Common.back', 'Back to Home')}
        </Button>
      </div>
    </div>
  );
};
