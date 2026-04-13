import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
      if ((response as any).success !== false) {
        dispatch(updateUser({ displayName: nickname.trim(), name: nickname.trim() }));
        navigate('/signup/language');
      } else {
        setError((response as any)?.error || t('Common.error') || 'Failed to save');
      }
    } catch (err: any) {
      setError(err?.error || t('Common.error') || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-8">
      <div className="auth-card animate-slide-up w-full max-w-md">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-xl font-bold text-white">
            {t('Nickname.title')}
          </h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-12">
          <div className="flex-center">
            <input 
              type="text" 
              placeholder={t('Nickname.placeholder')}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoFocus
              className="w-full bg-transparent border-none border-b-2 border-white/10 rounded-none text-[28px] text-center py-3 text-white outline-none focus:border-primary transition-colors"
            />
          </div>

          {error ? <p className="text-sm text-error bg-error/8 border border-error/20 rounded-xl px-3 py-2 text-center">{error}</p> : null}

          <button 
            type="submit" 
            className="btn-primary w-full h-14 justify-center text-[17px] rounded-2xl" 
            disabled={loading || nickname.trim().length < 3}
          >
            {loading ? '…' : t('Nickname.save')}
          </button>
        </form>
      </div>
    </div>
  );
};
