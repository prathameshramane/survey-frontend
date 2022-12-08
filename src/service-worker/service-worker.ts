import * as workboxCore from 'workbox-core';
import * as workboxPrecaching from 'workbox-precaching';

import './src/runtime-caching';
// import './src/background-sync';
import './src/workbox-queue';

declare const self: ServiceWorkerGlobalScope;

// Modify SW update cycle
workboxCore.clientsClaim();
workboxCore.skipWaiting();

// Precaching
workboxPrecaching.precacheAndRoute(self.__WB_MANIFEST);


