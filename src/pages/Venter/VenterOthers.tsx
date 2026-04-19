import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

// PNG icons matching the RN app
import happyIcon    from '../../assets/icons/happy.png';
import reflections  from '../../assets/icons/reflections.png';
import recoveryIcon from '../../assets/icons/recovery.png';
import journeyIcon  from '../../assets/icons/journey.png';
import userIcon     from '../../assets/icons/person.png';

const OPTIONS = [
  {
    titleKey: 'VenterOthers.options.mood.title',
    icon: happyIcon,
    path: '/venter/mood',
  },
  {
    titleKey: 'VenterOthers.options.reflections.title',
    icon: reflections,
    path: '/venter/reflections',
  },
  {
    titleKey: 'VenterOthers.options.recovery.title',
    icon: recoveryIcon,
    path: '/venter/recovery',
  },
  {
    titleKey: 'VenterOthers.options.journey.title',
    icon: journeyIcon,
    path: '/venter/recovery/journey',
  },
  {
    titleKey: 'VenterOthers.options.profile.title',
    icon: userIcon,
    path: '/venter/profile',
  },
];

export const VenterOthers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Centered title — matches RN */}
      <h1 className="text-lg font-medium text-white text-center mb-6">
        {t('VenterOthers.title', 'Others')}
      </h1>

      <div className="space-y-4">
        {OPTIONS.map(opt => (
          <GlassCard
            key={opt.path}
            bordered
            hover
            onClick={() => navigate(opt.path)}
            className="cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center gap-4 py-1">
              {/* Icon — white tint matching RN tintColor: theme.white */}
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center flex-shrink-0">
                <img
                  src={opt.icon}
                  alt={t(opt.titleKey)}
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                />
              </div>
              <p className="flex-1 text-sm font-medium text-white">
                {t(opt.titleKey)}
              </p>
              <ChevronRight size={18} className="text-white/60 flex-shrink-0" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
