// Cache assets
const cacheName = 'project-tracker-cache';
const assetsToCache = ['index.html', 'index.css', 'index.js', 'icon.png'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => cache.addAll(assetsToCache))
			.then(() => self.skipWaiting()),
	);
});

// Fetch assets from cache
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => response || fetch(event.request)),
	);
});

// Update cache when new version is available
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames.map((cacheName) => caches.delete(cacheName)),
				),
			)
			.then(() => self.clients.claim()),
	);
});
