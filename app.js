// --- REGISTRO DEL SERVICE WORKER ---

/**
 * Registra el Service Worker para habilitar funcionalidad offline
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado exitosamente:', registration.scope);
            })
            .catch(error => {
                console.error('❌ Error al registrar Service Worker:', error);
            });
    });
}

// --- MANEJO DEL MENÚ MÓVIL ---

/**
 * Alterna la visibilidad del menú de navegación en móviles.
 */
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active'); // Añade o quita la clase .active
}

// --- MANEJO DE LA CARGA DE CONTENIDO Y ESTADO ACTIVO ---

// Obtenemos todos los enlaces de navegación
const navLinks = document.querySelectorAll('.nav-content a');

/**
 * Carga contenido (simulado) y actualiza el enlace activo.
 * @param {string} contentName - El nombre de la sección a cargar.
 * @param {Event} event - El evento de clic.
 */
function loadContent(contentName, event) {
    // 1. Prevenir el comportamiento por defecto del enlace
    if (event) {
        event.preventDefault();
    }

    // 2. Quitar la clase 'active' de TODOS los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // 3. Añadir la clase 'active' solo al enlace clickeado
    // (Buscamos el enlace que tiene el onclick que coincide)
    const activeLink = Array.from(navLinks).find(
        link => link.getAttribute('onclick').includes(`'${contentName}'`)
    );
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // 4. Lógica para cargar el contenido (aquí iría tu fetch, etc.)
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando ${contentName}...</p>
        </div>
    `;

    // Simular una carga de red
    setTimeout(() => {
        // Aquí reemplazarías esto con el contenido real
        mainContent.innerHTML = `<h1>Contenido de ${contentName}</h1><p>Aquí se mostraría la sección de ${contentName}.</p>`;
        
        // Si cargas 'productos', vuelves a pintar tu grid de productos
        if (contentName === 'productos') {
             mainContent.innerHTML = '<h1>Nuestros Productos</h1>' + createProductGrid();
        }

    }, 1000); // Simula 1 segundo de carga

    // 5. (Opcional) Cerrar el menú móvil si está abierto
    const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

/**
 * Función para generar el grid de productos.
 */
function createProductGrid() {
    // 📦 Aquí está tu nuevo catálogo de 6 productos
    const products = [
        { 
            title: 'Smartphone Pixel Pro', 
            desc: 'El teléfono más inteligente, con la cámara más avanzada de Google y una batería que dura todo el día.', 
            price: '$18,999.00',
            imagen: 'images/pixel.png'
        },
        { 
            title: 'Audífonos Skullcandy', 
            desc: 'Sumérgete en el sonido con bajos potentes y un diseño supraaural cómodo para largas sesiones.', 
            price: '$1,499.00',
            imagen: 'images/audifonos.png'
        },
        { 
            title: 'Laptop Gaming ROG 2-en-1', 
            desc: 'Potencia extrema en un formato versátil. Juega o crea donde sea con esta laptop convertible.', 
            price: '$34,999.00',
            imagen: 'images/laptop.png'
        },
        { 
            title: 'Cámara Sony Alpha Mirrorless', 
            desc: 'Captura momentos inolvidables con calidad profesional, enfoque automático rápido y grabación 4K.', 
            price: '$21,999.00',
            imagen: 'images/camara.png'
        },
        { 
            title: 'Tablet Lenovo con Stylus', 
            desc: 'Tu centro de productividad y entretenimiento. Incluye lápiz óptico para tomar notas o dibujar.', 
            price: '$6,799.00',
            imagen: 'images/tablet.png'
        },
        { 
            title: 'Smartwatch Fitness Pro', 
            desc: 'Monitorea tu salud 24/7. Mide tu ritmo cardíaco, oxígeno, calorías y sigue tus entrenamientos.', 
            price: '$1,199.00',
            imagen: 'images/smartwatch.png'
        }
    ];

    // Esta parte "dibuja" las tarjetas, ya está lista para usar las imágenes
    let gridHTML = '<div class="products-grid">';
    
    products.forEach(product => {
        gridHTML += `
            <div class="product-card">
                <img src="${product.imagen}" alt="${product.title}" class="product-image">
                
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.desc}</p>
                <div class="product-price">${product.price}</div>
                <button class="product-button">Añadir al Carrito</button>
            </div>
        `;
    });
    
    gridHTML += '</div>';
    return gridHTML;
}

// --- MANEJO DEL ESTADO ONLINE/OFFLINE ---

window.addEventListener('load', () => {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    function updateOnlineStatus() {
        if (navigator.onLine) {
            statusIndicator.classList.remove('offline');
            statusText.textContent = 'En línea';
        } else {
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Sin conexión';
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Comprobar el estado al cargar la página

    // Cargar el contenido inicial (Productos)
    // Pasamos 'null' como evento porque no es un clic real
    loadContent('productos', null); 
});