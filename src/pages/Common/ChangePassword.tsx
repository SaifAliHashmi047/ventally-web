import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { logout } from '../../store/slices/userSlice';
import { useCredentialsChange } from '../../api/hooks/useCredentialsChange';
import { toastError, toastSuccess } from '../../utils/toast';

export const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updatePassword } = useCredentialsChange();

  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validateStrongPassword = (pwd: string): string | null => {
    if (!pwd || pwd.trim().length === 0) return t('Common.fillRequiredFields');
    if (pwd.length < 8) return t('Common.passwordValidationError');
    if (!/[A-Z]/.test(pwd)) return t('Common.passwordValidationError');
    if (!/[a-z]/.test(pwd)) return t('Common.passwordValidationError');
    if (!/\d/.test(pwd)) return t('Common.passwordValidationError');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) return t('Common.passwordValidationError');
    return null;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.current) errs.current = t('Common.fillRequiredFields');
    const strongErr = validateStrongPassword(form.newPwd);
    if (strongErr) errs.newPwd = strongErr;
    if (form.newPwd !== form.confirm) errs.confirm = t('Common.fillRequiredFields');
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toastError(t('Common.fillRequiredFields'));
      return;
    }
    setSaving(true);
    try {
      await updatePassword(form.current, form.newPwd);
      toastSuccess(t('ChangePassword.resetSuccessTitle'));
      // Logout after password change — same as RN behavior
      setTimeout(() => {
        dispatch(logout() as any);
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      const msg = error?.error || error?.message || t('Common.somethingWentWrong');
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('ChangePassword.title')} onBack={() => navigate(-1)} />

      <GlassCard bordered>
        <div className="space-y-4">
          <Input
            label={t('ChangePassword.oldPassword')}
            isPassword
            value={form.current}
            onChange={e => { setForm(p => ({ ...p, current: e.target.value })); setErrors(p => ({ ...p, current: '' })); }}
            error={errors.current}
            placeholder={t('ChangePassword.oldPassword')}
          />
          <Input
            label={t('ChangePassword.newPassword')}
            isPassword
            value={form.newPwd}
            onChange={e => { setForm(p => ({ ...p, newPwd: e.target.value })); setErrors(p => ({ ...p, newPwd: '' })); }}
            error={errors.newPwd}
            placeholder={t('ChangePassword.newPassword')}
          />
          <Input
            label={t('ChangePassword.confirmPassword')}
            isPassword
            value={form.confirm}
            onChange={e => { setForm(p => ({ ...p, confirm: e.target.value })); setErrors(p => ({ ...p, confirm: '' })); }}
            error={errors.confirm}
            placeholder={t('ChangePassword.confirmPassword')}
          />
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        onClick={handleSave}
      >
        {t('ChangePassword.update')}
      </Button>
    </div>
  );
};
