import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Home, MessageSquare, Bell, Settings, LogOut, Beaker, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

export const WebLayout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/test', label: 'Safety Hub', icon: Beaker },
    { path: '/chat', label: 'Messages', icon: MessageSquare },
    { path: '/notifications', label: 'Alerts', icon: Bell },
    { path: '/settings', label: 'Preferences', icon: Settings },
  ];
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-deep)' }}>
      {/* Mobile Header */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px', 
        alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 20px', zIndex: 50, background: 'rgba(15, 23, 42, 0.8)', 
        backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)',
        display: 'none' // Hidden by default, shown via media query
      }} className="mobile-only-flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '18px' }}>{t('Common.appName', 'VENTALLY')}</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(4px)' }} 
        />
      )}

      {/* Sidebar */}
      <aside className={`glass sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ 
        width: '280px', margin: '16px', borderRadius: '24px', 
        display: 'flex', flexDirection: 'column', padding: '32px 16px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', marginBottom: '40px' }}>
           <div style={{ 
             width: '36px', height: '36px', borderRadius: '10px', 
             background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)'
           }}>
             <div style={{ width: '12px', height: '12px', border: '2px solid white', borderRadius: '50%' }} />
           </div>
           <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{t('Common.appName', 'VENTALLY')}</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setIsSidebarOpen(false)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: '14px', 
                  color: isActive ? 'var(--text-pure)' : 'var(--text-muted)', 
                  background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'var(--transition-normal)'
                }}
                className={!isActive ? 'sidebar-link-hover' : ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
                  <span style={{ fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                </div>
                {isActive && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />}
              </Link>
            );
          })}
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--divider)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{ fontWeight: 600, fontSize: '14px' }}>{user?.name?.[0] || 'U'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                 <span style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Web User'}</span>
                 <span style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'capitalize' }}>{user?.role || 'Guest'}</span>
              </div>
           </div>
           
           <button 
             onClick={handleLogout} 
             style={{ 
               display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
               padding: '14px 16px', borderRadius: '14px', color: '#f87171', 
               background: 'rgba(248, 113, 113, 0.05)', border: '1px solid rgba(248, 113, 113, 0.1)',
               cursor: 'pointer', fontSize: '15px', fontWeight: 600,
               transition: 'var(--transition-normal)'
             }}
           >
             <LogOut size={18} /> {t('WebLayout.logoutSession', 'Logout Session')}
           </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="main-content" style={{ 
        flex: 1, 
        padding: '32px 48px 32px 16px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            left: -320px;
            top: 0;
            bottom: 0;
            margin: 0;
            border-radius: 0 24px 24px 0;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .sidebar.open {
            transform: translateX(320px);
          }
          .main-content {
            padding: 84px 20px 20px !important;
          }
          .mobile-only-flex {
            display: flex !important;
          }
        }
        .sidebar-link-hover:hover {
          background: rgba(255, 255, 255, 0.03) !important;
          color: var(--text-pure) !important;
        }
      `}</style>
    </div>
  )
}
