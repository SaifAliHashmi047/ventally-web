import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Check } from 'lucide-react';

export const AdminSuccessScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, subtitle, redirectPath = '/admin/settings' } = (location.state as any) || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate, redirectPath]);

  return (
    <div className="page-wrapper animate-fade-in flex flex-col justify-center items-center px-6 min-h-screen pb-20">
      <GlassCard bordered className="w-full max-w-sm p-8 flex flex-col items-center bg-white/[0.02] border-white/10">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/20">
          <Check size={40} className="text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 text-center leading-tight">
          {title || t('Common.success', 'Success!')}
        </h1>
        <p className="text-sm text-white/50 text-center leading-relaxed">
          {subtitle || t('Common.successMessage', 'Your action has been completed successfully.')}
        </p>
      </GlassCard>

      <div className="fixed bottom-10 left-0 right-0 px-6 max-w-3xl mx-auto">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          className="rounded-full h-14 font-bold"
          onClick={() => navigate(redirectPath)}
        >
          {t('Common.done', 'Done')}
        </Button>
      </div>
    </div>
  );
};
