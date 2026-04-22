import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Phone, Globe, Heart, ExternalLink, ArrowLeft } from 'lucide-react';

export const VenterCrisis988Support = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const resources = [
    {
      icon: Phone,
      title: '988 Suicide & Crisis Lifeline',
      description: t('Crisis.crisisLifelineDesc', '24/7 free, confidential support'),
      phone: '988',
    },
    {
      icon: Globe,
      title: 'Crisis Text Line',
      description: t('Crisis.crisisTextDesc', 'Text HOME to 741741'),
      phone: '741741',
    },
    {
      icon: Heart,
      title: '211 Connecticut',
      description: t('Crisis.connecticut211Desc', 'Community resources and crisis support'),
      phone: '211',
    },
  ];

  const externalResources = [
    {
      title: t('Crisis.samhsa', 'SAMHSA National Helpline'),
      url: 'https://www.samhsa.gov/find-help/national-helpline',
    },
    {
      title: t('Crisis.nami', 'NAMI HelpLine'),
      url: 'https://www.nami.org/help',
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Crisis.resources', 'Crisis Resources')}
        onBack={() => navigate(-1)}
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          {t('Crisis.988Support', '988 Suicide & Crisis Lifeline')}
        </h2>
        <p className="text-gray-400 text-sm">
          {t('Crisis.988SupportDesc', 'Connect with trained crisis counselors 24/7 for free, confidential support.')}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {resources.map((resource, index) => (
          <GlassCard
            key={index}
            hover
            onClick={() => window.location.href = `tel:${resource.phone}`}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl glass-accent flex items-center justify-center flex-shrink-0">
                <resource.icon size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{resource.title}</h3>
                <p className="text-xs text-gray-400">{resource.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{resource.phone}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white mb-3">
          {t('Crisis.additionalResources', 'Additional Resources')}
        </h3>
        <div className="space-y-2">
          {externalResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl glass hover:bg-white/5 transition-colors"
            >
              <span className="text-sm text-gray-300">{resource.title}</span>
              <ExternalLink size={16} className="text-gray-500" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          leftIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/venter/home')}
        >
          {t('Common.backToHome', 'Back to Home')}
        </Button>
      </div>

      <GlassCard className="mt-6 bg-white/[0.02]">
        <p className="text-xs text-gray-400 text-center">
          {t('Crisis.remember', 'Remember: You matter, and support is always available.')}
        </p>
      </GlassCard>
    </div>
  );
};
