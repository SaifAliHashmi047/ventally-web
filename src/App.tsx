import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppRouter from './router/AppRouter';
import type { RootState } from './store/store';

function App() {
  const { i18n } = useTranslation();
  const preferredLanguage = useSelector((state: RootState) => state.app.preferredLanguage);

  useEffect(() => {
    if (preferredLanguage && i18n.language !== preferredLanguage) {
      i18n.changeLanguage(preferredLanguage).catch(() => {});
    }
  }, [preferredLanguage, i18n]);

  return (
    <div className="app-container" style={{ minHeight: '100vh', width: '100%' }}>
      <AppRouter />
    </div>
  )
}

export default App;
