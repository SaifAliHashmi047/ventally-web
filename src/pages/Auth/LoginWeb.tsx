import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { setTokens } from '../../api';
import apiInstance from '../../api/apiInstance';
import { setUser, setAuthenticated, setIsVenter } from '../../store/slices/userSlice';
import { Mail, Lock } from 'lucide-react';
import { AuthPageFrame } from '../../components/ui/AuthPageFrame';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';

export const LoginWeb = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) errs.email = t('LogIn.error.validEmail', 'Enter a valid email');
    if (!form.password) errs.password = t('LogIn.error.passwordRequired', 'Password is required');
    else if (form.password.length < 8) errs.password = t('Common.passwordValidationError', 'Password must be at least 8 characters');
    return errs;
  };

  /**
   * Navigate after login — mirrors native useVenterNavigation / useListenerNavigation.
   *
   * Venter:
   *   !isVerified → OTP
   *   !displayName → nickname
   *   else → /venter (AppRouter picks it up)
   *
   * Listener:
   *   !isVerified → OTP
   *   !listenerSignature → listener-training
   *   !verificationDocumentStatus / 'not_submitted' → /signup/verification
   *   else → /listener
   */
  const navigateAfterLogin = (user: any) => {
    const role = user?.userType || user?.role || 'venter';

    if (!user?.isVerified) {
      navigate('/signup/otp', { state: { email: user?.email, userType: role } });
      return;
    }

    if (role === 'listener') {
      if (!user?.listenerSignature) {
        navigate('/signup/listener-training', { state: { userType: role } });
      } else if (
        !user?.verificationDocumentStatus ||
        user?.verificationDocumentStatus === 'not_submitted'
      ) {
        navigate('/signup/verification', { state: { userType: role } });
      } else {
        // Fully onboarded listener — AppRouter will send to /listener
        navigate('/listener');
      }
    } else if (role === 'admin' || role === 'sub_admin') {
      navigate('/admin');
    } else {
      // Venter
      if (!user?.displayName) {
        navigate('/signup/nickname', { state: { userType: role } });
      } else {
        // Fully onboarded venter — AppRouter redirects to /venter
        navigate('/venter');
      }
    }
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await apiInstance.post('auth/login', {
        email: form.email.trim(),
        password: form.password,
      });
      const data = res.data || res;
      const { tokens, user } = data || {};

      // Handle both token shapes
      if (data?.access_token && data?.refresh_token) {
        await setTokens(data.access_token, data.refresh_token);
      } else if (tokens?.accessToken) {
        await setTokens(tokens.accessToken, tokens.refreshToken || '');
      }

      if (user) {
        dispatch(setUser(user));
        dispatch(setIsVenter(user?.userType === 'venter'));
        dispatch(setAuthenticated(true));
        navigateAfterLogin(user);
      }
    } catch (e: any) {
      setErrors({ general: e?.error || e?.message || t('LogIn.error.general', 'Invalid credentials. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageFrame>
      <div className="auth-card animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <AppBrandIcon className="w-11 h-11 rounded-2xl" />
          <h1 className="text-xl font-bold text-white tracking-tight">Ventally</h1>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{t('LogIn.title')}</h2>
        <p className="text-sm text-white/80 mb-8">{t('LogIn.subtitle', 'Sign in to continue your journey')}</p>

        <div className="space-y-4">
          <Input
            label={t('LogIn.emailOrPhone')}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors({}); }}
            error={errors.email}
            leftIcon={<Mail size={16} />}
          />
          <Input
            label={t('LogIn.password')}
            isPassword
            placeholder="••••••••"
            value={form.password}
            onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors({}); }}
            error={errors.password}
            leftIcon={<Lock size={16} />}
          />

          {errors.general && (
            <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2">{errors.general}</p>
          )}

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-white/80 hover:text-white transition-colors">
              {t('LogIn.forgotPassword')}
            </Link>
          </div>

          <Button
            variant="primary"
           className='!w-full'
            fullWidth
            loading={loading}
            onClick={handleLogin}
            id="login-submit-btn"
          >
            {t('LogIn.logIn')}
          </Button>
        </div>

        <p className="text-center text-sm text-white/80 mt-6">
          {t('LogIn.dontHaveAccount')}{' '}
          <Link to="/signup" className="text-primary hover:text-primary-hover font-medium transition-colors">
            {t('LogIn.signUp')}
          </Link>
        </p>
      </div>
    </AuthPageFrame>
  );
};
