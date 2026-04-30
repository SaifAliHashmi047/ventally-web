import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate, type Storage } from 'redux-persist';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import callReducer, { type CallState } from './slices/callSlice';
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

// ── Migrations ──────────────────────────────────────────────────────────────
// Bump PERSIST_VERSION whenever a breaking state shape change ships.
// Each migration receives the previous version's state and must return the new shape.
// Version 1 → 2: added 'call' to whitelist; wipe any stale active-session flags
//               so users don't see a phantom status bar on first load after update.
const PERSIST_VERSION = 2;

const migrations: Record<number, (state: any) => any> = {
  2: (state) => ({
    ...state,
    call: {
      ...(state.call ?? {}),
      isActive: false,
      isConnecting: false,
      isChatActive: false,
      startTime: null,
      chatStartTime: null,
    } satisfies Partial<CallState>,
  }),
};

const persistConfig = {
  key: 'root',
  version: PERSIST_VERSION,
  storage,
  whitelist: ['user', 'app', 'call'],
  migrate: createMigrate(migrations, { debug: false }),
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

