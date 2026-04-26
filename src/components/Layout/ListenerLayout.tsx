import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  Home, Users, Wallet, User, Settings, LogOut, ChevronRight, Menu, Bell
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/userSlice';
import { setRequests, clearRequests, setAvailability } from '../../store/slices/listenerSlice';
import { useAvailability } from '../../api/hooks/useAvailability';
import type { RootState } from '../../store/store';
import { cn } from '../../utils/cn';
import socketService from '../../api/socketService';

import { MainBackground } from '../ui/MainBackground';
import { AppBrandIcon } from '../ui/AppBrandIcon';

// Defining exact 5 tabs used natively in ListenerHomeStack.tsx
const NAV_ITEMS = [
  { path: '/listener/home', labelKey: 'Navigation.tabs.home', icon: Home },
  { path: '/listener/requests', labelKey: 'Navigation.tabs.requests', icon: Users },
  { path: '/listener/wallet', labelKey: 'Navigation.tabs.wallet', icon: Wallet },
  { path: '/listener/profile', labelKey: 'Navigation.tabs.profile', icon: User },
  { path: '/listener/settings', labelKey: 'Navigation.tabs.settings', icon: Settings },
];

interface ListenerLayoutProps {
  children: ReactNode;
}

export const ListenerLayout = ({ children }: ListenerLayoutProps) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getStatus } = useAvailability();
  const isAvailable = useSelector((state: RootState) => (state.listener as any).isAvailable as boolean);

  useEffect(() => {
    getStatus()
      .then(res => dispatch(setAvailability(res?.status?.isOnline ?? false)))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logout() as any);
    socketService.disconnect();
    navigate('/login');
  };

  // Socket connection for real-time requests
  useEffect(() => {
    const setupSocket = async () => {
      try {
        await socketService.connect();
        console.log('[ListenerLayout] Socket connected');

        // Listen for incoming requests
        socketService.on('requests:latest', (data: any) => {
          console.log('[Socket] requests:latest:', data);
          const requests = data?.requests?.map((item: any) => ({
            id: item.requestId,
            type: item.requestType === 'call' ? 'call' : 'message',
            title: item.requester?.anonymousName ?? 'Anonymous',
            requestType: item.requestType ?? null,
            requestId: item.requestId ?? null,
            venterId: item.requester?.id ?? null,
            listenerId: item.listenerId ?? null,
            ratePerMinute: item.ratePerMinute ?? null,
          }));
          dispatch(setRequests(requests));
        });
      } catch (error) {
        console.error('[ListenerLayout] Socket connection failed:', error);
      }
    };

    setupSocket();

    return () => {
      socketService.off('requests:latest');
      dispatch(clearRequests());
    };
  }, [dispatch]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Get incoming requests count from Redux store
  const requestCount = useSelector((state: RootState) => state.listener.requests.length);

  return (
    <div className="flex min-h-screen relative">
      <MainBackground />
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
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-8">
          <AppBrandIcon className="w-10 h-10 rounded-2xl shadow-glow-primary" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t('Common.appName')}</h1>
            <p className="text-xs text-gray-400">{t('Common.SupportGuide')}</p>
          </div>
        </div>

        {/* Availability Status */}
        <div className="mx-3 mb-4 glass-accent rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-success animate-pulse-soft' : 'bg-white/30'}`} />
          <span className={`text-sm font-medium ${isAvailable ? 'text-accent' : 'text-white/40'}`}>
            {isAvailable ? t('Common.Available', 'Available') : t('Common.Unavailable', 'Unavailable')}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            const isRequests = item.path === '/listener/requests';
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn('nav-link nav-link-accent', active && 'active')}
              >
                <Icon size={18} />
                <span>{t(item.labelKey)}</span>
                {isRequests && requestCount > 0 && (
                  <span className="ml-auto bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {requestCount}
                  </span>
                )}
                {active && <ChevronRight size={14} className={cn("ml-auto opacity-50", isRequests && requestCount > 0 && "hidden")} />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer (Simplified precisely to rules) */}
        <div className="px-3 pb-6 pt-4 border-t border-white/5 space-y-1">
          <button onClick={handleLogout} className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/8">
            <LogOut size={18} />
            <span>{t('Common.LogOut', 'Logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-y-auto">
        {/* Mobile top bar — hidden on desktop */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 lg:hidden"
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.35)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all"
          >
            <Menu size={18} />
          </button>
          <button
            onClick={() => navigate('/listener/notifications')}
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
