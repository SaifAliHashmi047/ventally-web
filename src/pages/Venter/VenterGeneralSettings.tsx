import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { ChevronRight, Image as ImageIcon, MessageSquare } from 'lucide-react';

export const VenterGeneralSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items = [
    {
      icon: ImageIcon,
      label: t('GeneralSettings.changeBackground', 'Change Background'),
      path: '/venter/general-settings/change-background',
    },
    {
      icon: MessageSquare,
      label: t('GeneralSettings.submitFeedback', 'Submit Feedback'),
      path: '/venter/general-settings/submit-feedback',
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('GeneralSettings.title', 'General Settings')} onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl">
        {items.map(({ icon: Icon, label, path }, i, arr) => (
          <div
            key={label}
            className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => navigate(path)}
            style={{ borderBottomWidth: i === arr.length - 1 ? 0 : undefined }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <ChevronRight size={16} className="text-white" />
          </div>
        ))}
      </GlassCard>
    </div>
  );
};
