import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { logout } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import { toastError } from '../../utils/toast';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DeleteAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  const dispatch = useDispatch();
  const [confirmModal, setConfirmModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!password) { setError(t('DeleteAccount.passwordRequired')); return; }
    setDeleting(true);
    try {
      await deleteAccount(password);
      dispatch(logout() as any);
      navigate('/login');
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
      setError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('DeleteAccount.title')} onBack={() => navigate(-1)} />

      <GlassCard bordered className="border-error/30">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-error/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-error" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">{t('DeleteAccount.warning')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {t('DeleteAccount.description')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input 
            label={t('DeleteAccount.password')}
            isPassword 
            value={password} 
            onChange={e => { setPassword(e.target.value); setError(''); }} 
          />
          {error && <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2">{error}</p>}
        </div>
      </GlassCard>

      <Button 
        variant="danger" 
        size="lg" 
        fullWidth 
        disabled={!password}
        leftIcon={<Trash2 size={18} />}
        onClick={() => setConfirmModal(true)}
      >
        {t('DeleteAccount.button')}
      </Button>

      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title={t('DeleteAccount.title')} size="sm">
        <p className="text-sm text-gray-400 mb-4">
          {t('DeleteAccount.confirmDelete')}
        </p>
        <Input
          label={t('DeleteAccount.password')}
          isPassword
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          error={error}
          placeholder="********"
        />
        <div className="flex gap-3 mt-4">
          <Button variant="glass" fullWidth onClick={() => setConfirmModal(false)}>{t('Common.cancel')}</Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>
            {t('DeleteAccount.button')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
