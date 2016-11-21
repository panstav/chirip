var CACHE_NAME = 'v1';

// Files required to make this app work offline
var REQUIRED_FILES = [
	'/',
	'$JSBASENAME$.js',
	'$CSSBASENAME$.css',
	'tachyons.min.css',
	'zepto.min.js',
	'svg/edit.svg',
	'svg/delete.svg'
];

self.addEventListener('install', function(event) {

	var addOfflineDependencies = caches.open(CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(REQUIRED_FILES);
		});

	event.waitUntil(addOfflineDependencies);

});

self.addEventListener('fetch', function(event) {

	var cachedVersion = caches.match(event.request)
		.then(function(response){
			if (response) return response;
			console.log(`falling back to requesting`, event.request);
			return fetch(event.request);
		});

	event.respondWith(cachedVersion);

});