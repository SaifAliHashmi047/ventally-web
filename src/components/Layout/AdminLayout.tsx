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

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/listener-requests', label: 'Listener Requests', icon: UserCheck },
  { path: '/admin/reports', label: 'Reports', icon: Flag },
  { path: '/admin/financial', label: 'Financial Stats', icon: DollarSign },
  { path: '/admin/sub-admins', label: 'Sub-Admins', icon: ShieldCheck },
  { path: '/admin/roles', label: 'Roles & Permissions', icon: Lock },
  { path: '/admin/exports', label: 'Exports', icon: Download },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
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
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C2AEBF, #A89BB0)' }}>
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Ventally</h1>
            <p className="text-xs text-gray-400 capitalize">{user?.userType === 'sub_admin' ? 'Sub-Admin' : 'Admin'}</p>
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
                <span>{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-3 pb-6 pt-4 border-t border-white/5 space-y-1">
          <Link to="/admin/profile" onClick={() => setSidebarOpen(false)} className={cn('nav-link', isActive('/admin/profile') && 'active')}>
            <User size={18} />
            <span>{user?.displayName || user?.firstName || 'Admin'}</span>
          </Link>
          <Link to="/admin/security" onClick={() => setSidebarOpen(false)} className={cn('nav-link', isActive('/admin/security') && 'active')}>
            <Lock size={18} />
            <span>Security</span>
          </Link>
          <button onClick={handleLogout} className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/8">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-16 glass border-b border-white/8 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C2AEBF, #A89BB0)' }}>
            <ShieldCheck size={14} className="text-white" />
          </div>
          <span className="font-bold text-white">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
