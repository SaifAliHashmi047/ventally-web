import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../api/hooks/useAuth';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { logout } from '../../store/slices/userSlice';
import type { RootState } from '../../store/store';
import {
  User, ChevronRight, LogOut, Trash2, CreditCard,
  Globe, Clock, FileText, Shield, Wallet
} from 'lucide-react';

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getProfile } = useAuth();
  const user = useSelector((state: RootState) => state.user.user as any);
  const isVenter = useSelector((state: RootState) => (state.user as any).isVenter ?? (user?.userType === 'venter'));
  const role = isVenter ? 'venter' : 'listener';
  const basePath = `/${role}`;

  const [loading, setLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    getProfile().catch(() => { }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    setLogoutModal(false);
    dispatch(logout() as any);
    navigate('/login');
  };

  const displayName = user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const initials = displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const menuItems = [
    // Personal Info — always present
    {
      id: 'personal-info',
      label: t('Profile.personalInfo', 'Profile'),
      icon: User,
      path: `${basePath}/profile/edit`,
    },
    // Language — always present
    {
      id: 'language',
      label: t('VenterSettings.options.language.title', 'Language'),
      icon: Globe,
      path: `${basePath}/language`,
    },
    // Choose Plan — Venter only
    ...(isVenter ? [{
      id: 'plan',
      label: t('Profile.choosePlan', 'Your Plan'),
      icon: CreditCard,
      path: `${basePath}/subscription`,
    }] : []),
    // Payout — Listener only
    ...(!isVenter ? [{
      id: 'payout',
      label: t('Profile.payout', 'Payout'),
      icon: Wallet,
      path: `${basePath}/payout`,
    }] : []),
    // Sessions — always
    {
      id: 'sessions',
      label: t('Profile.yourSessions', 'Your Sessions'),
      icon: Clock,
      path: `${basePath}/sessions`,
    },
    // Terms of Use
    {
      id: 'terms',
      label: t('Profile.terms', 'Terms Of Use'),
      icon: FileText,
      path: '/legal/terms',
      external: true,
    },
    // Privacy Policy
    {
      id: 'privacy',
      label: t('Profile.privacy', 'Privacy Policy'),
      icon: Shield,
      path: '/legal/privacy',
      external: true,
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Profile.title', 'Profile')} onBack={() => navigate(-1)} />

      {/* Menu Items */}
      <GlassCard padding="none" rounded="2xl" className="mb-4">
        {menuItems.map(({ id, label, icon: Icon, path, external }, i, arr) => {
          const isLast = i === arr.length - 1;
          const el = (
            <div
              key={id}
              className={`settings-item flex justify-between items-center px-4 py-3 cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}
              onClick={() => external ? window.open(path, '_blank') : navigate(path)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
                  <Icon size={15} />
                </div>
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
              <ChevronRight size={16} className="text-white" />
            </div>
          );
          return el;
        })}
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard padding="none" rounded="2xl" className="mb-6">
        <div
          className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer border-b border-white/5"
          onClick={() => setLogoutModal(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
              <LogOut size={15} className="text-white" />
            </div>
            <span className="text-sm font-medium text-white">{t('Profile.logout', 'Logout')}</span>
          </div>
          <ChevronRight size={16} className="text-white" />
        </div>
        <div
          className="settings-item flex justify-between items-center px-4 py-3 cursor-pointer"
          style={{ borderBottomWidth: 0 }}
          onClick={() => navigate(`${basePath}/delete-account`)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
              <Trash2 size={15} className="text-white" />
            </div>
            <span className="text-sm font-medium text-error">{t('Profile.deleteAccount', 'Delete account')}</span>
          </div>
          <ChevronRight size={16} className="text-white" />
        </div>
      </GlassCard>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        title={t('Profile.logoutConfirmTitle', 'Logout')}
        size="sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <LogOut size={24} className="text-white" />
          </div>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {t('Profile.logoutConfirmMessage', 'Are you sure you want to logout?')}
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="glass" fullWidth onClick={() => setLogoutModal(false)}>
              {t('Common.cancel', 'Cancel')}
            </Button>
            <Button variant="danger" fullWidth onClick={handleLogout}>
              {t('Profile.logoutConfirmTitle', 'Logout')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
