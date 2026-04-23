import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { MainBackground } from '../../components/ui/MainBackground';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';
import { Sparkles, Shield, Heart, MessageCircle } from 'lucide-react';

export const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: t('OnBoarding.stayAnonymous', 'Stay Anonymous'),
      description: t('OnBoarding.anonymousDesc', 'Your identity is always protected. No names, no profiles, just support.'),
    },
    {
      icon: Heart,
      title: t('OnBoarding.voiceRules', 'Your Voice. Your Rules.'),
      description: t('OnBoarding.voiceDesc', 'Connect on your terms. Voice or text, whenever you need it.'),
    },
    {
      icon: MessageCircle,
      title: t('OnBoarding.guidedSupport', 'Guided Support'),
      description: t('OnBoarding.guidedDesc', 'Trained listeners ready to provide compassionate, moderated support.'),
    },
    {
      icon: Sparkles,
      title: t('OnBoarding.safeSpace', 'A Safe Space'),
      description: t('OnBoarding.safeDesc', 'Built on privacy, respect, and community guidelines.'),
    },
  ];

  return (
    <div className="relative min-h-[100dvh] flex flex-col w-full overflow-x-hidden">
      <MainBackground />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {/* Logo */}
        <div className="mb-8">
          <AppBrandIcon className="w-20 h-20 rounded-[1.4rem] mx-auto shadow-2xl ring-white/15" />
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
          {t('OnBoarding.appName', 'VENTALLY')}
        </h1>

        {/* Quote */}
        <p className="text-center text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
          {t('OnBoarding.quote', 'Sometimes the most honest conversations happen when no one knows your name.')}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
          {features.map((feature, index) => (
            <GlassCard
              key={index}
              padding="lg"
              rounded="2xl"
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center flex-shrink-0">
                <feature.icon size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-md space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/signup')}
          >
            {t('OnBoarding.getStarted', 'Get Started')}
          </Button>

          <Button
            variant="glass"
            size="lg"
            fullWidth
            onClick={() => navigate('/login')}
          >
            {t('LogIn.logIn', 'Log In')}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-600 mt-8 text-center">
          {t('OnBoarding.byContinuing', 'By continuing, you agree to our')}{' '}
          <button
            onClick={() => navigate('/terms')}
            className="text-accent hover:underline"
          >
            {t('TermsAndConditions.title', 'Terms & Conditions')}
          </button>
        </p>
      </div>
    </div>
  );
};
