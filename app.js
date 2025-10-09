// Archivo: app.js
/**
 * @file app.js
 * @description Archivo principal de la aplicación. Configura el servidor Express, el motor de plantillas Handlebars, la conexión a la base de datos, y define los middlewares y rutas principales.
 * Este archivo actúa como el punto de entrada de la aplicación, orquestando todos los componentes para que funcionen juntos.
 */

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const moment = require('moment-timezone');
const sequelize = require('./config/database'); // Importa la instancia de Sequelize configurada
const multer = require('multer'); // Middleware para manejar la subida de archivos
const session = require('express-session'); // Middleware para manejar sesiones de usuario
const cookieParser = require('cookie-parser'); // Middleware para parsear cookies

// Importación de routers: Módulos que agrupan rutas relacionadas para una mejor organización.
const authRoutes = require('./routes/authRoutes'); // Rutas para autenticación (login, logout)
const userRoutes = require('./routes/userRoutes'); // Rutas para funcionalidades de usuario (dashboard)
const pdfRoutes = require('./routes/pdfRoutes');   // Rutas para funcionalidades relacionadas con PDFs
const asistenciaRoutes = require('./routes/assistRoutes'); // Rutas para el registro y consulta de asistencia
const adminRoutes = require('./routes/adminRoutes'); // Rutas para la administración de usuarios (CRUD)
const licenseRoutes = require('./routes/licenseRoutes'); // Rutas para la gestión de licencias médicas
const reportRoutes = require('./routes/reportRoutes'); // Rutas para los reportes de asistencia

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Define el puerto del servidor, usando una variable de entorno o el puerto 3000 por defecto

// --- Configuración de Multer para la subida de archivos ---
// (Los controladores individuales configuran su propio storage: uploads_licmed y uploads_inasistencia)

// --- Middlewares globales ---
// Sirve archivos estáticos (CSS, JS del frontend, imágenes) desde la carpeta 'public'.
// Esto permite que el navegador cargue recursos como 'style.css' o 'script.js'.
app.use(express.static(path.join(__dirname, 'public')));
// Servir archivos subidos (licencias/justificaciones)
// Servir uploads de licencias médicas y justificaciones en nuevas carpetas
app.use('/uploads_licmed', express.static(path.join(__dirname, 'uploads_licmed')));
app.use('/uploads_inasistencia', express.static(path.join(__dirname, 'uploads_inasistencia')));

// Middleware para parsear el cuerpo de las peticiones HTTP. Permite leer datos enviados por formularios HTML.
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear el cuerpo de las peticiones HTTP con formato JSON. Util para APIs REST.
app.use(express.json());

// Configuración de cookie-parser: Permite parsear las cookies enviadas por el cliente.
app.use(cookieParser());

// Configuración de express-session: Gestiona las sesiones de usuario en el servidor.
// Esto permite almacenar información del usuario entre diferentes solicitudes.
app.use(session({
    secret: process.env.SESSION_SECRET || 'una_clave_secreta_muy_segura', // Clave secreta para firmar la cookie de sesión. ¡Debe ser una variable de entorno en producción!
    resave: false, // Evita que la sesión se guarde en cada petición si no ha cambiado
    saveUninitialized: true, // Guarda las sesiones nuevas que aún no han sido modificadas
    cookie: { secure: process.env.NODE_ENV === 'production' } // `secure: true` solo para HTTPS en producción
}));

// Obtención de las fechas y horas actuales para ser usadas en la aplicación.
// 'moment-timezone' se usa para manejar zonas horarias, útil para aplicaciones globales.
const ahoraChile = moment()
    .tz('America/Santiago') // Establece la zona horaria a Santiago, Chile
    .format('YYYY-MM-DD HH:mm:ss'); // Formato de salida de fecha y hora

const ahoraUTC = moment()
    .utc() // Establece la zona horaria a UTC (Universal Coordinated Time)
    .format(); // Formato de salida por defecto de moment

/**
 * Configuración de Handlebars como motor de plantillas
 * Handlebars permite crear vistas dinámicas inyectando datos en plantillas HTML.
 */
