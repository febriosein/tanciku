import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Register Service Worker for PWA (Android / iOS / Desktop offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Auto-update service worker if new version is waiting
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Tanciku baru tersedia. Silakan refresh.');
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('SW registration warning:', err);
      });
  });
}

// Request Persistent Storage for iOS Safari & Android
if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((isPersisted) => {
    if (isPersisted) {
      console.log('Tanciku Storage: Persistent mode enabled.');
    }
  }).catch(() => {
    // Graceful fallback if permission is denied
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
