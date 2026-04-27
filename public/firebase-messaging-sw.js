importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDn0F3nAFjEgJPHgf11nshfUB6CNlZS744",
  authDomain: "ventally.firebaseapp.com",
  projectId: "ventally",
  storageBucket: "ventally.firebasestorage.app",
  messagingSenderId: "881570925381",
  appId: "1:881570925381:web:ef0e83c98432d40706cc2c",
  measurementId: "G-3VKVBRLZR9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Background FCM Message:', payload);

  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'ventally-notification',
    requireInteraction: false,
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Navigate to notification URL if provided
  const notificationData = event.notification.data;
  if (notificationData?.link) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === notificationData.link && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(notificationData.link);
        }
      })
    );
  }
});
