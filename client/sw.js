var CACHE_NAME = 'v2';

self.addEventListener('install', function(event) {

	var REQUIRED_FILES = [
		'/',
		'$JSBASENAME$.js',
		'$CSSBASENAME$.css',
		'tachyons.min.css',
		'zepto.min.js',
		'svg/edit.svg',
		'svg/delete.svg',
		'svg/offline.svg'
	];

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

self.addEventListener('activate', event => {

	event.waitUntil(caches.keys()
		.then(keys => {

			return Promise.all(deleteOldCaches());

			function deleteOldCaches(){
				return keys
					.filter(key => key !== CACHE_NAME)
					.map(key => caches.delete(key));
			}

		}));

});