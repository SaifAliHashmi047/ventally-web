import { initializeApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDn0F3nAFjEgJPHgf11nshfUB6CNlZS744',
  authDomain: 'ventally.firebaseapp.com',
  projectId: 'ventally',
  storageBucket: 'ventally.firebasestorage.app',
  messagingSenderId: '881570925381',
  appId: '1:881570925381:web:ef0e83c98432d40706cc2c',
  measurementId: 'G-3VKVBRLZR9'
};

const app = initializeApp(firebaseConfig);

// Firebase Messaging requires a secure context (HTTPS or localhost).
// Initialize lazily so the app doesn't crash when accessed over plain HTTP (e.g. LAN IPs in dev).
let _messaging: Messaging | null = null;

export const getMessagingInstance = (): Messaging | null => {
  if (_messaging) return _messaging;
  const isSecure =
    window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  if (!isSecure) {
    console.warn('[Firebase] Messaging disabled — not a secure context (requires HTTPS or localhost).');
    return null;
  }
  try {
    _messaging = getMessaging(app);
    return _messaging;
  } catch (e) {
    console.warn('[Firebase] getMessaging() failed:', e);
    return null;
  }
};

// Legacy named export for files that still import `messaging` directly.
// Will be null on non-secure contexts — use getMessagingInstance() for new code.
export const messaging = (() => {
  try {
    const isSecure =
      typeof window !== 'undefined' &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    if (!isSecure) return null;
    return getMessaging(app);
  } catch {
    return null;
  }
})() as Messaging;

export default app;
