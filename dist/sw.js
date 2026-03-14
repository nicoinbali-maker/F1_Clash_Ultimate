const CACHE_NAME = 'f1-clash-ultimate-v37';
const ASSETS = [
  '/',
  '/i18n.js',
  '/index.html',
  '/garage.html',
  '/fahrerlager.html',
  '/optimizer.html',
  '/optimizer-lite.js',
  '/track-selection.html',
  '/sync.html',
  '/team.html',
  '/leaderboard.html',
  '/personal.html',
  '/style.css',
  '/script.js',
  '/advanced.js',
  '/manifest.json',
  '/registration.html',
  '/hall-of-fame.html',
  '/hallOfFame.js',
  '/assets/ferrari2000_candyred_192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
