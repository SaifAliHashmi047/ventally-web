import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Headphones, User, AlertCircle } from 'lucide-react';
import { updateUser } from '../../store/slices/userSlice';
import apiInstance from '../../api/apiInstance';

export const ListenerChangeAccountType = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    setLoading(true);
    try {
      // Mock switch to venter endpoint
      await apiInstance.post('users/switch-role', { role: 'venter' });
      dispatch(updateUser({ userType: 'venter' }));
      // Role switch usually forces a reload or redirect
      window.location.href = '/venter/home';
    } catch {
      // API mock fallback
      dispatch(updateUser({ userType: 'venter' }));
      window.location.href = '/venter/home';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in flex flex-col pt-10 px-4 min-h-[90vh]">
      <PageHeader title={t('ListenerAccount.switchRole', 'Switch Role')} onBack={() => navigate(-1)} />
      
      <div className="flex-1 mt-8">
        <GlassCard className="text-center py-6 mb-6">
           <div className="flex justify-center gap-6 mb-6">
             <div className="w-16 h-16 rounded-2xl glass-accent flex items-center justify-center text-accent">
               <Headphones size={28} />
             </div>
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
               <User size={28} />
             </div>
           </div>
           
           <h3 className="text-xl font-bold text-white mb-2">{t('ListenerAccount.switchConfirm', 'Switch to Venter Account?')}</h3>
           <p className="text-sm text-gray-400 mb-4 px-2">
             {t('ListenerAccount.switchDesc', 'You are currently a Listener. Switching to a Venter account allows you to seek support. Your listener profile and earnings will remain intact.')}
           </p>

           <div className="bg-white/5 rounded-xl p-3 flex gap-3 text-left">
             <AlertCircle size={20} className="text-warning flex-shrink-0" />
             <p className="text-xs text-gray-400">
               {t('ListenerAccount.switchWarning', 'You will be logged out of your active listener sessions and unavailable until you switch back.')}
             </p>
           </div>
        </GlassCard>

        <div className="space-y-3">
          <Button variant="primary" fullWidth loading={loading} onClick={handleSwitch}>
            {t('ListenerAccount.confirmSwitch', 'Yes, Switch to Venter')}
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
            {t('Common.cancel', 'Cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};
