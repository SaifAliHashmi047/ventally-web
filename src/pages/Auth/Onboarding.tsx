import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { MainBackground } from '../../components/ui/MainBackground';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';
import { PlayStoreIcon } from '../../components/ui/PlayStoreIcon';
import mouseIcon from '../../assets/icons/mouse.png';
import { cn } from '../../utils/cn';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ventally';

export const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    // Slide 1 — app icon + name
    <div key={1} className="flex flex-col items-center justify-center w-full h-full px-8">
      <div
        className="mb-4 p-4 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <AppBrandIcon className="w-24 h-24 rounded-2xl" />
      </div>
      <span
        className="text-4xl font-bold text-center"
        style={{ color: 'rgba(255,255,255,0.6)' }}
      >
        {t('OnBoarding.appName')}
      </span>
    </div>,

    // Slide 2 — dots pattern + quote
    <div key={2} className="flex flex-col justify-center w-full h-full px-8">
      {/* Interconnected dots pattern */}
      <div className="relative mb-6" style={{ width: 32, height: 32 }}>
        {[
          { top: 0,    left: '50%', transform: 'translateX(-50%)' },
          { top: '50%', left: 0,   transform: 'translateY(-50%)' },
          { top: '50%', right: 0,  transform: 'translateY(-50%)' },
          { bottom: 0,  left: '50%', transform: 'translateX(-50%)' },
        ].map((style, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{ ...style, background: 'rgba(255,255,255,0.9)' }}
          />
        ))}
      </div>
      <p className="text-3xl font-medium text-white leading-snug">
        {t('OnBoarding.quote')}
      </p>
    </div>,

    // Slide 3 — fetching + mouse icon + rules
    <div key={3} className="flex flex-col justify-center w-full h-full px-8">
      <p className="text-3xl font-medium text-white mb-6">
        {t('OnBoarding.fetchingData')}
      </p>
      <div className="flex flex-row items-center gap-3">
        <img src={mouseIcon} alt="" className="w-10 h-10 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="text-base font-medium text-white leading-relaxed flex-1">
          {t('OnBoarding.voiceRules')}{'\n'}{t('OnBoarding.stayAnonymous')}
        </p>
      </div>
    </div>,
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    navigate('/signup');
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col w-full">
      <MainBackground />
      <div className="relative z-10 flex flex-col w-full min-h-[100dvh] overflow-y-auto">

        {/* Swipeable slides — fixed height so buttons are always reachable by scrolling */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide flex-shrink-0"
          style={{ scrollBehavior: 'smooth', height: '48vh', minHeight: 280 }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-center w-full flex items-center"
              style={{ minWidth: '100%' }}
            >
              {slide}
            </div>
          ))}
        </div>

        {/* Bottom section — flows naturally, page scrolls to reveal on small screens */}
        <div className="px-5 pb-8 pt-4 flex flex-col items-center">

          {/* 1 — Get Started (most prominent) */}
          <Button
            variant="primary"
            onClick={handleNext}
            className="font-semibold w-full lg:w-[70%] xl:w-1/2"
            style={{ boxShadow: '0 0 18px rgba(194,174,191,0.35)' }}
          >
            {currentIndex === slides.length - 1
              ? t('OnBoarding.enterSafeSpace', 'Enter Safe Space')
              : t('OnBoarding.getStarted', 'Get Started')}
          </Button>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-4">
            {slides.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width:  i === currentIndex ? 9 : 7,
                  height: i === currentIndex ? 9 : 7,
                  background: i === currentIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>

          {/* 2 — OR DOWNLOAD THE APP label */}
          <p className="text-center mb-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            OR DOWNLOAD THE APP
          </p>

          {/* 3 — Play Store (secondary) */}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'btn btn-md w-full lg:w-[70%] xl:w-1/2',
              'flex items-center justify-center gap-2.5 rounded-2xl text-white no-underline transition-all hover:opacity-80'
            )}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              opacity: 0.85,
            }}
          >
            <PlayStoreIcon className="h-4 w-4 shrink-0" />
            <div className="text-left leading-none">
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('OnBoarding.getItOn', 'GET IT ON')}
              </p>
              <p className="text-sm font-semibold text-white">{t('OnBoarding.googlePlayBrand', 'Google Play')}</p>
            </div>
          </a>

          {/* 4 — Log In (lowest priority, ghost) */}
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="mt-2 border border-white/10 text-white/45 w-full lg:w-[70%] xl:w-1/2"
          >
            {t('LogIn.logIn', 'Log In')}
          </Button>

          {/* Terms */}
          <p className="text-center mt-4" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
            {t('OnBoarding.byContinuing', 'By continuing, you agree to our')}{' '}
            <button
              type="button"
              onClick={() => navigate('/signup/terms')}
              className="text-accent hover:underline"
            >
              {t('TermsAndConditions.title', 'Terms & Conditions')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