app.engine('.hbs', engine({
    extname: '.hbs', // Define la extensión de los archivos de plantilla
    defaultLayout: 'main', // Establece 'main.hbs' como el layout principal por defecto
    layoutsDir: path.join(__dirname, 'views/layouts'), // Directorio donde se encuentran los layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Directorio para partials (componentes reutilizables)
    helpers: {
        // Ejemplo de un helper de Handlebars. Permite definir bloques de contenido en las vistas.
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        // Helper para comparar igualdad
        eq: function(a, b) {
            return a === b;
        },
        or: function() {
            return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        },
        // Helper para obtener clase CSS del badge según categoría
        badgeClass: function(categoriaNombre) {
            switch(categoriaNombre) {
                case 'Entrada Normal': return 'bg-success';
                case 'Salida Normal': return 'bg-primary';
                case 'Salida Anticipada': return 'bg-warning';
                case 'Atraso': return 'bg-danger';
                case 'Inasistencia': return 'bg-dark';
                default: return 'bg-secondary';
            }
        },
        // Nuevo helper para serializar a JSON (para usar con {{{json ...}}})
        json: function(context) {
            return JSON.stringify(context);
        }
    }
}));

app.set('view engine', '.hbs'); // Establece Handlebars como el motor de vistas
app.set('views', path.join(__dirname, 'views')); // Directorio donde se encuentran los archivos de vista

/**
 * Rutas de la API
 * Estas son rutas específicas que pueden ser llamadas por el frontend para obtener datos o realizar acciones.
 */
// Ruta de ejemplo para obtener la hora actual en Chile. Útil para verificar la configuración de zona horaria.
app.get('/api/time', (req, res) => {
    try {
        const time = moment().tz('America/Santiago').format('HH:mm:ss');
        res.json({ time });
    } catch (err) {
        console.error('Error getting local Chile time:', err);
        res.status(500).json({ error: 'No se pudo obtener la hora de Chile' });
    }
});

// Ruta para renderizar una página de error en el dashboard. Se usa cuando hay problemas de acceso o datos.
app.get('/dashboard_error', (req, res) => {
    res.render('common/dashboard_error');
});

/**
 * Rutas principales de la aplicación
 * Estos middlewares asocian prefijos de URL con routers específicos, organizando las rutas por funcionalidad.
 */
app.use('/', authRoutes); // Usa las rutas de autenticación para la raíz de la aplicación
app.use('/', userRoutes); // Usa las rutas de usuario
app.use('/', pdfRoutes);  // Usa las rutas de PDF
app.use('/', asistenciaRoutes); // Usa las rutas de asistencia
app.use('/api', licenseRoutes); // Usa las rutas de licencias médicas con prefijo /api
app.use('/reports', reportRoutes); // Usa las rutas de reportes con prefijo /reports
app.use('/', adminRoutes); // Usa las rutas de administración de usuarios

// Fallback explícito para servir archivos en uploads por ruta parametrizada
// Fallbacks para servir archivos por rutas parametrizadas (licencias y justificaciones)
app.get('/uploads_licmed/:userId/:file', (req, res, next) => {
    const userId = String(req.params.userId || '').replace(/[^0-9]/g, '');
    const file = String(req.params.file || '').replace(/\.{2,}/g, '.');
    const abs = path.join(__dirname, 'uploads_licmed', userId, file);
    return res.sendFile(abs, err => { if (err) return next(); });
});

app.get('/uploads_inasistencia/:userId/:file', (req, res, next) => {
    const userId = String(req.params.userId || '').replace(/[^0-9]/g, '');
    const file = String(req.params.file || '').replace(/\.{2,}/g, '.');
    const abs = path.join(__dirname, 'uploads_inasistencia', userId, file);
    return res.sendFile(abs, err => { if (err) return next(); });
});

/**
 * Middleware para manejar rutas no encontradas (404)
 * Este middleware se ejecuta si ninguna de las rutas anteriores ha coincidido con la solicitud.
 */
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

/**
 * Sincronización con la base de datos y levantamiento del servidor
 * Antes de iniciar el servidor, se asegura de que los modelos de Sequelize estén sincronizados con la DB.
 */
// Evitar alter automático en producción para no crear índices duplicados
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
});
