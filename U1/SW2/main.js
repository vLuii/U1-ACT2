// registrar Service Worker
if ("serviceworker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then((reg) => console.log("Service Worker registrado:", reg))
    .catch((err) => console.log("Error al registrar el Service Worker: ", err));
}

// Boton para verificar el estado de SW
document.getElementById("check").addEventListener("click", ()=> {
    if (navigator.serviceWorker.controller) {
        alert("El Service Worker esta activo y controlando esta pagina.");
    } else {
        alert("El service worker aun no esta activo.");
    }

})

// Solicitar permiso de notificacion
if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
            console.log("Permmiso de notifacion concedido.");
        } else {
            console.log("Permiso de notificacion denegado.");
        }
    });
}

// Boton para lanzar la notificacion local
document.getElementById("btnNotificacion").addEventListener("click", ()=> {
    if(navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("mostrar-notificacion");
    } else {
        console.log("El SW no esta activo aun.");
    }
})