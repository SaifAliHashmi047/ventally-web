import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Shield, Heart, ArrowRight } from 'lucide-react';

export const VenterCrisisSafe = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Crisis.title', 'Crisis Support')}
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-6">
          <Shield size={40} className="text-success" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t('Crisis.safe', 'You are safe')}
        </h2>

        <p className="text-gray-400 max-w-md mb-8">
          {t('Crisis.safeDesc', 'We are here to support you. Let us guide you to the resources that can help.')}
        </p>
      </div>

      <GlassCard className="mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl glass-accent flex items-center justify-center flex-shrink-0">
            <Heart size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              {t('Crisis.youMatter', 'You matter')}
            </h3>
            <p className="text-sm text-gray-400">
              {t('Crisis.youMatterDesc', 'Whatever you are going through, you do not have to face it alone. Support is available.')}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight size={20} />}
          onClick={() => navigate('/venter/crisis-immediate-help')}
        >
          {t('Crisis.getHelp', 'Get Help Now')}
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
