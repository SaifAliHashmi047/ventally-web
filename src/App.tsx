import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppRouter from './router/AppRouter';
import type { RootState, AppDispatch } from './store/store';
import { BootLoader } from './components/Auth/BootLoader';
import { AgoraProvider } from './contexts/AgoraContext';
import { logout } from './store/slices/userSlice';

function App() {
  const { i18n } = useTranslation();
  const preferredLanguage = useSelector((state: RootState) => state.app.preferredLanguage);
  const isDarkMode = useSelector((state: RootState) => (state.app as any).isDarkMode ?? true);
const dispatch = useDispatch()
  // Sync dark mode to the <html> element so CSS can react
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (preferredLanguage && i18n.language !== preferredLanguage) {
      i18n.changeLanguage(preferredLanguage).catch(() => {});
    }
  }, [preferredLanguage, i18n]);

  // Handle token refresh failure: clear Redux state and redirect to login
  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout() as any);
      window.location.replace('/login');
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [dispatch]);

  return (
    <div className="app-container" style={{ minHeight: '100vh', width: '100%' }}>
      <AgoraProvider>
        <BootLoader>
          <AppRouter />
        </BootLoader>
      </AgoraProvider>
    </div>
  )
}

export default App;
