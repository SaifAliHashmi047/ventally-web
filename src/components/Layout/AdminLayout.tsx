import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  BarChart3, Users, UserCheck, Flag, DollarSign,
  Settings, LogOut, Menu, Bell, Download,
  ShieldCheck, ChevronRight, User, Lock
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import type { RootState } from '../../store/store';
import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';
import { MainBackground } from '../ui/MainBackground';
import { AppBrandIcon } from '../ui/AppBrandIcon';

const NAV_ITEMS = [
  { path: '/admin/dashboard', labelKey: 'Navigation.tabs.home', fallback: 'Dashboard', icon: BarChart3 },
  { path: '/admin/users', labelKey: 'Navigation.tabs.users', fallback: 'Users', icon: Users },
  { path: '/admin/sub-admins', labelKey: 'Navigation.tabs.subAdmins', fallback: 'Sub Admins', icon: ShieldCheck },
  { path: '/admin/reports', labelKey: 'Navigation.tabs.reports', fallback: 'Reports', icon: Flag },
  { path: '/admin/settings', labelKey: 'Navigation.tabs.settings', fallback: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user as any);

  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex min-h-screen relative">
      <MainBackground />
      <div className="relative z-10 flex w-full min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 bottom-0 z-50 flex flex-col w-72',
        'glass border-r border-white/8 [&::before]:hidden [&::after]:hidden',
        'transition-transform duration-300 ease-smooth',
        'lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-8">
          <AppBrandIcon className="w-10 h-10 rounded-2xl shadow-glow-primary" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t('Common.appName')}</h1>
            <p className="text-xs text-gray-400 capitalize">{user?.userType === 'sub_admin' ? t('Common.subAdmin') : t('Common.admin')}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
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
                <span>{t(item.labelKey, item.fallback)}</span>
                {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer - removed security and profile as per strict requirement. Settings handles them */}
        <div className="px-3 pb-6 pt-4 border-t border-white/5 space-y-1">
          <div className="nav-link w-full text-left text-white/50 cursor-default hover:bg-transparent">
             <User size={18} />
             <span>{user?.displayName || user?.firstName || 'Admin'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-y-auto">
        {/* Mobile top bar — hidden on desktop */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 lg:hidden"
        >
          <div className="flex items-center gap-2.5">
            <AppBrandIcon className="w-8 h-8 rounded-xl flex-shrink-0" />
            <div>
              <p className="text-xs text-white/60 leading-none">{t('Home.welcomeBack', 'Welcome back,')}</p>
              <p className="text-sm font-semibold text-white leading-tight mt-0.5">
                {user?.firstName || user?.displayName?.split(' ')[0] || t('Common.admin', 'Admin')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all"
            >
              <Bell size={18} />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 w-full">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
};
