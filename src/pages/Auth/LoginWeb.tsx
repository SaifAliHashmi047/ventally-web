import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAuthenticated, setIsVenter, setUser } from '../../store/slices/userSlice';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { PasswordField } from '../../components/Auth/PasswordField';
import { login, setTokens, mapApiUserToStore } from '../../api';
import chatIcon from '../../assets/icons/chat.png';
import googleIcon from '../../assets/icons/google.png';
import appleIcon from '../../assets/icons/appleLogin.png';
import fbIcon from '../../assets/icons/fb.png';

export const LoginWeb = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success && response.data) {
        const data = response.data as Record<string, any>;
        if (data.access_token && data.refresh_token) {
          await setTokens(data.access_token, data.refresh_token);
        } else if (data.tokens?.accessToken && data.tokens?.refreshToken) {
          await setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        }
        const u = data.user;
        dispatch(setUser(mapApiUserToStore(u)));
        const isVenter = u?.userType === 'venter';
        dispatch(setIsVenter(isVenter));
        dispatch(setAuthenticated(true));
        navigate('/', { replace: true });
      } else {
        setError((response as { error?: string }).error || t('Common.error') || 'Login failed');
      }
    } catch (err: unknown) {
      const e = err as { error?: string };
      setError(e?.error || t('Common.error') || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          className="flex-center"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            margin: '0 auto 16px',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '12px',
          }}
        >
          <img src={chatIcon} alt="Ventally" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>{t('LogIn.title')}</h1>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{t('LogIn.emailOrPhone')}</label>
          <input
            type="text"
            autoComplete="username"
            placeholder={t('SignUp.emailOrPhone')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', height: '52px' }}
            required
          />
        </div>

        <PasswordField
          label={t('LogIn.password')}
          placeholder={t('LogIn.password')}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        {error ? (
          <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }} role="alert">
            {error}
          </p>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-4px', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-main)' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            {t('LogIn.rememberMe')}
          </label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            style={{
              fontSize: '14px',
              color: 'var(--text-pure)',
              textDecoration: 'underline',
              fontWeight: 500,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            {t('LogIn.forgotPassword')}?
          </button>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ height: '56px', justifyContent: 'center', fontSize: '17px', marginTop: '8px', borderRadius: '16px' }}
        >
          {loading ? '…' : t('LogIn.logIn')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
          {t('LogIn.dontHaveAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            style={{
              color: 'var(--text-pure)',
              textDecoration: 'underline',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {t('LogIn.signUp')}
          </button>
        </p>
      </div>

      <div className="divider-text">{t('LogIn.continueWith')}</div>

      <div className="social-buttons">
        <button type="button" className="social-btn" title="Sign in with Google">
          <img src={googleIcon} alt="Google" />
        </button>
        <button type="button" className="social-btn" title="Sign in with Facebook">
          <img src={fbIcon} alt="Facebook" />
        </button>
        <button type="button" className="social-btn" title="Sign in with Apple">
          <img src={appleIcon} alt="Apple" />
        </button>
      </div>
    </AuthLayout>
  );
};
