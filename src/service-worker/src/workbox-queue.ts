import { Queue } from 'workbox-background-sync';

const bgSyncQueue = new Queue('my-custom-queue', {
  onSync: async ({ queue }) => {
    // await queue.replayRequests();
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.info('Replay successful for request', entry.request);
        console.log('====================================');
        console.log((await queue.getAll()).length);
        console.log('====================================');
        await raiseSyncUpdatedEvent();
      } catch (error) {
        console.error('Replay failed for request', entry.request, error);

        // Put the entry back in the queue and re-throw the error:
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
    console.log('Replay complete!');
  },
});

const raiseSyncUpdatedEvent = async () => {
  const EVENT_NAME = 'sync-updated';
  const currentCount = (await bgSyncQueue.getAll()).length;
  console.log('Current count: ', currentCount);

  //   const syncUpdatedEvent = new CustomEvent(EVENT_NAME, {
  //     detail: { currentCount: currentCount },
  //   });
  //   console.log('Dispatching Event: ', syncUpdatedEvent);
  //   navigator.serviceWorker.dispatchEvent(syncUpdatedEvent);

  const channel = new BroadcastChannel('sync-updated');
  console.log('Posting Message: ', channel);
  channel.postMessage({ currentCount: currentCount });
};

const addRequestToQueue = async (request) => {
  console.log('Adding request to background sync queue!');
  request.headers['Authorization'] = 'Bearer <Token>';
  console.log('Set authorization to token', request);
  request.headers['Authorization'] = 'Bearer <UPDATED_Token>';
  console.log('Updated authorization token', request);
  await bgSyncQueue.pushRequest({
    request: request,
    timestamp: new Date().getTime(),
    metadata: { isCustom: 'YES' },
  });
  await raiseSyncUpdatedEvent();
};

self.addEventListener('fetch', (event: any) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  console.log('Inside fetch handler!');
  if (event.request.method !== 'POST') {
    return;
  }

  const bgSyncLogic = async () => {
    console.log('Network status: ', navigator.onLine);
    if (navigator.onLine) {
      console.log('Awaiting for fetch!');
      const response = await fetch(event.request.clone());
      console.log('Sending reseponse', response);
      return response;
    } else {
      console.log('Adding request to queue');
      await addRequestToQueue(event.request);
      console.log('Added to queue and returning false!');
      return new Response();
    }
  };

  event.respondWith(bgSyncLogic());
});
