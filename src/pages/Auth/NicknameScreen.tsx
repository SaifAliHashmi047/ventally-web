import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { updateUser } from '../../store/slices/userSlice';
import { updateProfile } from '../../api';
import { ArrowLeft } from 'lucide-react';
import { AuthPageFrame } from '../../components/ui/AuthPageFrame';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';

export const NicknameScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Role comes from location state (passed from OTP) or Redux store
  const stateUserType = (location.state as any)?.userType || '';
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const userType = stateUserType || reduxUser?.userType || reduxUser?.role || 'venter';
  const { isAccountChanging, resolve } = useAccountChangeFlow();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length < 3) {
      setError(t('Nickname.minimumLengthError', 'Nickname must be at least 3 characters long'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await updateProfile({ displayName: nickname.trim() });
      if ((response as any).success !== false) {
        dispatch(updateUser({ displayName: nickname.trim(), name: nickname.trim() }));

        const legacyAccountTypeChanging = (location.state as any)?.accountTypeChanging;
        const effectiveChanging = isAccountChanging || legacyAccountTypeChanging;

        // ── Role-based branching — matches native NicknameScreen handleSave ──
        if (effectiveChanging) {
          // When changing account type to Venter, skip optional questions and head straight to subscription
          navigate(resolve('choose-plan'));
        } else if (userType === 'listener') {
          navigate('/signup/listener-training', { state: { userType } });
        } else {
          // Venter norm: optional questions hero
          navigate('/signup/questions', { state: { userType } });
        }
      } else {
        setError((response as any)?.error || t('Common.error') || 'Failed to save');
      }
    } catch (err: any) {
      setError(err?.error || t('Common.error') || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const inner = (
    <>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

        <div className="text-center mb-12">
          <h1 className="text-xl font-bold text-white">
            {t('Nickname.title')}
          </h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-12">
          <div className="flex-center">
            <input
              type="text"
              placeholder={t('Nickname.placeholder')}
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setError(''); }}
              autoFocus
              className="w-full bg-transparent border-none border-b-2 border-white/10 rounded-none text-[28px] text-center py-3 text-white outline-none focus:border-primary transition-colors"
            />
          </div>

          {error ? (
            <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2 text-center">{error}</p>
          ) : null}

          <button
            type="submit"
            className="btn-primary w-full h-14 justify-center text-[17px] rounded-2xl"
            disabled={loading || nickname.trim().length < 3}
          >
            {loading ? '…' : t('Nickname.save')}
          </button>
        </form>
    </>
  );

  if (isAccountChanging) {
    return (
      <div className="page-wrapper animate-fade-in">
        <div className="max-w-md mx-auto w-full">{inner}</div>
      </div>
    );
  }

  return (
    <AuthPageFrame>
      <div className="auth-card animate-slide-up w-full max-w-md">{inner}</div>
    </AuthPageFrame>
  );
};
