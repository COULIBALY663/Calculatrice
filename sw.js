// sw.js
const cacheName = 'calculatrice-cache-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/icon.png'
];

// Installer le service worker et mettre en cache les fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

// Intercepter les requêtes et servir depuis le cache si disponible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
