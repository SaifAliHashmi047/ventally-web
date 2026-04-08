import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import callReducer from './slices/callSlice';
import listenerReducer from './slices/listenerSlice';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    call: callReducer,
    listener: listenerReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

