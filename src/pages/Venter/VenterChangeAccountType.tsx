import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useRoles } from '../../api/hooks/useRoles';
import { setTokens } from '../../api/apiInstance';
import { setUser, setIsVenter } from '../../store/slices/userSlice';
import { toastSuccess, toastError } from '../../utils/toast';
import { Loader2 } from 'lucide-react';

export const VenterChangeAccountType = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stable refs — no infinite loop
  const rolesHook = useRoles();
  const getUserRolesRef = useRef(rolesHook.getUserRoles);
  const switchRoleRef   = useRef(rolesHook.switchRole);

  const [loading, setLoading]     = useState(true);
  const [switching, setSwitching] = useState(false);
  const [rolesConfig, setRolesConfig] = useState<{
    availableRoles: string[];
    activeRole: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Fetch once on mount
  useEffect(() => {
    let cancelled = false;
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await getUserRolesRef.current();
        if (cancelled) return;
        if (res) {
          setRolesConfig({ availableRoles: res.availableRoles, activeRole: res.activeRole });
          // Default target = the role that is NOT currently active
          setSelectedRole(res.activeRole === 'venter' ? 'listener' : 'venter');
        }
      } catch {
        toastError(t('ChangeAccount.failedToFetch'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRoles();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwitchRole = async () => {
    if (!selectedRole) return;
    if (selectedRole.toLowerCase() === rolesConfig?.activeRole.toLowerCase()) return;

    setSwitching(true);
    try {
      const res = await switchRoleRef.current({ targetRole: selectedRole });
      if (res) {
        // Update tokens — same as RN
        if (res.tokens) {
          await setTokens(res.tokens.accessToken, res.tokens.refreshToken);
        }
        // Toast success — matches RN
        toastSuccess(res.message || t('ChangeAccount.roleSwitchedSuccess'));

        // Update Redux — same as RN
        const updatedUser = { ...res.user, role: res.user?.activeRole?.toLowerCase() };
        dispatch(setUser(updatedUser as Parameters<typeof setUser>[0]));
        dispatch(setIsVenter(selectedRole.toLowerCase() === 'venter'));

        // Navigate to appropriate home — use replace to reset history stack (matches RN navigation.reset)
        const target = selectedRole.toLowerCase() === 'listener' ? '/listener/home' : '/venter/home';
        window.location.replace(target);
      }
    } catch (error: any) {
      toastError(error?.message || error?.error || t('ChangeAccount.failedToSwitch'));
    } finally {
      setSwitching(false);
    }
  };

  const handleNext = () => {
    if (!selectedRole) return;

    const isOwned = rolesConfig?.availableRoles.some(
      r => r.toLowerCase() === selectedRole.toLowerCase()
    );

    if (isOwned) {
      handleSwitchRole();
    } else {
      // Not owned → onboarding inside home layout (no AuthLayout double-wrap)
      // Venter → Listener: start at listener-training under /venter/change-account/*
      // Venter → Venter path not needed; venter already is venter
      navigate('/venter/change-account/listener-training');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper animate-fade-in flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('ChangeAccount.title')} onBack={() => navigate(-1)} />

      <div className="flex flex-col items-center justify-center flex-1 mt-8">
        {rolesConfig && (
          <GlassCard bordered className="w-full overflow-hidden p-0">
            {/* Card content — matches RN cardContent */}
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('ChangeAccount.switchAccountTitle')}
              </h3>
              <p className="text-sm text-white leading-relaxed">
                {t('ChangeAccount.switchAccountDescription')}
              </p>
            </div>

            {/* Divider — matches RN divider */}
            {/* <div className="w-full h-px bg-white/20" /> */}

            {/* Next button — matches RN nextButton at bottom of card */}
            <button
              onClick={handleNext}
              disabled={switching}
              className="w-full py-4 text-sm font-medium text-white text-center hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {switching && <Loader2 size={16} className="animate-spin" />}
              {t('Common.next')}
            </button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
