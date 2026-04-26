import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import {
  Home, MessageSquare, Phone, Wallet, Settings, MoreHorizontal,
  ChevronRight, LogOut, Menu, Bell
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import type { RootState } from '../../store/store';
import { cn } from '../../utils/cn';

import { MainBackground } from '../ui/MainBackground';
import { AppBrandIcon } from '../ui/AppBrandIcon';

interface NavItem {
  path: string;
  labelKey: string;
  icon: React.ComponentType<any>;
}

// STRICT: Only these 6 items as per requirements
const NAV_ITEMS: NavItem[] = [
  { path: '/venter/home',     labelKey: 'Navigation.tabs.home',     icon: Home },
  { path: '/venter/chat',     labelKey: 'Navigation.tabs.messages', icon: MessageSquare },
  { path: '/venter/calls',    labelKey: 'Navigation.tabs.call',     icon: Phone },
  { path: '/venter/wallet',   labelKey: 'Navigation.tabs.wallet',   icon: Wallet },
  { path: '/venter/others',   labelKey: 'Navigation.tabs.others',   icon: MoreHorizontal },
  { path: '/venter/settings', labelKey: 'Navigation.tabs.settings', icon: Settings },
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

  const isActive = (path: string) => {
    if (path === '/venter/calls') {
      // Calls tab is active on the calls page AND when finding/in a call
      return (
        location.pathname.startsWith('/venter/calls') ||
        location.pathname.startsWith('/venter/finding-listener') ||
        location.pathname.startsWith('/venter/call/')
      );
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex min-h-screen relative">
      <MainBackground />
      {/* All content sits above the background layers */}
      <div className="relative z-10 flex w-full min-h-screen">
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
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-8">
          <AppBrandIcon className="w-10 h-10 rounded-2xl shadow-glow-primary" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t('Common.appName')}</h1>
            <p className="text-xs text-white/80 capitalize">{user?.userType || t('Common.venter')}</p>
          </div>
        </div>

        {/* Nav — STRICT 5 items only */}
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
                <span>{t(item.labelKey)}</span>
                {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="px-3 pb-6 pt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/8"
          >
            <LogOut size={18} />
            <span>{t('Profile.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-y-auto">
        {/* Mobile top bar — hidden on desktop */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 lg:hidden"
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.35)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all"
          >
            <Menu size={18} />
          </button>
          <button
            onClick={() => navigate('/venter/notifications')}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all"
          >
            <Bell size={18} />
          </button>
        </div>
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 w-full">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
};
