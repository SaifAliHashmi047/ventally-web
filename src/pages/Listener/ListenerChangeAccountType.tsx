import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useRoles } from '../../api/hooks/useRoles';
import { setTokens } from '../../api/apiInstance';
import { setUser, setIsVenter } from '../../store/slices/userSlice';
import { Headphones, User, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

export const ListenerChangeAccountType = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getUserRoles, switchRole } = useRoles();

  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState('');
  const [rolesConfig, setRolesConfig] = useState<{
    availableRoles: string[];
    activeRole: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await getUserRoles();
        if (res) {
          setRolesConfig({
            availableRoles: res.availableRoles,
            activeRole: res.activeRole,
          });
          // Initialize selected role to the one that is NOT active
          if (res.activeRole === 'listener') {
            setSelectedRole('venter');
          } else {
            setSelectedRole('listener');
          }
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError(t('ChangeAccount.failedToFetch', 'Failed to fetch account roles'));
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwitchRole = async () => {
    if (!selectedRole) return;

    // If selection is the active role, do nothing
    if (selectedRole.toLowerCase() === rolesConfig?.activeRole.toLowerCase()) {
      return;
    }

    setSwitching(true);
    setError('');
    try {
      const res = await switchRole({ targetRole: selectedRole });
      if (res) {
        // Update tokens
        if (res.tokens) {
          await setTokens(res.tokens.accessToken, res.tokens.refreshToken);
        }

        // Map response user to User slice structure
        const updatedUser = {
          ...res.user,
          role: res.user?.activeRole?.toLowerCase() || selectedRole.toLowerCase(),
        };

        dispatch(setUser(updatedUser as Parameters<typeof setUser>[0]));
        dispatch(setIsVenter(selectedRole.toLowerCase() === 'venter'));

        // Navigate to appropriate home
        if (selectedRole.toLowerCase() === 'listener') {
          window.location.href = '/listener/home';
        } else {
          window.location.href = '/venter/home';
        }
      }
    } catch (error: unknown) {
      console.error('Error switching role:', error);
      const err = error as { message?: string; error?: string };
      setError(err?.message || err?.error || t('ChangeAccount.failedToSwitch', 'Failed to switch role'));
    } finally {
      setSwitching(false);
    }
  };

  const handleNext = () => {
    if (!selectedRole) return;

    // Check if user already owns the role
    const isOwned = rolesConfig?.availableRoles.some(r => r.toLowerCase() === selectedRole.toLowerCase());

    if (isOwned) {
      handleSwitchRole();
    } else {
      // User doesn't have this role, needs onboarding
      if (selectedRole.toLowerCase() === 'listener') {
        // Navigate to listener training
        navigate('/signup/listener-training', { state: { accountTypeChanging: true } });
      } else {
        // Navigate to nickname screen to start Venter signup
        navigate('/signup/nickname', { state: { accountTypeChanging: true } });
      }
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in flex flex-col pt-10 px-4 min-h-[90vh]">
      <PageHeader title={t('ChangeAccount.title', 'Change Account Type')} onBack={() => navigate(-1)} />

      <div className="flex-1 mt-8">
        <GlassCard bordered className="text-center py-6 mb-6">
          {/* Role icons */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl glass-accent flex items-center justify-center text-accent">
              <Headphones size={28} />
            </div>
            <div className="flex items-center text-gray-600">
              <RefreshCw size={18} />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
              <User size={28} />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {t('ChangeAccount.switchAccountTitle', 'Switch Account Type')}
          </h3>
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

        {error && (
          <div className="w-full bg-error/10 border border-error/30 text-error px-4 py-3 rounded-2xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Button variant="primary" fullWidth loading={switching} onClick={handleNext}>
            {t('Common.next', 'Next')}
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
            {t('Common.cancel', 'Cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};
