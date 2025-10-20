# Actividad 3: Prueba de App Shell - PWA

**Progressive Web App** con funcionalidad completa offline desarrollada como parte de la Actividad 3.

---

## Descripción del Proyecto

Esta es una **Progressive Web App (PWA)** de tienda online que implementa un **App Shell** completo con todas las características requeridas:

### Cumplimiento de Requisitos

- **Estructura del App Shell**: Menú principal, encabezado, pie de página y vista de contenido dinámico
- **Service Worker**: Implementado para almacenar el App Shell en caché y permitir funcionamiento sin conexión
- **Manifest.json**: Archivo de manifiesto con iconos, nombre y colores de la aplicación configurados
- **Contenido Dinámico**: Simulación de contenido cargado dentro del App Shell (catálogo de 6 productos)
- **Documentación**: README que explica la configuración, arquitectura y cómo probar sin conexión

---

## Arquitectura del Proyecto

### Estructura de Archivos

```
proyecto/
│
├── index.html          # App Shell principal con estructura HTML
├── styles.css          # Estilos CSS personalizados con variables
├── app.js              # Lógica JavaScript y manejo de contenido dinámico
├── sw.js               # Service Worker para caché y modo offline
├── manifest.json       # Web App Manifest con configuración PWA
├── README.md           # Esta documentación
│
└── images/             # Carpeta de imágenes de productos
    ├── pixel.png       # Smartphone Pixel Pro
    ├── audifonos.png   # Audífonos Skullcandy
    ├── laptop.png      # Laptop Gaming ROG
    ├── camara.png      # Cámara Sony Alpha
    ├── tablet.png      # Tablet Lenovo
    └── smartwatch.png  # Smartwatch Fitness Pro
```

## Características del Diseño

### Paleta de Colores Personalizada

```css
--color-primary: #045a71        /* Azul oscuro principal */
--color-primary-dark: #50aac2   /* Azul claro */
--color-secondary: #297170      /* Verde azulado */
--color-secondary-dark: #053d6d /* Azul marino */
--color-success: #4caf50        /* Verde (online) */
--color-danger: #f44336         /* Rojo (offline) */
```

### Diseño Responsive

- **Desktop (> 768px)**: Grid de 3 columnas, menú horizontal
- **Tablet (768px)**: Grid de 2 columnas
- **Mobile (< 768px)**: Grid de 1 columna, menú hamburguesa



## Componentes Principales

### 1. App Shell (index.html)

**Componentes incluidos:**

#### Header (Encabezado)
- Logo de la tienda
- Indicador de estado en tiempo real (En línea / Sin conexión)
- Botón menú hamburguesa para móviles
- Posición sticky (se mantiene visible al hacer scroll)

#### Navegación
- 4 secciones: Productos, Ofertas, Novedades, Contacto
- Menú responsive (horizontal en desktop, desplegable en móvil)
- Estado activo visual en la sección actual

#### Main (Contenido Dinámico)
- Grid responsive de productos
- Carga dinámica vía JavaScript
- 6 productos con imagen, título, descripción, precio y botón

#### Footer (Pie de página)
- 3 secciones informativas:
  - Sobre Nosotros
  - Enlaces Rápidos
  - Información de Contacto
- Copyright y año actual

### 2. Service Worker (sw.js)

**Estrategia implementada:** Cache First, Network Fallback

#### Eventos Implementados:

**Install (Instalación)**
```javascript
- Cachea el App Shell completo
- Cachea todos los recursos estáticos (HTML, CSS, JS)
- Cachea las 6 imágenes de productos
- Activa inmediatamente con skipWaiting()
```

**Activate (Activación)**
```javascript
- Limpia cachés de versiones anteriores
- Mantiene solo la versión actual (v1)
- Toma control de todas las páginas
```

**Fetch (Interceptación de peticiones)**
```javascript
- Sirve recursos desde caché si están disponibles
- Si no están en caché, hace petición a la red
- Cachea automáticamente respuestas nuevas exitosas
- Maneja errores con mensaje de "Sin conexión"
```

**Características Adicionales:**
- Sincronización en segundo plano (`sync` event)
- Soporte para notificaciones push (`push` event)
- Manejo de clics en notificaciones

#### Archivos Cacheados:

```javascript
APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/images/pixel.png',
    '/images/audifonos.png',
    '/images/laptop.png',
    '/images/camara.png',
    '/images/tablet.png',
    '/images/smartwatch.png'
]
```

### 3. Manifest.json

