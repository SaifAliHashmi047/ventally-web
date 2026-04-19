import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, type Storage } from 'redux-persist';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import callReducer from './slices/callSlice';
import listenerReducer from './slices/listenerSlice';
import sessionReducer from './slices/sessionSlice';

// Create localStorage adapter for Vite compatibility
const createLocalStorage = (): Storage => {
  return {
    getItem: (key: string): Promise<string | null> => {
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key: string, value: string): Promise<void> => {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string): Promise<void> => {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

const storage = createLocalStorage();

// Persist config - persist user slice to restore role on refresh
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only persist user slice
};

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  call: callReducer,
  listener: listenerReducer,
  session: sessionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

