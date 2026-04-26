import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { MainBackground } from '../../components/ui/MainBackground';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';
import { PlayStoreIcon } from '../../components/ui/PlayStoreIcon';
import { Sparkles, Shield, Heart, MessageCircle } from 'lucide-react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ventally';

export const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: t('OnBoarding.stayAnonymous', 'Stay Anonymous'),
      description: t(
        'OnBoarding.anonymousDesc',
        'Your identity is always protected. No names, no profiles, just support.',
      ),
    },
    {
      icon: Heart,
      title: t('OnBoarding.voiceTitle', 'Your Voice. Your Rules.'),
      description: t(
        'OnBoarding.voiceDesc',
        'Connect on your terms. Voice or text, whenever you need it.',
      ),
    },
    {
      icon: MessageCircle,
      title: t('OnBoarding.guidedSupport', 'Guided Support'),
      description: t(
        'OnBoarding.guidedDesc',
        'Trained listeners ready to provide compassionate, moderated support.',
      ),
    },
    {
      icon: Sparkles,
      title: t('OnBoarding.safeSpace', 'A Safe Space'),
      description: t(
        'OnBoarding.safeDesc',
        'Built on privacy, respect, and community guidelines.',
      ),
    },
  ];

  return (
    <div className="relative min-h-[100dvh] flex w-full max-w-full flex-col overflow-x-hidden">
      <MainBackground />
      <div className="relative z-10 flex min-h-0 w-full max-w-full flex-1 flex-col items-center justify-start overflow-y-auto overscroll-y-contain">
        <div className="flex w-full max-w-2xl flex-col items-center px-3.5 py-6 sm:px-5 sm:py-10 lg:px-6 lg:py-12">
          <div className="mb-5 sm:mb-6">
            <AppBrandIcon className="mx-auto h-16 w-16 rounded-[1.1rem] shadow-2xl ring-1 ring-white/15 sm:h-[5.5rem] sm:w-[5.5rem] sm:rounded-[1.25rem] md:h-24 md:w-24 md:rounded-[1.4rem]" />
          </div>

          <h1 className="mb-1.5 text-center text-2xl font-bold tracking-tight text-white sm:mb-2 sm:text-3xl">
            {t('OnBoarding.appName', 'VENTALLY')}
          </h1>

          <p className="mb-6 max-w-md px-0.5 text-center text-sm leading-relaxed text-gray-400 sm:mb-8 sm:px-0 sm:text-base md:text-lg">
            {t(
              'OnBoarding.quote',
              'Sometimes the most honest conversations happen when no one knows your name.',
            )}
          </p>

          <div className="mb-6 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:mb-8 sm:grid-cols-2 sm:gap-3.5">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                bordered
                padding="md"
                rounded="2xl"
                className="flex items-start gap-3 sm:gap-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl glass-accent sm:h-10 sm:w-10 sm:rounded-2xl">
                  <feature.icon size={20} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-0.5 text-xs font-semibold text-white sm:text-sm">{feature.title}</h3>
                  <p className="text-[11px] leading-relaxed text-white/80 sm:text-xs">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="w-full max-w-sm space-y-2.5 sm:max-w-md sm:space-y-3">
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/signup')}>
              {t('OnBoarding.getStarted', 'Get Started')}
            </Button>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass btn-lg w-full no-underline text-white focus-visible:ring-2 focus-visible:ring-white/25"
              aria-label={t(
                'OnBoarding.playStoreAria',
                'Open Ventally on Google Play in a new tab',
              )}
            >
              <PlayStoreIcon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              {t('OnBoarding.playStoreCta', 'Get it on Google Play')}
            </a>

            <Button variant="glass" size="lg" fullWidth onClick={() => navigate('/login')}>
              {t('LogIn.logIn', 'Log In')}
            </Button>
          </div>

          <p className="mt-6 max-w-sm px-1 text-center text-[11px] leading-relaxed text-gray-600 sm:mt-8 sm:max-w-md sm:px-0 sm:text-xs">
            {t('OnBoarding.byContinuing', 'By continuing, you agree to our')}{' '}
            <button
              type="button"
              onClick={() => navigate('/signup/terms')}
              className="font-medium text-accent hover:underline"
            >
              {t('TermsAndConditions.title', 'Terms & Conditions')}
            </button>
          </p>

          <div
            className="h-[max(0.75rem,env(safe-area-inset-bottom))] w-full shrink-0"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};
