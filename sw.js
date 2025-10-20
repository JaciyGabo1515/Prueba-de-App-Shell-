// Service Worker - sw.js
// Versión del caché
const CACHE_VERSION = 'v1';
const CACHE_NAME = `app-shell-${CACHE_VERSION}`;

// Archivos del App Shell para cachear
const APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    // Imágenes de productos
    '/images/pixel.png',
    '/images/audifonos.png',
    '/images/laptop.png',
    '/images/camara.png',
    '/images/tablet.png',
    '/images/smartwatch.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando App Shell y recursos');
                return cache.addAll(APP_SHELL_FILES);
            })
            .then(() => {
                console.log('[SW] App Shell cacheado exitosamente');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch((error) => {
                console.error('[SW] Error al cachear App Shell:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar cachés antiguos
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activado');
                return self.clients.claim(); // Tomar control de todas las páginas
            })
    );
});

// Interceptar peticiones (fetch)
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Estrategia: Cache First, falling back to Network
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Sirviendo desde caché:', request.url);
                    return cachedResponse;
                }
                
                // Si no está en caché, hacer petición a la red
                console.log('[SW] Obteniendo de la red:', request.url);
                return fetch(request)
                    .then((networkResponse) => {
                        // Cachear la nueva respuesta para uso futuro
                        if (request.method === 'GET' && networkResponse.status === 200) {
                            return caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, networkResponse.clone());
                                    return networkResponse;
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[SW] Error en fetch:', error);
                        
                        // Página offline personalizada
                        return new Response('Sin conexión. Por favor, verifica tu conexión a internet.', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Sincronización en segundo plano (opcional)
self.addEventListener('sync', (event) => {
    console.log('[SW] Sincronización en segundo plano:', event.tag);
    
    if (event.tag === 'sync-products') {
        event.waitUntil(
            fetch('/api/products')
                .then(response => response.json())
                .then(data => {
                    console.log('[SW] Datos sincronizados:', data);
                })
                .catch(err => {
                    console.error('[SW] Error en sincronización:', err);
                })
        );
    }
});

// Notificaciones Push (opcional)
self.addEventListener('push', (event) => {
    console.log('[SW] Push recibido:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación',
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Mi Tienda PWA', options)
    );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Clic en notificación:', event);
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});