importScripts('js/sw-utilities.js');

const CACHE_STATIC = 'static-V1'; 
const CACHE_DYNAMIC = 'dynamic'; 
const CACHE_INMUTABLE = 'inmutable';

const APP_SHELL = [
    '/',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHEL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    /* 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css', */
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open(CACHE_STATIC).then(res => res.addAll(APP_SHELL));
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(res => res.addAll(APP_SHEL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const eliminar = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(eliminar);
});

self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if (res) {
            return res;
        }else{
            return fetch(e.request).then(newRes => {
                return actualizarCacheDinamico(CACHE_DYNAMIC, e.request, newRes);
            });
        }
    });
    e.respondWith(respuesta);
});