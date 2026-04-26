import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState, AppDispatch } from '../../store/store';
import { initializeAuth } from '../../store/slices/userSlice';
import { useAuth } from '../../api/hooks/useAuth';
import { useRoleNavigation } from '../../hooks/useRoleNavigation';
import { MainBackground } from '../ui/MainBackground';
import { AppBrandIcon } from '../ui/AppBrandIcon';

interface BootLoaderProps {
  children: React.ReactNode;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isBooting, setIsBooting] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { getProfile } = useAuth();
  const { getNextStep, navigateToNextStep } = useRoleNavigation();
  const location = useLocation();

  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const boot = async () => {
      // 1. Sync auth tokens
      const authResult = await dispatch(initializeAuth()).unwrap();
      
      if (authResult.isAuthenticated) {
        // 2. Fetch full profile if tokens exist
        try {
          const profileRes = await getProfile();
          const userData = profileRes.user;
          
          // 3. Initial navigation check
          // Only redirect if on onboarding or root or if we specifically need to go to a "Next Step"
          const currentPath = location.pathname;
          const isAuthPath = currentPath === '/' || currentPath === '/onboarding' || currentPath.startsWith('/login') || currentPath.startsWith('/signup');
          
          if (isAuthPath) {
            navigateToNextStep(userData, currentPath);
          } else {
            // Check if current path is allowed for current state
            const targetStep = getNextStep(userData, currentPath);
            if (targetStep && targetStep !== currentPath && !currentPath.startsWith(targetStep)) {
                // If user is trying to access dashboard but needs OTP/Nickname, force redirect
                if (currentPath.startsWith('/venter') || currentPath.startsWith('/listener') || currentPath.startsWith('/admin')) {
                    navigateToNextStep(userData, currentPath);
                }
            }
          }
        } catch (error) {
          console.error('[BootLoader] Profile fetch failed:', error);
        }
      }
      
      // Artificial delay for splash feel (optional, matches native 1.5s)
      setTimeout(() => {
        setIsBooting(false);
      }, 1000);
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (isBooting) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden">
        <MainBackground />
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse-soft" />
            <AppBrandIcon className="w-24 h-24 rounded-[2rem] shadow-glow-primary relative z-10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">{t('Common.appName', 'Ventally')}</h1>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
