import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import chatIcon from '../../assets/icons/chat.png';
import googleIcon from '../../assets/icons/google.png';
import appleIcon from '../../assets/icons/appleLogin.png';
import fbIcon from '../../assets/icons/fb.png';

export const SignUpWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('venter');

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, logic would go here
    navigate('/signup/otp', { state: { email } });
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', height: '52px' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>{t('SignUp.password')}</label>
          <input 
            type="password" 
            placeholder={t('SignUp.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', height: '52px' }}
            required
          />
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0 4px' }}>{t('SignUp.passwordHint')}</p>
        </div>

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

        <button type="submit" className="btn-primary" style={{ height: '56px', justifyContent: 'center', fontSize: '17px', marginTop: '8px', borderRadius: '16px' }}>
          {t('SignUp.createAccount')}
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
        <button className="social-btn"><img src={googleIcon} alt="Google" /></button>
        <button className="social-btn"><img src={fbIcon} alt="Facebook" /></button>
        <button className="social-btn"><img src={appleIcon} alt="Apple" /></button>
      </div>
    </AuthLayout>
  );
};
