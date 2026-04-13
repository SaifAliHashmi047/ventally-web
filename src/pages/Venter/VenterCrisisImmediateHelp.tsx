import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Phone, MessageSquare, ArrowRight, Clock } from 'lucide-react';

export const VenterCrisisImmediateHelp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const resources = [
    {
      icon: Phone,
      title: t('Crisis.call988', 'Call 988'),
      description: t('Crisis.call988Desc', '24/7 Suicide & Crisis Lifeline'),
      action: () => window.location.href = 'tel:988',
      variant: 'primary' as const,
    },
    {
      icon: MessageSquare,
      title: t('Crisis.text988', 'Text 988'),
      description: t('Crisis.text988Desc', 'Text HELLO to 988 for chat support'),
      action: () => window.location.href = 'sms:988',
      variant: 'glass' as const,
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Crisis.title', 'Crisis Support')}
        onBack={() => navigate(-1)}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-6">
          <Clock size={40} className="text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {t('Crisis.immediateHelp', 'Immediate Help Available')}
        </h2>

        <p className="text-gray-400 max-w-md mb-8">
          {t('Crisis.immediateHelpDesc', 'Connect with trained crisis counselors 24/7. Free, confidential support is just a call or text away.')}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {resources.map((resource, index) => (
          <GlassCard
            key={index}
            hover
            onClick={resource.action}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                resource.variant === 'primary' ? 'bg-primary/15' : 'glass'
              }`}>
                <resource.icon size={24} className={resource.variant === 'primary' ? 'text-primary' : 'text-accent'} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">{resource.title}</h3>
                <p className="text-sm text-gray-400">{resource.description}</p>
              </div>
              <ArrowRight size={20} className="text-gray-500" />
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="bg-accent/5 mb-6">
        <p className="text-sm text-gray-300 text-center">
          {t('Crisis.notAlone', 'You are not alone. Reach out for support — it is a sign of strength.')}
        </p>
      </GlassCard>

      <Button
        variant="ghost"
        size="lg"
        fullWidth
        onClick={() => navigate('/venter/crisis-988-support')}
      >
        {t('Crisis.moreResources', 'More Crisis Resources')}
      </Button>
    </div>
  );
};
