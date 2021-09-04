const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.html",
  "/assets/js/index.js",
  "/assets/css/styles.css",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  // cache all get requests to /api routes
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(FILES_TO_CACHE).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );
});
