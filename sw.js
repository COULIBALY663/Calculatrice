const CACHE_NAME = 'calc-cache-v1';
const urlsToCache = [
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon.png'
];

// Installer et mettre en cache tous les fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activer et nettoyer les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Intercepter toutes les requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si présent dans le cache, retourne
        if(response) return response;

        // Sinon, essaye de fetcher
        return fetch(event.request)
          .catch(() => {
            // Si navigation (ouvrir la page) et offline, retourne index.html
            if(event.request.mode === 'navigate' || 
               (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
              return caches.match('/index.html');
            }
          });
      })
  );
});
