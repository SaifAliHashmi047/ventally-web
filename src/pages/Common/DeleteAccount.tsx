import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { logout } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DeleteAccount = () => {
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  const dispatch = useDispatch();
  const [confirmModal, setConfirmModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!password) { setError('Please enter your password to confirm.'); return; }
    setDeleting(true);
    try {
      await deleteAccount(password);
      dispatch(logout() as any);
      navigate('/login');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to delete account. Check your password.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Delete Account" onBack={() => navigate(-1)} />

      <GlassCard bordered className="border-error/20 bg-error/5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-error/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-error" />
          </div>
          <div>
            <p className="text-sm font-bold text-error">Warning: This action cannot be undone</p>
            <p className="text-xs text-gray-400 mt-1">Deleting your account will permanently remove all your data including sessions, mood logs, reflections, and wallet balance.</p>
          </div>
        </div>

        <ul className="space-y-2">
          {['All sessions and history', 'Mood logs and reflections', 'Recovery progress', 'Wallet balance', 'Account profile'].map(item => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-error" />
              {item}
            </li>
          ))}
        </ul>
      </GlassCard>

      <Button
        variant="danger"
        size="lg"
        fullWidth
        leftIcon={<Trash2 size={18} />}
        onClick={() => setConfirmModal(true)}
      >
        Delete My Account
      </Button>

      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirm Account Deletion" size="sm">
        <p className="text-sm text-gray-400 mb-4">
          Enter your password to permanently delete your account. This cannot be undone.
        </p>
        <Input
          label="Your Password"
          isPassword
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          error={error}
          placeholder="Enter your password..."
        />
        <div className="flex gap-3 mt-4">
          <Button variant="glass" fullWidth onClick={() => setConfirmModal(false)}>Cancel</Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>
            Delete Account
          </Button>
        </div>
      </Modal>
    </div>
  );
};
