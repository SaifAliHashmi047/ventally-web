import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import {
  Home, MessageSquare, Bell, Settings, LogOut, Menu, X,
  Wallet, Brain, BookOpen, TrendingUp, ChevronRight, User, Shield
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import type { RootState } from '../../store/store';
import { cn } from '../../utils/cn';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/venter/home', label: 'Navigation.tabs.home', icon: Home },
  { path: '/venter/chat', label: 'Navigation.tabs.messages', icon: MessageSquare },
  { path: '/venter/mood', label: 'VenterHome.moodCheckIn', icon: Brain },
  { path: '/venter/reflections', label: 'VenterHome.reflections', icon: BookOpen },
  { path: '/venter/recovery', label: 'VenterRecovery.dashboard.title', icon: TrendingUp },
  { path: '/venter/wallet', label: 'Navigation.tabs.wallet', icon: Wallet },
  { path: '/venter/notifications', label: 'Notifications.title', icon: Bell },
  { path: '/venter/settings', label: 'Navigation.tabs.settings', icon: Settings },
];

interface VenterLayoutProps {
  children: ReactNode;
}

export const VenterLayout = ({ children }: VenterLayoutProps) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex min-h-screen bg-bg-deep">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 flex flex-col w-72',
          'glass border-r border-white/8',
          'transition-transform duration-300 ease-smooth',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-8">
          <div className="w-9 h-9 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Ventally</h1>
            <p className="text-xs text-gray-500 capitalize">{user?.userType || 'Venter'}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn('nav-link', active && 'active')}
              >
                <Icon size={18} />
                <span>{t(item.label)}</span>
                {item.badge ? (
                  <span className="ml-auto badge badge-error text-xs">{item.badge}</span>
                ) : active ? (
                  <ChevronRight size={14} className="ml-auto opacity-50" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-3 pb-6 pt-4 border-t border-white/5 space-y-1">
          <Link
            to="/venter/profile"
            onClick={() => setSidebarOpen(false)}
            className={cn('nav-link', isActive('/venter/profile') && 'active')}
          >
            <User size={18} />
            <span>{t('Profile.title')}</span>
          </Link>
          <Link
            to="/venter/security"
            onClick={() => setSidebarOpen(false)}
            className={cn('nav-link', isActive('/venter/security') && 'active')}
          >
            <Shield size={18} />
            <span>{t('Security.title')}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/8"
          >
            <LogOut size={18} />
            <span>{t('Profile.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-16 glass border-b border-white/8 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
            <div className="w-2.5 h-2.5 border-2 border-white rounded-full" />
          </div>
          <span className="font-bold text-white">Ventally</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
