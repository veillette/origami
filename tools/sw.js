const files = /* BUILD_FILES */ [];
const scope = self.registration.scope;
const cachePrefix = `offline-site:${scope}:`;
const cacheName = `${cachePrefix}__BUILD_VERSION__`;
const urls = new Set(files.map((file) => new URL(file, scope).href));
const index = new URL('index.html', scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    return cache.addAll([...urls].map((url) => new Request(url, { cache: 'reload' })));
  }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(cachePrefix) && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const home = url.origin === self.location.origin
    && (url.pathname === new URL(scope).pathname || url.pathname === new URL(index).pathname);
  const key = request.mode === 'navigate' && home ? index : url.href;
  if (!urls.has(key)) return;

  // Keep the active app and its files on the same revision until the next worker takes over.
  event.respondWith(caches.open(cacheName).then(async (cache) => {
    return (await cache.match(key)) ?? fetch(request);
  }));
});
