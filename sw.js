const CACHE_NAME = 'calc-cache-v1';
const urlsToCache = [
  '/',               // index.html
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon.png'
];

// Installation du Service Worker et mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache ouvert et fichiers ajoutés');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Active le nouveau SW immédiatement
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Prend le contrôle de tous les clients immédiatement
  console.log('[Service Worker] Activé et prêt à servir le cache');
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si le fichier est dans le cache, le retourner
        if (response) {
          return response;
        }
        // Sinon, essayer de le récupérer depuis le réseau
        return fetch(event.request)
          .then(networkResponse => {
            // Si succès réseau, ajouter au cache
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback si hors ligne et fichier non trouvé
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});