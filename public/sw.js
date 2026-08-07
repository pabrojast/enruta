/* ENRUTA service worker — shell offline básico */
const CACHE = "enruta-shell-v1";
const PRECACHE = ["/", "/login", "/manifest.webmanifest", "/brand/enruta-logo.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Network-first for app data; cache-first for shell/static
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname === "/" ||
    url.pathname === "/login" ||
    url.pathname.endsWith(".webmanifest")
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetched = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || fetched;
      }),
    );
  }
});
