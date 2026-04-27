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
    <div className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden supports-[min-height:100svh]:min-h-[100svh]">
      <MainBackground />

      <main
        id="onboarding-main"
        className="relative z-10 flex w-full flex-1 flex-col"
        role="main"
      >
        <div
          className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-6 pt-[max(1rem,env(safe-area-inset-top))] motion-safe:animate-fade-in motion-reduce:animate-none sm:px-6 sm:pb-8 sm:pt-6 md:max-w-3xl md:px-8 md:pb-10 md:pt-10 lg:max-w-3xl lg:px-10 lg:pb-12 lg:pt-12 xl:max-w-[56rem] xl:pt-16 2xl:pb-16 2xl:pt-20"
        >
          {/* Brand */}
          <header className="mb-4 flex w-full flex-col items-center sm:mb-5 md:mb-6">
            <div className="mb-4 sm:mb-5">
              <AppBrandIcon
                className="mx-auto h-16 w-16 rounded-[1.1rem] shadow-2xl ring-1 ring-white/15 sm:h-20 sm:w-20 sm:rounded-[1.2rem] md:h-[5.5rem] md:w-[5.5rem] md:rounded-[1.35rem] lg:h-24 lg:w-24 lg:rounded-[1.4rem]"
                aria-hidden
              />
            </div>
            <h1 className="mb-2 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mb-2.5 sm:text-3xl lg:text-4xl">
              {t('OnBoarding.appName', 'VENTALLY')}
            </h1>
            <p className="max-w-md text-balance text-center text-sm leading-relaxed text-gray-400 sm:max-w-lg sm:text-base md:max-w-xl md:leading-7 md:text-gray-300/90 lg:max-w-2xl lg:text-lg">
              {t(
                'OnBoarding.quote',
                'Sometimes the most honest conversations happen when no one knows your name.',
              )}
            </p>
          </header>

          {/* Feature grid */}
          <section
            className="mb-6 w-full sm:mb-8 md:mb-10"
            aria-label={t('OnBoarding.featuresLabel', 'What we offer')}
          >
            <div className="grid w-full auto-rows-fr grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-3.5 lg:gap-4">
              {features.map((feature, index) => (
                <GlassCard
                  key={index}
                  bordered
                  padding="md"
                  rounded="2xl"
                  className="flex h-full min-h-[5rem] items-start gap-3 sm:min-h-[5.5rem] sm:gap-4"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl glass-accent sm:h-10 sm:w-10 sm:rounded-2xl"
                    aria-hidden
                  >
                    <feature.icon size={20} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-0.5 text-xs font-semibold leading-snug text-white sm:text-sm">
                      {feature.title}
                    </h2>
                    <p className="text-pretty text-[11px] leading-relaxed text-white sm:text-xs">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Primary actions — width capped like auth flows */}
          <section
            className="w-full max-w-sm sm:max-w-md"
            aria-label={t('OnBoarding.actionsLabel', 'Get started or sign in')}
          >
            <div className="flex w-full flex-col items-center">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                contained
                className="mb-8 font-bold"
                onClick={() => navigate('/signup')}
              >
                {t('OnBoarding.getStarted', 'Get Started')}
              </Button>

              <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">
                {t('OnBoarding.orDownload', 'OR DOWNLOAD THE APP')}
              </p>

              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass w-full flex items-center justify-center gap-2.5 no-underline text-white/70 transition-all hover:bg-white/10 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 mb-3"
                style={{ minHeight: '46px', height: '46px' }}
                aria-label={t(
                  'OnBoarding.playStoreAria',
                  'Open Ventally on Google Play in a new tab',
                )}
              >
                <PlayStoreIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                <span className="font-medium text-[13px]">{t('OnBoarding.playStoreCta', 'Get it on Google Play')}</span>
              </a>

              <Button
                variant="ghost"
                size="lg"
                fullWidth
                contained
                className="border border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80 font-medium"
                onClick={() => navigate('/login')}
              >
                {t('LogIn.logIn', 'Log In')}
              </Button>
            </div>
          </section>

          <footer className="mt-6 w-full max-w-md px-0.5 sm:mt-8 sm:px-0 md:mt-10">
            <p className="text-balance text-center text-[11px] leading-relaxed text-gray-600 sm:max-w-none sm:text-xs">
              {t('OnBoarding.byContinuing', 'By continuing, you agree to our')}{' '}
              <button
                type="button"
                onClick={() => navigate('/signup/terms')}
                className="inline rounded-sm font-medium text-accent underline-offset-2 transition-colors hover:text-accent/90 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
              >
                {t('TermsAndConditions.title', 'Terms & Conditions')}
              </button>
            </p>
          </footer>

          <div
            className="h-[max(0.75rem,env(safe-area-inset-bottom))] w-full shrink-0"
            aria-hidden
          />
        </div>
      </main>
    </div>
  );
};
