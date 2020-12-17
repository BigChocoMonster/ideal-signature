// This file works in the worker context and thus has no DOM access

/**
 * This file has an async storage api called cache instead of synchronous
 * localstorage. But, IndexedDB is accessible.
 */

/**
 * Location of this file determines the domain for its fetch events.
 * For example, if it would have been placed inside 'youareamazing',
 * it will act only for fetch events originating from pages starting
 * with url 'youareamazing/' (like youareamazing/yeahdamnright/ or
 * youareamazing/amentothat/).
 *
 * This file, since in the root, will receive fetch events from the
 * entire application.
 */

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network
const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customizable
const OFFLINE_URL = 'offline.html';

/**
 * Optional event listener to perform certain tasks before installation
 * process completes. This is a good place to cache your files for an
 * offline experience.
 *
 */
self.addEventListener('install', (event) => {
  // Installation waits till instructions given to waitUntil are done
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Reload ensures that response is fulfilled from the network rather than HTTP cache
      return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));

      /**
       * A whole array of files can be put here to be cached with
       * cache.addAll(array_of_relative_urls) but even if 1 file fails
       * to download, the installation will break
       */
    })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

/**
 * This is fired once this worker takes control of the page. Good for
 * cache management. It is not desirable to delete caches during
 * its installation as they may still be in use by the active and older
 * version of this worker. This happens when a page using the old version
 * is still open in the browser.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(() => {
    /**
     * Allows network requests to run parallel with the worker bootup
     * so that there is no delay in the user's side.
     * See https://developers.google.com/web/updates/2017/02/navigation-preload
     */
    //
    if ('navigationPreload' in self.registration) {
      return self.registration.navigationPreload.enable();
    }
  });

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

/**
 * This is fired whenever a resource inside the worker's domain and it's
 * referenced resources are fetched. In short, this hijacks the HTTP
 * request and has the power of modifying the response as per need.
 * This can be restricted to navigation requests using event.request.mode
 * as 'navigate'
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      // Response preloaded using navigationPreload in activate listener
      const preloadedResponse = await event.preloadResponse;
      if (preloadedResponse) {
        return preloadedResponse;
      }

      // Response from the cache if there is a match
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const fetchedResponse = await fetch(event.request);
        return fetchedResponse;
      } catch (error) {
        // Fallback, in case the network is not available to make requests
        const offlineResponse = await caches.match(OFFLINE_URL);
        return offlineResponse;
      }
    })()
  );
});

/**
 * Read about service workers in detail here:
 * 1. https://developers.google.com/web/fundamentals/primers/service-workers#what_is_a_service_worker
 * 2. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 */
