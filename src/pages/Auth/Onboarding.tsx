import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { MainBackground } from '../../components/ui/MainBackground';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';
import { Mouse } from 'lucide-react';

const InterconnectedDots = () => (
  <div className="relative w-10 h-10 mb-6">
    {/* Top center */}
    <div className="absolute w-3 h-3 rounded-full bg-white/90" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
    {/* Middle left */}
    <div className="absolute w-3 h-3 rounded-full bg-white/90" style={{ top: '50%', left: 0, transform: 'translateY(-50%)' }} />
    {/* Middle right */}
    <div className="absolute w-3 h-3 rounded-full bg-white/90" style={{ top: '50%', right: 0, transform: 'translateY(-50%)' }} />
    {/* Bottom center */}
    <div className="absolute w-3 h-3 rounded-full bg-white/90" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
  </div>
);

export const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center justify-center flex-1 w-full px-5">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/20 mb-4">
            <AppBrandIcon className="w-24 h-24 rounded-2xl shadow-2xl" />
          </div>
          <p className="text-4xl font-bold text-white/60 text-center tracking-tight">
            {t('OnBoarding.appName', 'VENTALLY')}
          </p>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="flex flex-col justify-center flex-1 w-full px-5">
          <InterconnectedDots />
          <p className="text-2xl font-medium text-white leading-relaxed">
            {t('OnBoarding.quote', '"Sometimes the most honest conversations happen when no one knows your name."')}
          </p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="flex flex-col justify-center flex-1 w-full px-5">
          <p className="text-2xl font-medium text-white mb-6">
            {t('OnBoarding.fetchingData', 'Fetching Data...')}
          </p>
          <div className="flex items-center gap-3">
            <Mouse size={32} className="text-white flex-shrink-0" />
            <p className="text-sm font-medium text-white leading-relaxed">
              {t('OnBoarding.voiceRules', 'Your voice. Your rules.')}{'\n'}
              {t('OnBoarding.stayAnonymous', 'Stay anonymous while you get support')}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col w-full overflow-hidden">
      <MainBackground />
      <div className="relative z-10 flex-1 flex flex-col w-full">
        {/* Slides */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-shrink-0 w-full snap-center flex flex-col"
              style={{ scrollSnapAlign: 'center' }}
            >
              {slide.content}
            </div>
          ))}
        </div>

        {/* Bottom: button + pagination */}
        <div className="px-5 pb-10 pt-4 flex flex-col items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleGetStarted}
          >
            {currentIndex === slides.length - 1
              ? t('OnBoarding.enterSafeSpace', 'Enter Safe Space')
              : t('OnBoarding.getStarted', 'Get Started')}
          </Button>

          {/* Pagination dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === currentIndex ? 10 : 8,
                  height: i === currentIndex ? 10 : 8,
                  backgroundColor: i === currentIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>

          {/* Log In link */}
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('LogIn.logIn', 'Log In')}
          </button>
        </div>
      </div>
    </div>
  );
};
