import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppRouter from './router/AppRouter';
import type { RootState, AppDispatch } from './store/store';
import { initializeAuth } from './store/slices/userSlice';

function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const preferredLanguage = useSelector((state: RootState) => state.app.preferredLanguage);

  useEffect(() => {
    // Sync auth state with token existence (in case tokens were cleared manually)
    dispatch(initializeAuth());
  }, [dispatch]);

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
