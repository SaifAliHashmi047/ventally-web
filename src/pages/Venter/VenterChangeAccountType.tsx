import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import apiInstance from '../../api/apiInstance';
import { setUser, setIsVenter } from '../../store/slices/userSlice';
import { Headphones, User2, AlertCircle, RefreshCw } from 'lucide-react';

export const VenterChangeAccountType = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSwitch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiInstance.post('users/switch-role', { targetRole: 'listener' }) as any;
      if (res?.tokens) {
        // Update auth tokens
        localStorage.setItem('accessToken', res.tokens.accessToken);
        localStorage.setItem('refreshToken', res.tokens.refreshToken);
      }
      dispatch(setIsVenter(false));
      if (res?.user) dispatch(setUser(res.user as any));
      window.location.href = '/listener/home';
    } catch (e: any) {
      // Fallback navigate if API not ready
      dispatch(setIsVenter(false));
      window.location.href = '/listener/home';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('ChangeAccount.title', 'Change Account Type')} onBack={() => navigate(-1)} />

      <div className="flex flex-col items-center justify-center flex-1 mt-6">
        <GlassCard bordered className="w-full text-center mb-4">
          {/* Role icons */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
              <User2 size={28} />
            </div>
            <div className="flex items-center text-gray-600">
              <RefreshCw size={18} />
            </div>
            <div className="w-16 h-16 rounded-2xl glass-accent flex items-center justify-center text-accent">
              <Headphones size={28} />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {t('ChangeAccount.switchAccountTitle', 'Switch Account Type')}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-5 px-2">
            {t('ChangeAccount.switchAccountDescription', 'Switch to a Support Guide account to start helping others. Your venter history and wellness data will remain intact.')}
          </p>

          <div className="bg-white/5 rounded-xl p-3 flex gap-3 text-left mb-2">
            <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">
              {t('ChangeAccount.switchWarning', 'You will be logged out of your active sessions and sent to the Support Guide dashboard.')}
            </p>
          </div>
        </GlassCard>

        {error && (
          <p className="text-sm text-error mb-3">{error}</p>
        )}

        <div className="w-full space-y-3">
          <Button variant="primary" fullWidth loading={loading} onClick={handleSwitch}>
            {t('Common.next', 'Switch to Support Guide')}
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
            {t('Common.cancel', 'Cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};
