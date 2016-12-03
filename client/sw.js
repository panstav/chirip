const CACHE_NAME = 'v3';

self.addEventListener('install', event => {

		event.waitUntil(addOfflineDependencies());

		function addOfflineDependencies(){

			const REQUIRED_FILES = [
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
				.then(cache => cache.addAll(REQUIRED_FILES));

		}

	});

self.addEventListener('activate', event => {

	event.waitUntil(oldCachesDeleted());

	function oldCachesDeleted(){

		return caches.keys()
			.then(keys => keys.filter(key => key !== CACHE_NAME))
			.then(keys => Promise.all(keys.map(key => caches.delete(key))));

	}

});

self.addEventListener('fetch', event => {

	event.respondWith(cacheThenNetwork());

	function cacheThenNetwork(){

		return caches.match(event.request)
			.then(response => {
				if (response) return response;
				return fetch(event.request);
			});

	}

});