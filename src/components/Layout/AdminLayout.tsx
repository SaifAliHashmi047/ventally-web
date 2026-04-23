import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  BarChart3, Users, UserCheck, Flag, DollarSign,
  Settings, LogOut, Menu, X, Bell, Download,
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
        'glass border-r border-white/8',
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

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-16 glass border-b border-white/8 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <AppBrandIcon className="w-9 h-9 rounded-2xl" />
          <span className="font-bold text-white">{t('Common.adminPanel')}</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 w-full">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
};
