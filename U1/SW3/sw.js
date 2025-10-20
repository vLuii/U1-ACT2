self.addEventListener('install', event => {
    self.skeepWaiting();
    event.waitUntil(
        caches.open('v3')
        .then(cache => {
            cache.addAll([
                './meow.jpg',
                './script.js',
                './',
                './scramble.txt'
            ]);
            console.log("Assets cached.");
      })
      .catch(err => console.log("Could not cache."))
    )
});

self.addEventListener('fetch', event => {
    console.log("INTERCEPTED");

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log("V3 The request: ", event.request);
                console.log("V3 Got the response...", response);

                //PUEDE HABER VARIAS FORMAS DE RESPONDER AQUÍ ASI QUE CONSIDERE ESTOS EJEMPLOS:

                /* EJEMPLO 1 EL MAS FACIL FUNCIONALMENTE */
                return response || fetch(event.request);

                /* EJEMPLO 3 SI GUSTA MODIFICAR LA IMAGEN*/
                /*
                if (event.request.url.includes('meow.png')) {
                    return fetch('https://picsum.photos/800')
                        .then(res => {
                            return caches.open('v3')
                                .then(cache => {
                                    cache.put(event.request, res.clone());
                                    return res;
                                })
                        })
                        .catch(err => response || fetch(event.request));
                } else {
                    return response || fetch(event.request);
                }
                */
            })
            .catch(err => {
                console.log("Could not find matching request.");
                return new Response("Service Worker Error", {
                    status: 500,
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.map(key => {
                        if (key !== 'v3') return caches.delete(key);
                    })
                );
            })
        );


    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            console.log("V3 The request: ", event.request);
            console.log("V3 Got the response... ", response);

        })
            .catch(err => {
                console.log("Could not find matching request.");
                return null;
        })
    );
});

self.addEventListener("activate ", event => {
    event.waitUntil(
        caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key === 'v3') caches.delete(key);
            });
        })
    );
});