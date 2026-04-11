import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import apiInstance from '../../api/apiInstance';
import { Mail, Lock, User } from 'lucide-react';

export const SignUpWeb = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', userType: 'venter' });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.email.includes('@')) errs.email = 'Valid email required';
    if (form.password.length < 8) errs.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSignUp = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await apiInstance.post('auth/register', form);
      navigate('/signup/otp', { state: { email: form.email } });
    } catch (e: any) {
      setErrors({ general: e?.response?.data?.message || 'Registration failed. Please try again.' });
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
          <h1 className="text-2xl font-bold text-white">Ventally</h1>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-sm text-gray-500 mb-6">Start your wellness journey today</p>

        {/* Role Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'venter', label: '🎙️ Venter', desc: 'Share & heal' },
            { value: 'listener', label: '🎧 Listener', desc: 'Support others' },
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
            <Input label="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} error={errors.firstName} leftIcon={<User size={14} />} />
            <Input label="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} leftIcon={<Mail size={14} />} />
          <Input label="Password" isPassword value={form.password} onChange={e => update('password', e.target.value)} error={errors.password} hint="Minimum 8 characters" leftIcon={<Lock size={14} />} />
          <Input label="Confirm Password" isPassword value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} error={errors.confirmPassword} leftIcon={<Lock size={14} />} />

          {errors.general && (
            <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2">{errors.general}</p>
          )}

          <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleSignUp} id="signup-submit-btn">
            Create Account
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
