import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';
import apiInstance from '../apiInstance';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export const useWebNotifications = () => {
  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Require secure context — messaging is null on plain HTTP (LAN IPs in dev)
      if (!messaging) {
        console.log('[Notifications] Skipped — not a secure context or Firebase unavailable.');
        return;
      }

      // Skip if VAPID key is not configured
      if (!VAPID_KEY) {
        console.log('[Notifications] VAPID_KEY not configured - push notifications disabled');
        return;
      }

      console.log('[Notifications] Initializing...');

      if (!('serviceWorker' in navigator)) {
        console.log('⚠️  Service Workers not supported');
        return;
      }

      if (!('Notification' in window)) {
        console.log('⚠️  Notifications not supported in this browser');
        return;
      }

      const permission = Notification.permission;
      console.log('[Notifications] Current permission:', permission);

      if (permission === 'granted') {
        await registerServiceWorker();
        // Add delay to ensure Service Worker is fully activated
        await new Promise(resolve => setTimeout(resolve, 1000));
        await getFcmToken();
        listenToForegroundMessages();
      } else if (permission === 'default') {
        const result = await Notification.requestPermission();
        console.log('[Notifications] Permission request result:', result);

        if (result === 'granted') {
          await registerServiceWorker();
          // Add delay to ensure Service Worker is fully activated
          await new Promise(resolve => setTimeout(resolve, 1000));
          await getFcmToken();
          listenToForegroundMessages();
        }
      } else {
        console.log('⚠️  Notification permission denied');
      }
    } catch (error) {
      console.error('[Notifications] Error initializing:', error);
    }
  };

  const registerServiceWorker = async () => {
    try {
      console.log('[Service Worker] Registering...');
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/' }
      );
      console.log('✅ Service Worker registered');

      // Wait for Service Worker to be active
      if (registration.active) {
        console.log('✅ Service Worker is already active');
      } else if (registration.waiting) {
        console.log('⏳ Service Worker waiting to activate');
        await new Promise(resolve => {
          registration.addEventListener('activate', () => resolve(null));
        });
      } else if (registration.installing) {
        console.log('⏳ Service Worker installing');
        await new Promise(resolve => {
          registration.installing?.addEventListener('activate', () => resolve(null));
        });
      }
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      throw error;
    }
  };

  const getFcmToken = async () => {
    try {
      console.log('[FCM] Getting token...');
      console.log('[FCM] VAPID_KEY length:', VAPID_KEY?.length || 0);
      console.log('[FCM] VAPID_KEY first 20 chars:', VAPID_KEY?.substring(0, 20));

      if (!VAPID_KEY) {
        console.error('❌ VAPID_KEY is not set. Please add VITE_FIREBASE_VAPID_KEY to .env.local');
        return;
      }

      if (VAPID_KEY.length < 80) {
        console.error('❌ VAPID_KEY appears to be too short. Expected 80+ characters, got:', VAPID_KEY.length);
        console.error('❌ Make sure you copied the complete public key from Firebase Console');
        return;
      }

      // Get Service Worker registration
      const registration = await navigator.serviceWorker.ready;
      console.log('[FCM] Service Worker ready, attempting to get token...');

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        localStorage.setItem('fcmToken', token);
        console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...');

        // Register token with backend
        const response = await apiInstance.post('notifications/register', {
          token,
          device_type: 'web',
          device_info: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
          }
        });

        console.log('✅ FCM token registered with backend');
      } else {
        console.error('❌ No FCM token returned');
      }
    } catch (error: any) {
      console.error('[FCM] Full error details:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });

      if (error?.code === 'messaging/unsupported-browser') {
        console.error('⚠️  Browser does not support web notifications');
      } else if (error?.code === 'messaging/failed-service-worker-registration') {
        console.error('⚠️  Service Worker registration failed');
      } else if (error?.message?.includes('applicationServerKey')) {
        console.error('⚠️  VAPID key may be invalid or doesn\'t match Firebase project');
      } else {
        console.error('⚠️  Push service error - check if VAPID key matches your Firebase project');
      }
    }
  };

  const listenToForegroundMessages = () => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log('📬 Foreground FCM Message:', payload);

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(
            payload.notification?.title || 'Notification',
            {
              body: payload.notification?.body || '',
              icon: '/logo.png',
              badge: '/logo.png',
              tag: 'ventally-notification',
              data: payload.data || {}
            }
          );
        });
      }
    });
  }
};

export default useWebNotifications;
