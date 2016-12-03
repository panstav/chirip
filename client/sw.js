var CACHE_NAME = 'v2';

self.addEventListener('install', function(event) {

	event.waitUntil(addOfflineDependencies());

	function addOfflineDependencies(){

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

		return caches.open(CACHE_NAME)
			.then(function(cache) {
				return cache.addAll(REQUIRED_FILES);
			});

	}

});

self.addEventListener('activate', event => {

	event.waitUntil(oldCachesDeleted());

	function oldCachesDeleted(){

		return caches.keys()
			.then(function(keys){
				return Promise.all(deleteOldCaches(keys));
			});

		function deleteOldCaches(keys){

			return keys
				.filter(key => key !== CACHE_NAME)
				.map(key => caches.delete(key));

		}

	}

});

self.addEventListener('fetch', function(event) {

	event.respondWith(cacheThenNetwork());

	function cacheThenNetwork(){

		return caches.match(event.request)
			.then(function(response){
				if (response) return response;
				return fetch(event.request);
			});

	}

});