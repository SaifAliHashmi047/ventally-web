import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';

// Same PNG icons as RN app
import happyIcon   from '../../assets/icons/happy.png';
import neutralIcon from '../../assets/icons/neutral.png';
import sadIcon     from '../../assets/icons/sad.png';
import anxiousIcon from '../../assets/icons/anxious.png';

// Matches RN ListenerSessionFeedback MOOD_EMOJIS exactly
const MOOD_EMOJIS = [
  { key: 'veryHappy', icon: happyIcon   },
  { key: 'happy',     icon: happyIcon   },
  { key: 'neutral',   icon: neutralIcon },
  { key: 'sad',       icon: sadIcon     },
  { key: 'verySad',   icon: anxiousIcon },
] as const;

export const ListenerSessionFeedback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const { chat, type } = location.state || {};
  const [selectedMood, setSelectedMood] = useState<string>('happy');

  const handleNext = () => {
    navigate(`/listener/session/${id}/rating`, {
      replace: true,
      state: { chat, type },
    });
  };

  const handleReport = () => {
    navigate('/listener/report', { state: { chat, type } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end pb-10 px-4 animate-fade-in">
      {/* Icon — happy icon matching RN */}
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
        <img
          src={happyIcon}
          alt="happy"
          className="w-10 h-10 object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Title + subtitle */}
      <h2 className="text-xl font-semibold text-white text-center mb-1">
        {t('ListenerFeedback.title')}
      </h2>
      <p className="text-sm text-white/60 text-center mb-10">
        {t('ListenerFeedback.subtitle')}
      </p>

      <GlassCard bordered className="w-full max-w-sm">
        {/* Mood selector — PNG icons, white tint */}
        <div className="flex justify-center gap-4 mb-8">
          {MOOD_EMOJIS.map(mood => (
            <button
              key={mood.key}
              onClick={() => setSelectedMood(mood.key)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedMood === mood.key
                  ? 'bg-white/20 scale-110'
                  : 'bg-black/40 hover:bg-white/10'
              }`}
            >
              <img
                src={mood.icon}
                alt={mood.key}
                className="w-7 h-7 object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              />
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button variant="glass" size="lg" fullWidth onClick={handleNext}>
            {t('Common.next')}
          </Button>
          <Button variant="glass" size="lg" fullWidth onClick={handleReport}>
            {t('Common.reportConcern')}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
