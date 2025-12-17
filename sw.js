const CACHE_NAME = 'calc-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon.png'   // si tu as une icône pour ton PWA
];

// Installation du Service Worker et mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // force l’activation du nouveau SW
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activé');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // prend le contrôle immédiatement
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(() => {
            // fallback si offline et fichier non en cache
            if(event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
