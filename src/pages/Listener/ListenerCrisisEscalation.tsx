import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export const ListenerCrisisEscalation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in flex flex-col justify-center pb-20 px-4 min-h-[90vh]">
      <PageHeader onBack={() => navigate(-1)} />
      
      <div className="w-full text-center">
        <div className="w-24 h-24 rounded-full bg-error/20 flex flex-col items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,59,48,0.2)]">
          <ShieldAlert size={40} className="text-error" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">{t('ListenerCrisis.title', 'Escalate Crisis')}</h2>
        
        <p className="text-base text-gray-400 leading-relaxed mb-8">
          {t('ListenerCrisis.desc', 'If you believe the venter is in immediate danger, please guide them to contact emergency services or a crisis hotline.')}
        </p>

        <GlassCard className="mb-6 border-error/30 bg-error/5 py-6">
           <h3 className="text-lg font-bold text-white mb-2">{t('ListenerCrisis.emergencyNumber', 'Emergency: 911')}</h3>
           <p className="text-sm text-gray-400 mb-4">{t('ListenerCrisis.nationalHotline', 'National Crisis Hotline: 988')}</p>
           
           <Button variant="danger" fullWidth leftIcon={<PhoneCall size={18} />}>
              {t('ListenerCrisis.endCallNow', 'End Call & Escalate')}
           </Button>
        </GlassCard>

        <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
          {t('Common.cancel', 'Cancel')}
        </Button>
      </div>
    </div>
  );
};
