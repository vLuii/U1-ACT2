let resgistration = null;

function register_service_worker() {
    if ('serviceWorker' in navigator) {
        window.navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(res => {
            registation = res;
            console.log("Service Worker Successfully Registered.");
        })
        .catch(err => {
            console.log("Could not register service worker.");
        });
    }
}

function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations().
    then(registration => {
        registrarion.forEach(registration => {
            registration.unregister();
            console.log("Service Worker Unregistered.");
        });
    })
    .catch(err => {
        console.log("Could not unregister service worker.");
    });
}

window.addEventListener('click', () => {
    fetch('./meow.jpg')
    .then(res => console.log("From srcipt.js: ", res));
}); 
register_service_worker();
//unregister_service_worker();
