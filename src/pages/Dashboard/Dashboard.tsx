import { TrendingUp, Users, Star, ArrowUpRight, Activity, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user.user);

  const stats = [
    { label: t('dashboard.stats.walletBalance'), value: `$${user?.balance?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: '#10b981', trend: '+12.5%' },
    { label: t('dashboard.stats.activeSessions'), value: '3', icon: Users, color: 'var(--primary)', trend: '+2 this week' },
    { label: t('dashboard.stats.totalRating'), value: '4.9 ★', icon: Star, color: '#f59e0b', trend: 'Top 5%' },
  ];

  const activities = [
    { text: 'Session completed with Listener #2', time: '2 hours ago', type: 'session' },
    { text: 'Wallet replenished via Stripe', time: 'Yesterday', type: 'payment' },
    { text: 'Account upgraded to premium tier', time: 'Oct 12, 2025', type: 'upgrade' },
    { text: 'Security settings updated', time: 'Oct 10, 2025', type: 'security' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ position: 'relative' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          {t('dashboard.welcome', { name: user?.name?.split(' ')[0] || 'User' })}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} /> {t('dashboard.statusIntro')}
        </p>
      </header>
      
      <div className="grid-responsive">
        {stats.map((stat, i) => (
          <div key={i} className="glass glass-hover" style={{ padding: '32px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: stat.color, filter: 'blur(50px)', opacity: 0.15 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                {stat.trend}
              </span>
            </div>
            <h3 style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: '15px', marginBottom: '8px' }}>{stat.label}</h3>
            <h2 style={{ fontSize: '36px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{stat.value}</h2>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }} className="dashboard-grid-main">
        <div className="glass" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>{t('dashboard.recentActivity')}</h2>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t('dashboard.viewAllHistory')} <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((act, i) => (
              <div key={i} style={{ 
                padding: '16px 20px', background: 'rgba(255,255,255,0.02)', 
                borderRadius: '16px', border: '1px solid var(--divider)', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'var(--transition-fast)'
              }} className="activity-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--border)' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{act.text}</span>
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: '32px', borderRadius: '24px', background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>{t('dashboard.quickActions')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: t('dashboard.actions.requestSession'), key: 'request' },
              { label: t('dashboard.actions.addFunds'), key: 'funds' },
              { label: t('dashboard.actions.downloadReport'), key: 'report' },
              { label: t('dashboard.actions.contactSupport'), key: 'support' }
            ].map((action, i) => (
              <button key={action.key} className="btn-primary" style={{ 
                width: '100%', justifyContent: 'space-between', 
                background: i === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                border: i === 0 ? 'none' : '1px solid var(--border)',
                color: i === 0 ? 'white' : 'var(--text-main)',
                padding: '16px 20px'
              }}>
                {action.label} <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .activity-item:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: var(--border) !important;
        }
        @media (max-width: 1100px) {
          .dashboard-grid-main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
