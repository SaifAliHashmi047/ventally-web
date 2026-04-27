import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Shield } from 'lucide-react';
import apiInstance from '../../api/apiInstance';

export const VenterPaymentCheckScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ported logic to check subscription vs wallet balance
    const checkPayment = async () => {
      try {
        const [subRes, walletRes] = await Promise.allSettled([
          apiInstance.get('wallet/subscription'),
          apiInstance.get('wallet/balance')
        ]);

        const hasSub = subRes.status === 'fulfilled' && subRes.value?.data?.status === 'active';
        const balance = walletRes.status === 'fulfilled' ? walletRes.value?.data?.balance : 0;

        // Note: For now, bypass payment check and go straight to finding listener
        // Real logic would be:
        // if (hasSub || balance >= required) navigate to finding
        // else navigate to /venter/no-credit
        
        setTimeout(() => {
          navigate('/venter/finding-listener', { state: location.state, replace: true });
        }, 1500);

      } catch (e) {
        navigate('/venter/finding-listener', { state: location.state, replace: true });
      }
    };

    checkPayment();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in flex flex-col items-center justify-center min-h-screen pb-20">
      <div className="w-24 h-24 rounded-full bg-success/20 flex flex-col items-center justify-center mb-6 shadow-[0_0_40px_rgba(50,215,75,0.2)]">
        <Shield size={40} className="text-white animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('Common.loading', 'Loading...')}</h2>
      <p className="text-sm text-white/80 text-center max-w-xs leading-relaxed">
        {t('VenterPayment.checking', 'Checking your account balances.')}
      </p>
    </div>
  );
};
