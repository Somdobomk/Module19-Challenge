const APP_PREFIX = 'FoodEvent-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;
const urlsToCache = [
  '/',
  './index.html',
  './css/styles.css',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './js/idb.js',
  './js/index.js',
];

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        console.log("fetch request found in cache : " + e.request.url);
        return response;
      }
      console.log("fetch request not found in cache : " + e.request.url);
      return fetch(e.request);
    })
  );
});

// Cache resources
self.addEventListener("install", function (e) {
  console.log("install event");
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("cache opened");
      return cache.addAll(urlsToCache);
    })
  );
}
);

// Delete outdated caches
self.addEventListener("activate", function (e) {
  console.log("activate event");
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            console.log("ServiceWorker: cache " + key + " deleted");
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
}
);