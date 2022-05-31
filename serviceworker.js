// const cacheArr = ['/', '/css/*']
const cacheArr = ['/']
const Cache_name = 'cache-v10'
self.addEventListener('install', (event) => {
    console.log('worker is intsall')
    // event.waitUntil(
    //     caches.open(Cache_name).then((cache) => {
    //         console.log('opened cache');
    //         cache.addAll(cacheArr).then(() => self.skipWaiting())
    //     })
    // )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cachenames) => {
            return Promise.all(
                cachenames.map((cacheName) => {
                    if (Cache_name != cacheName) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             if (response) {
//                 return response;
//             }
//             return fetch(event.request)
//         }).catch(() => {
//             caches.match(event.request);
//         })
//     )
// });

self.addEventListener('fetch', (fetchEvent) => {
    fetchEvent.respondWith(
        fetch(fetchEvent.request).then((res) => {
            const cachesRes = res.clone();
            caches.open(Cache_name).
                then(cache => cache.put(fetchEvent.request, cachesRes))
            return res;
        }).catch(() => caches.match(fetchEvent.request).then(res => res))
    );
})