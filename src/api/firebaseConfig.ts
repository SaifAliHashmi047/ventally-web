import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

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
export const messaging = getMessaging(app);

export default app;
