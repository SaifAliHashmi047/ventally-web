import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { setTokens } from '../../api';
import apiInstance from '../../api/apiInstance';
import { setUser, setAuthenticated } from '../../store/slices/userSlice';
import { Mail, Lock } from 'lucide-react';

export const LoginWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.email.includes('@')) errs.email = t('LogIn.error.validEmail', 'Enter a valid email');
    if (!form.password) errs.password = t('LogIn.error.passwordRequired', 'Password is required');
    return errs;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await apiInstance.post('auth/login', form);
      const { tokens, user } = res.data || {};
      if (tokens?.accessToken) {
        await setTokens(tokens.accessToken, tokens.refreshToken || '');
      }
      dispatch(setUser(user));
      dispatch(setAuthenticated(true));
    } catch (e: any) {
      setErrors({ general: e?.error || t('LogIn.error.general', 'Invalid credentials. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Ventally</h1>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{t('LogIn.title')}</h2>
        <p className="text-sm text-gray-500 mb-8">{t('LogIn.subtitle', 'Sign in to continue your journey')}</p>

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
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-white transition-colors">
              {t('LogIn.forgotPassword')}
            </Link>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onClick={handleLogin}
            id="login-submit-btn"
          >
            {t('LogIn.logIn')}
          </Button>
        </div>

        <div className="divider-text mt-6 mb-6 text-xs">{t('LogIn.biometric', 'Or continue with').trim().toLowerCase()}</div>

        <p className="text-center text-sm text-gray-500">
          {t('LogIn.dontHaveAccount')}{' '}
          <Link to="/signup" className="text-primary hover:text-primary-hover font-medium transition-colors">
            {t('LogIn.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
};
