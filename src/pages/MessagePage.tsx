import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MessagePage = () => {
  const { t } = useTranslation();
  return (
    <div className="glass flex-center" style={{ height: '400px', borderRadius: '24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
        <MessageSquare size={48} />
      </div>
      <h2 style={{ fontSize: '28px', fontWeight: 700 }}>{t('WebLayout.messages', 'Messages')}</h2>
      <p style={{ color: 'var(--text-muted)' }}>{t('WebLayout.noConversations', 'You have no active conversations at the moment.')}</p>
    </div>
  );
};
