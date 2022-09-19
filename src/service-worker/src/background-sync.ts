import * as workboxRouting from 'workbox-routing';
import * as workboxStrategy from 'workbox-strategies';
import * as workboxBackgroundSync from 'workbox-background-sync';

import constants from '../../app/constants';

// Background Sync
workboxRouting.registerRoute(
    new RegExp(`${constants.BACKEND_URL}/surveys/`),
    new workboxStrategy.NetworkOnly({
        plugins:[
            new workboxBackgroundSync.BackgroundSyncPlugin('jsonQueue', {
                maxRetentionTime: 24 * 60 // Retry max of 24hrs
            })
        ]
    }),
    'POST'
)