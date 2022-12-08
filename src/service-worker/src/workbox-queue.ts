import { Queue } from 'workbox-background-sync';

const bgSyncQueue = new Queue('my-custom-queue', {
    onSync: async ({ queue }) => {
        await queue.replayRequests();
        let entry;
        while (entry = await queue.shiftRequest()) {
            try {
                await fetch(entry.request);
                console.info('Replay successful for request', entry.request);
                console.log('====================================');
                console.log((await queue.getAll()).length);
                console.log('====================================');
            } catch (error) {
                console.error('Replay failed for request', entry.request, error);

                // Put the entry back in the queue and re-throw the error:
                await queue.unshiftRequest(entry);
                throw error;
            }
        }
        console.log('Replay complete!');
    }
});

const addRequestToQueue = (url, body) => {
    console.info("Adding request to background sync queue!");
    const request = new Request(url, { method: 'POST', body: body })
    request.headers.append('Authorization', 'Bearer <Token>');
    request.headers.set('Authorization', 'Bearer <UPDATED_Token>')
    bgSyncQueue.pushRequest({ request: request, timestamp: new Date().getTime(), metadata: { 'isCustom': 'YES' } })
}


self.addEventListener('fetch', (event:any) => {
    // Add in your own criteria here to return early if this
    // isn't a request that should use background sync.
    if (event.request.method !== 'POST') {
        return;
    }

    const bgSyncLogic = async () => {
        try {
            const response = await fetch(event.request.clone());
            return response;
        } catch (error) {
            await bgSyncQueue.pushRequest({ request: event.request });
            return error;
        }
    };

    event.respondWith(bgSyncLogic());
});