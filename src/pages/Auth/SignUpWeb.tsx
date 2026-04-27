import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { setTokens } from '../../api';
import apiInstance from '../../api/apiInstance';
import { useDispatch } from 'react-redux';
import { setUser, setAuthenticated, setIsVenter } from '../../store/slices/userSlice';
import { Mail, Lock } from 'lucide-react';
import { AuthPageFrame } from '../../components/ui/AuthPageFrame';
import { AppBrandIcon } from '../../components/ui/AppBrandIcon';

export const SignUpWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: '' as 'venter' | 'listener' | '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors((prev: any) => ({ ...prev, [key]: undefined, general: undefined }));
  };

  // Strong password validation — matches native exactly
  const validatePassword = (pwd: string) => {
    if (
      !pwd ||
      pwd.length < 8 ||
      !/[A-Z]/.test(pwd) ||
      !/[a-z]/.test(pwd) ||
      !/\d/.test(pwd) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    ) {
      return t('Common.passwordValidationError', 'Password must be at least 8 chars, include uppercase, number and special character');
    }
    return '';
  };

  const validate = () => {
    const errs: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) errs.email = t('SignUp.error.validEmail', 'Valid email required');
    const pwdError = validatePassword(form.password);
    if (pwdError) errs.password = pwdError;
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('SignUp.error.passwordMatch', 'Passwords do not match');
    if (!form.userType) errs.userType = t('SignUp.selectUsage', 'Please select how you will use the app');
    return errs;
  };

  const handleSignUp = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await apiInstance.post('auth/register', {
        email: form.email.trim(),
        password: form.password,
        userType: form.userType,
      });

      const data = res.data || res;

      // Handle both token shapes native uses
      if (data?.access_token && data?.refresh_token) {
        await setTokens(data.access_token, data.refresh_token);
      } else if (data?.tokens?.accessToken) {
        await setTokens(data.tokens.accessToken, data.tokens.refreshToken || '');
      }

      if (data?.user) {
        dispatch(setUser(data.user));
        dispatch(setIsVenter(data.user?.userType === 'venter'));
      }

      // ── Navigate to OTP, carrying email + userType for post-verify branching ──
      navigate('/signup/otp', { state: { email: form.email.trim(), userType: form.userType } });
    } catch (e: any) {
      setErrors({ general: e?.error || e?.message || t('SignUp.error.general', 'Registration failed. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageFrame>
      <div className="auth-card animate-slide-up w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <AppBrandIcon className="w-11 h-11 rounded-2xl" />
          <h1 className="text-xl font-bold text-white">{t('Common.appName', 'Ventally')}</h1>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{t('SignUp.title')}</h2>
        <p className="text-sm text-white/80 mb-6">{t('SignUp.subtitle', 'Start your wellness journey today')}</p>

        {/* ── Role Selector ── */}
        <p className="text-sm font-medium text-white mb-2">{t('SignUp.howWillYouUse')}</p>
        <div className="flex gap-3 mb-2">
          {([
            { value: 'venter'   as const, label: `${t('SignUp.usageOptions.wantToVent')}` },
            { value: 'listener' as const, label: `${t('SignUp.usageOptions.wantToListen')}` },
          ] as const).map(role => {
            const isSelected = form.userType === role.value;
            return (
              <button
                key={role.value}
                onClick={() => update('userType', role.value)}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-white shadow-[0_0_0_1px_var(--primary)] scale-[1.02]'
                    : 'bg-white/4 border-white/12 text-white/55 hover:bg-white/8 hover:border-white/20'
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>
        {errors.userType && (
          <p className="text-xs text-error mb-4 ml-1">{errors.userType}</p>
        )}

        <div className="space-y-4 mt-4">
          <Input
            label={t('SignUp.emailOrPhone', 'Email')}
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            error={errors.email}
            leftIcon={<Mail size={14} />}
          />
          <Input
            label={t('SignUp.password', 'Password')}
            isPassword
            value={form.password}
            onChange={e => update('password', e.target.value)}
            error={errors.password}
            hint={t('SignUp.passwordHint')}
            leftIcon={<Lock size={14} />}
          />
          <Input
            label={t('Common.confirmPassword', 'Confirm Password')}
            isPassword
            value={form.confirmPassword}
            onChange={e => update('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock size={14} />}
          />

          {errors.general && (
            <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2">{errors.general}</p>
          )}

          <Button variant="primary" 
           className='!w-full'

            fullWidth
             loading={loading}
             onClick={handleSignUp} id="signup-submit-btn">
            {t('SignUp.createAccount')}
          </Button>
        </div>

        <p className="text-center text-sm text-white/80 mt-6">
          {t('SignUp.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">{t('SignUp.logIn')}</Link>
        </p>
      </div>
    </AuthPageFrame>
  );
};
