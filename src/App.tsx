import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppRouter from './router/AppRouter';
import type { RootState, AppDispatch } from './store/store';
import { BootLoader } from './components/Auth/BootLoader';

function App() {
  const { i18n } = useTranslation();
  const preferredLanguage = useSelector((state: RootState) => state.app.preferredLanguage);
  const isDarkMode = useSelector((state: RootState) => (state.app as any).isDarkMode ?? true);

  // Sync dark mode to the <html> element so CSS can react
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (preferredLanguage && i18n.language !== preferredLanguage) {
      i18n.changeLanguage(preferredLanguage).catch(() => {});
    }
  }, [preferredLanguage, i18n]);

  return (
    <div className="app-container" style={{ minHeight: '100vh', width: '100%' }}>
      <BootLoader>
        <AppRouter />
      </BootLoader>
    </div>
  )
}

export default App;
