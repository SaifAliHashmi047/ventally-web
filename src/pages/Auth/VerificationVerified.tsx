import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { logout } from '../../store/slices/userSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { BadgeCheck } from 'lucide-react';

export const VerificationVerified = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role || (user as any)?.userType;

  const handleLetsStart = () => {
    // Just navigate exactly to their base listener portal
    navigate('/listener', { replace: true });
  };

  const handleLogOut = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
        <div style={{ marginBottom: '40px' }}>
          <BadgeCheck size={80} color="white" strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px', textAlign: 'center' }}>
          {t("VerificationVerified.title")}
        </h1>

        <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textAlign: 'center', opacity: 0.9 }}>
          {t("VerificationVerified.description")}
        </p>

        <div style={{ position: 'absolute', bottom: '40px', width: '100%', left: 0, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>


          <button
            onClick={handleLogOut}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '14px', cursor: 'pointer', padding: '12px', textAlign: 'center' }}
          >
            {t('VerificationInProgress.logOut')}
          </button>
        </div>
        <button
          onClick={handleLetsStart}
          className="btn-primary"
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
        >
          {t("VerificationVerified.letsStart")}
        </button>
      </div>
    </AuthLayout>
  );
};