**Iconos incluidos:**
- 6 tamaños: 48x48, 72x72, 96x96, 128x128, 192x192, 512x512
- Formato SVG escalable
- Soporte para iconos maskable

**Características avanzadas:**
- Shortcuts (accesos directos a secciones)
- Share target (compartir contenido)
- Screenshots para stores
- Categorías definidas (shopping, business, productivity)

### 4. Contenido Dinámico (app.js)


**Funcionalidades JavaScript:**
- Registro automático del Service Worker
- Toggle del menú móvil
- Carga dinámica de contenido por sección
- Renderizado del grid de productos
- Detección de estado online/offline en tiempo real
- Actualización visual del indicador de conexión



## Instalación y Configuración

### Requisitos Previos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor HTTP local (requerido para Service Workers)

### Pasos de Instalación

1. **Descarga o clona el proyecto**

2. **Verifica la estructura de archivos:**
   ```
   index.html
   styles.css
   app.js
   sw.js
   manifest.json
   images/ (con 6 imágenes)
   ```

3. **Inicia un servidor local**

   **Opción 1: Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Opción 2: Node.js (http-server)**
   ```bash
   # Instalar globalmente
   npm install -g http-server
   
   # Ejecutar
   http-server -p 8000
   ```

   **Opción 3: PHP**
   ```bash
   php -S localhost:8000
   ```

   **Opción 4: VS Code (Live Server)**
   - Instala la extensión "Live Server"
   - Clic derecho en `index.html`
   - Selecciona "Open with Live Server"

4. **Abre en el navegador**
   ```
   http://localhost:8000
   ```

---

## Cómo Probar Sin Conexión

### Prueba Completa de Funcionalidad Offline

#### Paso 1: Verificar el Service Worker

1. Abre la aplicación en el navegador
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Application** (Chrome/Edge) o **Storage** (Firefox)
4. En el menú lateral, selecciona **Service Workers**
5. **Verificación exitosa:**
   - Estado: "activated and running"
   - Source: sw.js
   - Status: Active

#### Paso 2: Verificar el Caché

1. En la misma pestaña **Application**
2. Expande **Cache Storage** en el menú lateral
3. Haz clic en `app-shell-v1`
4. **Deberías ver todos estos archivos:**
   ```
   / (o index.html)
   index.html
   styles.css
   app.js
   manifest.json
   images/pixel.png
   images/audifonos.png
   images/laptop.png
   images/camara.png
   images/tablet.png
   images/smartwatch.png
   ```

#### Paso 3: Activar Modo Offline

**Método 1: DevTools Network Throttling**
1. Ve a la pestaña **Network** en DevTools
2. Busca el dropdown que dice "No throttling" o "Online"
3. Selecciona **Offline**
4. Recarga la página (F5 o Ctrl+R)

**Método 2: Desactivar WiFi**
1. Desactiva tu conexión WiFi o datos móviles
2. Recarga la página en el navegador

#### Paso 4: Verificar Funcionalidad

**La aplicación debería:**
- Cargar completamente sin errores
- Mostrar todos los productos con imágenes
- Mantener toda la funcionalidad del menú
- Mostrar el indicador rojo "Sin conexión"
- Permitir navegar entre secciones

**Si algo no funciona:**
- Verifica que el Service Worker esté activo
- Revisa la consola por errores
- Asegúrate de que todas las rutas en `sw.js` sean correctas

#### Paso 5: Observar el Indicador de Estado

- Con conexión:** Punto verde - "En línea"
- Sin conexión:** Punto rojo - "Sin conexión"

El indicador cambia automáticamente en tiempo real.

---

## Instalar como PWA

### En Chrome/Edge (Escritorio)

1. Abre la aplicación en Chrome
2. En la barra de direcciones, busca el ícono **➕** o "Instalar"
3. Haz clic en **"Instalar Actividad 3"**
4. La app se abrirá en una ventana independiente
5. Aparecerá un ícono en tu escritorio

### En Chrome (Android)

1. Abre la aplicación en Chrome móvil
2. Toca el menú **⋮** (tres puntos)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Personaliza el nombre si lo deseas
5. Toca **"Agregar"**
6. El ícono aparecerá en tu pantalla de inicio

### En Safari (iOS)

1. Abre la aplicación en Safari
2. Toca el botón **Compartir** (□↑)
3. Desplázate y selecciona **"Agregar a pantalla de inicio"**
4. Personaliza el nombre
5. Toca **"Añadir"**


*Última actualización: Octubre 2024*