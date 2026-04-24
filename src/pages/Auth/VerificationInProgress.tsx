import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Clock } from 'lucide-react';
import { logout } from '../../store/slices/userSlice';
import type { AppDispatch } from '../../store/store';

/**
 * Verification In Progress screen.
 * Shown only if the user navigates here directly (e.g. deep link).
 * The RN app does NOT poll from this screen — it navigates straight to
 * listenerHomeTab after submitVerification. We match that behavior.
 * No polling here — polling would cause hundreds of API calls.
 */
export const VerificationInProgress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogOut = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
        <div className="mb-10">
          <Clock size={80} className="text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-xl font-semibold text-white mb-3">
          {t('VerificationInProgress.title')}
        </h1>

        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
          {t('VerificationInProgress.description')}
        </p>

        <button
          onClick={handleLogOut}
          className="mt-12 text-sm text-white/60 hover:text-white transition-colors py-3 px-6"
        >
          {t('VerificationInProgress.logOut')}
        </button>
      </div>
    </AuthLayout>
  );
};
