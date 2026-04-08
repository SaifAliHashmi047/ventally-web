import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/slices/userSlice';
import { updateProfile } from '../../api';
import { ArrowLeft } from 'lucide-react';

export const NicknameScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length < 3) return;
    setError('');
    setLoading(true);
    try {
      const response = await updateProfile({ displayName: nickname.trim() });
      if (response.success) {
        dispatch(updateUser({ displayName: nickname.trim(), name: nickname.trim() }));
        navigate('/signup/language');
      } else {
        setError((response as { error?: string }).error || t('Common.error') || 'Failed to save');
      }
    } catch (err: unknown) {
      const e = err as { error?: string };
      setError(e?.error || t('Common.error') || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <button 
        type="button"
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '16px' }}>
          {t('Nickname.title')}
        </h1>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div className="flex-center">
          <input 
            type="text" 
            placeholder={t('Nickname.placeholder')}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              borderBottom: '2px solid var(--border)', 
              borderRadius: '0',
              fontSize: '28px', 
              textAlign: 'center', 
              padding: '12px 0',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>

        {error ? <p style={{ color: '#f87171', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p> : null}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || nickname.trim().length < 3}
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
        >
          {loading ? '…' : t('Nickname.save')}
        </button>
      </form>
    </AuthLayout>
  );
};
