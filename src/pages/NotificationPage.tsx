import { Bell } from 'lucide-react';

export const NotificationPage = () => {
  return (
    <div className="glass flex-center" style={{ height: '400px', borderRadius: '24px', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '20px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', color: 'var(--secondary)' }}>
        <Bell size={48} />
      </div>
      <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Notifications</h2>
      <p style={{ color: 'var(--text-muted)' }}>You're all caught up! No new notifications.</p>
    </div>
  );
};
