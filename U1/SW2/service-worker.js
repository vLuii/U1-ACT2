//Nombre del cache
const cacheName = "mi-cache-v2";

//Archivos que se guardan en cache
const cacheAssets = [
    'index.html',
    'pagina1.html',
    'pagina2.html',
    'offline.html',
    'styles.css',
    'main.js',
    'logo.png'
];

//Instalacion del SW    
self.addEventListener('install', (event) => {
    console.log('SW: Instalado');
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('SW: Cacheando archivos');
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.log('SW: Error al cachear', err))
    );
});

//Activacion del SW
self.addEventListener('activate', (event) => {
    console.log('SW: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log(`SW: elimiando cache antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

//Escuchar mensajes desde la pagina
self.addEventListener('message', (event) => {
    console.log('SW: Mensaje recibido', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificacion Local.', {
            body: 'Esta es una prueba de notificacion sin server push.',
            icon: 'logo.png'
        });
    }
});

//Manejar peticiones de red con fallback a offline
self.addEventListener('fetch', (event) => {
    //Ignorar peticiones innecesarias como extensiones o favicon
    if (
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('favicon.ico')
    ) {
        return;
    }
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                //Si la respuesta es correcta, devolverla y la guardamos en cache
                constclone = response.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => {
                //Si la peticion falla, buscar en cache
                return caches.match(event.request).then((response) => {
                    if (response) {
                        console.log('SW: Recurso desde la cache', event.request.url);
                        return response;
                    }else {
                        console.warn('SW: Recurso no encontrado en cache, mostrando offline.html');
                        return caches.match('offline.html');
                    }
                });
            })
    );
});
        