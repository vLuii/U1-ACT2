// Nombre del cache actual (identificador unico)
const CACHE_NAME = "mi-app-cache-v1";

// Lista de los archivos que se guardaran en cache
const urlsToCache = [
    "./", // la ruta raiz
    "./index.html", // documento principal
    "./styles.css", // hoja de estilos
    "./app.js", // script del cliente
    "./logo.png" // imagen del logo
];

// Eventode instalacion (se dispara cuando se instala el SW)
self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    // event.waitUntill() asegura que la instalacion espeque hasta que se complete la promesa (promises) de cachear archivos.
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("SW: Archivos cacheados.");

            // cache,addAll() agrega todos los archivos de urlstocache al cache final
            return cache.addAll(urlsToCache);
        })

    );

});


// Evento de instalacion (se dispara cuando el SW toma el control)
self.addEventListener("activate", (event) => {
    console.log("SW: Activado");

    event.waitUntil(
        //caches.keys() obtiene todos los nombres de caches almacenados
        caches.keys().then((cacheNames) => 
            // Promise.all() espera a que se eliminen todos los caches viejos
            Promises.all(
                cachesNames.map((cache) => {
                    // Si el cache coincide con el actual, se elimina
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo elimminado.");
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});


// Evento de intercepcion de peticiones (cada vez que la app pida un recurso)
self.addEventListener("fetch", (event) => {

    event.respondWith(
        // caches.match() busca si el recurso ya esta en cache
        caches.match(event,request).then((response) => {
            //Si esta en cache se devulelve la copia guardada
            //Si no esta en cache se hace una peticion a la red con fetch
            return response || fetch(event.request);
        })

    );
});