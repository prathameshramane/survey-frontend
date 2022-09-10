importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Verbose logging even for the production
workbox.setConfig({ debug: true });
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// Modify SW update cycle
self.skipWaiting();
workbox.core.clientsClaim();

// We inject manifest here using "workbox-build" in workbox-build-inject.js
workbox.precaching.precacheAndRoute(injectionPoint);

// Runtime caching
workbox.routing.registerRoute(
  new RegExp('https://jsonplaceholder.typicode.com/(.*)'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'jsonplaceholder',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 // 1hr
      })
    ]
  })
);

// Background Sync
workbox.routing.registerRoute(
   new RegExp('https://jsonplaceholder.typicode.com/(.*)'),
   new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('postQueue', {
        maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
      })
    ]
  }),
  'POST'
);