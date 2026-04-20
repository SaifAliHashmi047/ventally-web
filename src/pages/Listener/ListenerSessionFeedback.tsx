import { useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  ListenerSessionShell,
  SessionTypeBadge,
} from '../../components/Listener/ListenerSessionShell';

import happyIcon from '../../assets/icons/happy.png';
import neutralIcon from '../../assets/icons/neutral.png';
import sadIcon from '../../assets/icons/sad.png';
import anxiousIcon from '../../assets/icons/anxious.png';

const MOOD_EMOJIS = [
  { key: 'veryHappy', icon: happyIcon },
  { key: 'happy', icon: happyIcon },
  { key: 'neutral', icon: neutralIcon },
  { key: 'sad', icon: sadIcon },
  { key: 'verySad', icon: anxiousIcon },
] as const;

export const ListenerSessionFeedback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const { chat, type } = (location.state || {}) as { chat?: unknown; type?: string };
  const sessionKind = useMemo(
    () => (type === 'call' ? 'call' : 'chat') as 'call' | 'chat',
    [type],
  );

  const [selectedMood, setSelectedMood] = useState<string>('happy');

  const handleNext = () => {
    if (!id) return;
    navigate(`/listener/session/${id}/rating`, {
      replace: true,
      state: { chat, type: sessionKind },
    });
  };

  const handleReport = () => {
    navigate('/listener/report', {
      state: {
        chat,
        type: sessionKind,
        sessionId: id,
        conversationId: sessionKind === 'chat' ? id : undefined,
      },
    });
  };

  const handleBack = () => {
    navigate('/listener/home', { replace: true });
  };

  return (
    <ListenerSessionShell
      title={t('ListenerFeedback.title')}
      subtitle={t('ListenerFeedback.subtitle')}
      onBack={handleBack}
      badge={<SessionTypeBadge kind={sessionKind} />}
    >
      <div className="flex flex-col items-center w-full gap-6 sm:gap-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass flex items-center justify-center border border-white/10 shadow-inner shrink-0">
          <img
            src={happyIcon}
            alt=""
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        <GlassCard
          bordered
          padding="none"
          className="w-full rounded-3xl overflow-hidden border-white/10 bg-black/25 backdrop-blur-xl"
        >
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-2">
            <p className="text-center text-xs sm:text-sm text-white/50 mb-6 sm:mb-8">
              {t('ListenerFeedback.moodPrompt', 'How are you feeling after this session?')}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 md:gap-4 max-w-md mx-auto">
              {MOOD_EMOJIS.map((mood) => (
                <button
                  key={mood.key}
                  type="button"
                  onClick={() => setSelectedMood(mood.key)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ring-1 ${
                    selectedMood === mood.key
                      ? 'bg-white/20 scale-105 ring-white/30 shadow-lg'
                      : 'bg-black/30 hover:bg-white/10 ring-white/5'
                  }`}
                >
                  <img
                    src={mood.icon}
                    alt={mood.key}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 sm:p-6 pt-2 sm:pt-4 border-t border-white/10 bg-black/20">
            <Button variant="primary" size="lg" fullWidth className="min-h-[48px] sm:min-h-[52px]" onClick={handleNext}>
              {t('Common.next')}
            </Button>
            <Button variant="glass" size="lg" fullWidth className="min-h-[48px] sm:min-h-[52px]" onClick={handleReport}>
              {t('Common.reportConcern')}
            </Button>
          </div>
        </GlassCard>
      </div>
    </ListenerSessionShell>
  );
};
