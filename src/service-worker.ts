import * as workboxCore from 'workbox-core';
import * as workboxPrecaching from 'workbox-precaching';
import * as workboxRouting from 'workbox-routing';
import * as workboxStrategy from 'workbox-strategies';
import * as workboxExpiration from 'workbox-expiration';
import * as workboxBackgroundSync from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Modify SW update cycle
workboxCore.clientsClaim();
workboxCore.skipWaiting();

workboxPrecaching.precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching
workboxRouting.registerRoute(
    new RegExp('https://jsonplaceholder.typicode.com/(.*)'),
    new workboxStrategy.StaleWhileRevalidate({
        cacheName:'jsonplaceholder',
        plugins:[
            new workboxExpiration.ExpirationPlugin({
                maxEntries:30,
                maxAgeSeconds: 60 * 60 // 1hr
            })
        ]
    })
)

// Background Sync
workboxRouting.registerRoute(
    new RegExp('https://jsonplaceholder.typicode.com/(.*)'),
    new workboxStrategy.NetworkOnly({
        plugins:[
            new workboxBackgroundSync.BackgroundSyncPlugin('jsonQueue', {
                maxRetentionTime: 24 * 60 // Retry max of 24hrs
            })
        ]
    }),
    'POST'
)