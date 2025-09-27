const CACHE_NAME = 'action-card-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/home_image.png',
  '/public/config.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});