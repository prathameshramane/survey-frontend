import * as workboxRouting from 'workbox-routing';
import * as workboxStrategy from 'workbox-strategies';
import * as workboxExpiration from 'workbox-expiration';


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

// Azure Blob Storage
workboxRouting.registerRoute(
    new RegExp('https://qtsstorage.blob.core.windows.net/(.*)/(.*)'),
    new workboxStrategy.StaleWhileRevalidate({
        cacheName:'azure',
        plugins:[
            new workboxExpiration.ExpirationPlugin({
                maxEntries:30,
                maxAgeSeconds: 60 * 60 // 1hr
            })
        ]
    })
)