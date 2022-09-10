importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Verbose logging even for the production
workbox.setConfig({ debug: true });
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// // Modify SW update cycle
self.skipWaiting(); // Skip Waiting 
// workbox.clientsClaim();

// We inject manifest here using "workbox-build" in workbox-build-inject.js
workbox.precaching.precacheAndRoute(injectionPoint)