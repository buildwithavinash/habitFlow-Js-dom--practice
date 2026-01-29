const cacheName = 'habit-v1';
const staticAssets = [
  './',
  './index.html',
  './style.css',
  './app.js'
];

// Install the service worker and cache files
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

// Serve files from cache if offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});