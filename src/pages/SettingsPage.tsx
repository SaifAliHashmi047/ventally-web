import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SettingsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
        <div style={{ color: 'var(--accent)' }}><Settings size={32} /></div>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>{t('WebLayout.nav.preferences', 'Preferences')}</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>{t('SettingsPage.pushNotifications', 'Push Notifications')}</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: '4px 0 0' }}>{t('SettingsPage.pushNotificationsDesc', 'Receive alerts about session updates')}</p>
          </div>
          <div style={{ width: '40px', height: '20px', background: 'var(--primary)', borderRadius: '20px' }} />
        </div>

        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>{t('SettingsPage.twoFactorAuth', 'Two-Factor Authentication')}</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: '4px 0 0' }}>{t('SettingsPage.twoFactorAuthDesc', 'Secure your account with 2FA')}</p>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>{t('SettingsPage.enable', 'Enable')}</button>
        </div>
      </div>
    </div>
  );
};
