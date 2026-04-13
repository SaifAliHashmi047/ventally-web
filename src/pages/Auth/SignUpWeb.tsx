import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { setTokens } from '../../api';
import apiInstance from '../../api/apiInstance';
import { useDispatch } from 'react-redux';
import { setUser, setAuthenticated } from '../../store/slices/userSlice';
import { Mail, Lock, User } from 'lucide-react';

export const SignUpWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', userType: 'venter' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.firstName.trim()) errs.firstName = t('SignUp.error.required', 'Required');
    if (!form.email.includes('@')) errs.email = t('SignUp.error.validEmail', 'Valid email required');
    if (form.password.length < 8) errs.password = t('SignUp.error.minPassword', 'Minimum 8 characters');
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('SignUp.error.passwordMatch', 'Passwords do not match');
    return errs;
  };

  const handleSignUp = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await apiInstance.post('auth/register', form);
      const { tokens, user } = res.data || {};
      if (tokens?.accessToken) {
        await setTokens(tokens.accessToken, tokens.refreshToken || '');
      }
      if (user) {
        dispatch(setUser(user));
        dispatch(setAuthenticated(true));
      }
      navigate('/signup/otp', { state: { email: form.email } });
    } catch (e: any) {
      setErrors({ general: e?.error || t('SignUp.error.general', 'Registration failed. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors((prev: any) => ({ ...prev, [key]: undefined, general: undefined }));
  };

  return (
    <div className="auth-container py-8">
      <div className="auth-card animate-slide-up w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <h1 className="text-xl font-bold text-white">Ventally</h1>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{t('SignUp.title')}</h2>
        <p className="text-sm text-gray-500 mb-6">{t('SignUp.subtitle', 'Start your wellness journey today')}</p>

        {/* Role Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'venter', label: `🎙️ ${t('SignUp.usageOptions.venter')}`, desc: t('SignUp.usageOptions.wantToVent') },
            { value: 'listener', label: `🎧 ${t('SignUp.usageOptions.listener')}`, desc: t('SignUp.usageOptions.wantToListen') },
          ].map(role => (
            <button key={role.value} onClick={() => update('userType', role.value)}
              className={`flex-1 py-3 rounded-2xl text-sm border transition-all ${
                form.userType === role.value
                  ? 'bg-primary/15 border-primary/30 text-white'
                  : 'glass border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              <p className="font-semibold">{role.label}</p>
              <p className="text-xs mt-0.5 opacity-70">{role.desc}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('Common.firstName', 'First Name')} value={form.firstName} onChange={e => update('firstName', e.target.value)} error={errors.firstName} leftIcon={<User size={14} />} />
            <Input label={t('Common.lastName', 'Last Name')} value={form.lastName} onChange={e => update('lastName', e.target.value)} />
          </div>
          <Input label={t('SignUp.emailOrPhone')} type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} leftIcon={<Mail size={14} />} />
          <Input label={t('SignUp.password')} isPassword value={form.password} onChange={e => update('password', e.target.value)} error={errors.password} hint={t('SignUp.passwordHint')} leftIcon={<Lock size={14} />} />
          <Input label={t('Common.confirmPassword', 'Confirm Password')} isPassword value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} error={errors.confirmPassword} leftIcon={<Lock size={14} />} />

          {errors.general && (
            <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2">{errors.general}</p>
          )}

          <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleSignUp} id="signup-submit-btn">
            {t('SignUp.createAccount')}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('SignUp.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">{t('SignUp.logIn')}</Link>
        </p>
      </div>
    </div>
  );
};
