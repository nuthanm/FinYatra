// Development service worker — network only, no offline cache.
// Stale published SW caches can break Blazor _framework integrity checks after rebuilds.
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
    // Intentionally empty: let the browser fetch from the network.
});
