import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Wallet } from 'lucide-react';

export const VenterNoCreditScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in flex flex-col items-center justify-center min-h-screen pb-20 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-24 h-24 rounded-full bg-white/20 flex flex-col items-center justify-center mx-auto mb-6  ">
          <AlertCircle size={40} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{t('VenterPayment.insufficientFunds', 'Insufficient Funds')}</h2>

        <p className="text-base text-gray-400 leading-relaxed mb-8">
          {t('VenterPayment.unsuccessfulDesc', 'You do not have enough credits or an active subscription to start this session.')}
        </p>

        <GlassCard className="mb-6">
          <p className="text-sm font-medium text-white mb-2">{t('VenterPayment.chooseOption', 'Choose an option to continue:')}</p>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/venter/subscription')}
            >
              {t('VenterSubscription.title', 'My Subscription')}
            </Button>
            <Button
              variant="glass"
              fullWidth
              onClick={() => navigate('/venter/wallet/add-funds')}
            >
              {t('VenterWallet.addFunds', 'Add Funds')}
            </Button>
          </div>
        </GlassCard>

        <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
          {t('Common.cancel', 'Cancel')}
        </Button>
      </div>
    </div>
  );
};
