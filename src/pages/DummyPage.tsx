import { useTranslation } from 'react-i18next';

export const DummyPage = () => {
  const { t } = useTranslation();
  return (
    <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800 }}>{t('DummyPage.safetyHub', 'Safety Hub')}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>{t('DummyPage.description', 'This is where you can manage your safety settings and reports.')}</p>

      <div className="grid-responsive" style={{ marginTop: '20px' }}>
        <div className="glass-dark" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>{t('DummyPage.verifyIdentity', 'Verify Identity')}</h3>
          <p style={{ color: 'var(--text-dim)' }}>{t('DummyPage.verifyIdentityDesc', 'Ensure your account is secure by verifying your mobile number.')}</p>
        </div>
        <div className="glass-dark" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>{t('DummyPage.emergencyContacts', 'Emergency Contacts')}</h3>
          <p style={{ color: 'var(--text-dim)' }}>{t('DummyPage.emergencyContactsDesc', 'Manage people to notify in case of an emergency during a session.')}</p>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={() => alert(t('DummyPage.comingSoon', 'Feature coming soon!'))}
        style={{ width: 'fit-content', marginTop: '12px' }}
      >
        {t('DummyPage.launchSecurityAudit', 'Launch Security Audit')}
      </button>
    </div>
  );
};
