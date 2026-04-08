import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { PasswordField } from '../../components/Auth/PasswordField';
import { register, setTokens, mapApiUserToStore } from '../../api';
import { setIsVenter, updateUser } from '../../store/slices/userSlice';
import chatIcon from '../../assets/icons/chat.png';
import googleIcon from '../../assets/icons/google.png';
import appleIcon from '../../assets/icons/appleLogin.png';
import fbIcon from '../../assets/icons/fb.png';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignUpWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('venter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const trimmed = emailOrPhone.trim();
      const isEmail = emailRegex.test(trimmed);
      const payload: {
        password: string;
        userType: string;
        email?: string;
        phoneNumber?: string;
      } = {
        password,
        userType: role,
      };
      if (isEmail) {
        payload.email = trimmed;
      } else {
        payload.phoneNumber = trimmed;
      }

      const response = await register(payload);
      if (response.success && response.data) {
        const data = response.data as Record<string, any>;
        if (data.access_token && data.refresh_token) {
          await setTokens(data.access_token, data.refresh_token);
        } else if (data.tokens?.accessToken && data.tokens?.refreshToken) {
          await setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        }
        if (data.user) {
          dispatch(updateUser(mapApiUserToStore(data.user)));
          dispatch(setIsVenter(data.user?.userType === 'venter'));
        }
        navigate('/signup/otp', { state: { email: trimmed } });
      } else {
        setError((response as { error?: string }).error || t('Common.error') || 'Sign up failed');
      }
    } catch (err: unknown) {
      const e = err as { error?: string };
      setError(e?.error || t('Common.error') || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="flex-center" style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '20px', 
          margin: '0 auto 16px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '12px'
        }}>
          <img src={chatIcon} alt="Ventally" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>{t('SignUp.title')}</h1>
      </div>

      <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{t('SignUp.emailOrPhone')}</label>
          <input 
            type="text" 
            placeholder={t('SignUp.emailOrPhone')}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            style={{ width: '100%', height: '52px' }}
            required
          />
        </div>

        <PasswordField
          label={t('SignUp.password')}
          placeholder={t('SignUp.password')}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          hint={t('SignUp.passwordHint')}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{t('SignUp.howWillYouUse')}</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', height: '52px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', padding: '0 16px' }}
          >
            <option value="venter">{t('SignUp.usageOptions.wantToVent')}</option>
            <option value="listener">{t('SignUp.usageOptions.wantToListen')}</option>
          </select>
        </div>

        {error ? <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p> : null}

        <button type="submit" className="btn-primary" disabled={loading} style={{ height: '56px', justifyContent: 'center', fontSize: '17px', marginTop: '8px', borderRadius: '16px' }}>
          {loading ? '…' : t('SignUp.createAccount')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
          {t('SignUp.alreadyHaveAccount')}{' '}
          <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: 'var(--text-pure)', textDecoration: 'underline', fontWeight: 600 }}>
            {t('SignUp.logIn')}
          </a>
        </p>
      </div>

      <div className="divider-text">{t('SignUp.continueWith')}</div>

      <div className="social-buttons">
        <button type="button" className="social-btn"><img src={googleIcon} alt="Google" /></button>
        <button type="button" className="social-btn"><img src={fbIcon} alt="Facebook" /></button>
        <button type="button" className="social-btn"><img src={appleIcon} alt="Apple" /></button>
      </div>
    </AuthLayout>
  );
};
