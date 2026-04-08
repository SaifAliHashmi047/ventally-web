import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { ArrowLeft } from 'lucide-react';

export const NicknameScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [nickname, setNickname] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length >= 3) {
      // Mock update
      dispatch(setUser({ ...user, displayName: nickname.trim() }));
      navigate('/signup/language');
    }
  };

  return (
    <AuthLayout>
      <button 
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

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
          disabled={nickname.trim().length < 3}
        >
          {t('Nickname.save')}
        </button>
      </form>
    </AuthLayout>
  );
};
