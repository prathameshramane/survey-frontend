import * as workboxRouting from 'workbox-routing';
import * as workboxStrategy from 'workbox-strategies';
import * as workboxExpiration from 'workbox-expiration';

import constants from '../../app/constants';


// Runtime caching
workboxRouting.registerRoute(
    new RegExp(`${constants.BACKEND_URL}/surveys/`),
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