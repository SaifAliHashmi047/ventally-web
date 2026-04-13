import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminChangeEmailPhone = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [type, setType] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!value) {
      setError(t('AdminChangeEmail.required', 'This field is required'));
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/verify-otp', { state: { type, value } });
    }, 1000);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.changeEmail', 'Change Email/Phone')}
        onBack={() => navigate(-1)}
      />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          {t('AdminChangeEmail.title', 'Update Contact Information')}
        </h2>
        <p className="text-sm text-gray-400">
          {t('AdminChangeEmail.desc', 'Change your admin account email or phone number')}
        </p>
      </div>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setType('email'); setValue(''); setError(''); }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            type === 'email'
              ? 'bg-accent/15 text-accent border border-accent/25'
              : 'text-gray-500 hover:text-white glass'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            {t('AdminChangeEmail.emailTab', 'Email')}
          </div>
        </button>
        <button
          onClick={() => { setType('phone'); setValue(''); setError(''); }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            type === 'phone'
              ? 'bg-accent/15 text-accent border border-accent/25'
              : 'text-gray-500 hover:text-white glass'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} />
            {t('AdminChangeEmail.phoneTab', 'Phone')}
          </div>
        </button>
      </div>

      <GlassCard className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {type === 'email'
                ? t('AdminChangeEmail.newEmail', 'New Email Address')
                : t('AdminChangeEmail.newPhone', 'New Phone Number')
              }
            </label>
            <div className="relative">
              {type === 'email' ? (
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              ) : (
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              )}
              <Input
                type={type === 'email' ? 'email' : 'tel'}
                placeholder={type === 'email' ? 'admin@example.com' : '+1 (555) 000-0000'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      </GlassCard>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight size={18} />}
          loading={loading}
          onClick={handleSubmit}
        >
          {t('AdminChangeEmail.continue', 'Continue')}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={() => navigate(-1)}
        >
          {t('Common.cancel', 'Cancel')}
        </Button>
      </div>
    </div>
  );
};
