import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { CheckCircle2 } from 'lucide-react';

export const ResetSuccessfulWeb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const tmr = window.setTimeout(() => navigate('/login', { replace: true }), 5000);
    return () => window.clearTimeout(tmr);
  }, [navigate]);

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', padding: '16px 8px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircle2 size={64} color="#4ade80" strokeWidth={1.5} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-pure)', margin: '0 0 12px' }}>{t('ResetSuccessful.title')}</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-dim)', margin: '0 0 28px', lineHeight: 1.5 }}>{t('ResetSuccessful.description')}</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/login', { replace: true })} style={{ width: '100%', height: '52px', borderRadius: '16px', justifyContent: 'center' }}>
          {t('ResetSuccessful.continue')}
        </button>
        <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '16px' }}>Redirecting to log in…</p>
      </div>
    </AuthLayout>
  );
};
