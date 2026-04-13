import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { AlertTriangle, ArrowRight, Phone } from 'lucide-react';

export const VenterCrisisWarning = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Crisis.title', 'Crisis Support')}
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-error/15 flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="text-error" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t('Crisis.warning', 'Are you in immediate danger?')}
        </h2>

        <p className="text-gray-400 max-w-md mb-8">
          {t('Crisis.warningDesc', 'If you or someone you know is in immediate danger, please call emergency services right away.')}
        </p>
      </div>

      <GlassCard bordered className="bg-error/5 border-error/20 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Phone size={24} className="text-error" />
          <span className="text-lg font-semibold text-white">911</span>
        </div>
        <p className="text-sm text-gray-400">
          {t('Crisis.emergencyServices', 'Emergency Services')}
        </p>
      </GlassCard>

      <div className="space-y-3">
        <Button
          variant="danger"
          size="lg"
          fullWidth
          leftIcon={<Phone size={20} />}
          onClick={() => window.location.href = 'tel:911'}
        >
          {t('Crisis.callEmergency', 'Call 911')}
        </Button>

        <Button
          variant="glass"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight size={20} />}
          onClick={() => navigate('/venter/crisis-safe')}
        >
          {t('Crisis.notInDanger', 'I am not in immediate danger')}
        </Button>
      </div>
    </div>
  );
};
