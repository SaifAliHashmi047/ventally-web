import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { AuthPageFrame } from '../../components/ui/AuthPageFrame';

export const ResetSuccessfulWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const tmr = window.setTimeout(() => navigate('/login', { replace: true }), 5000);
    return () => window.clearTimeout(tmr);
  }, [navigate]);

  return (
    <AuthPageFrame>
      <div className="auth-card animate-slide-up relative text-center">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(50,215,75,0.2)]">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{t('ResetSuccessful.title')}</h2>
        <p className="text-base text-gray-400 leading-relaxed mb-10">
          {t('ResetSuccessful.description')}
        </p>
        
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={() => navigate('/login', { replace: true })}
        >
          {t('ResetSuccessful.continue')}
        </Button>
        <p className="text-xs text-gray-500 mt-4">Redirecting to log in…</p>
      </div>
    </AuthPageFrame>
  );
};
