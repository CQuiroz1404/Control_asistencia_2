// Archivo: routes/userRoutes.js
/**
 * @file userRoutes.js
 * @description Define las rutas de la API relacionadas con la gestión de usuarios y la visualización de su dashboard.
 * Este módulo utiliza `userController` para las operaciones de vista y `authMiddleware` para proteger las rutas.
 */
const express = require("express"); // Importa el framework Express para crear y gestionar rutas.
const { renderHome, renderUserDashboard, renderAdminDashboard, renderUserReports, getMyJustifications, getMyLicenses, renderMyDocumentsStatus } = require("../controllers/userController.js"); // Importa las funciones del controlador de usuarios.
const { generateUserQrLogin } = require("../controllers/userController.js"); // Importa la nueva función de generación de QR de login
const {verifyToken, authorizeRole} = require("../middlewares/authMiddleware.js"); // Importa los middlewares de autenticación y autorización.

const router = express.Router(); // Crea una nueva instancia de un router de Express.

/**
 * @section Rutas de Acceso General
 */

/**
 * @route GET /
 * @description Ruta principal de la aplicación. Muestra la página de inicio (home).
 */
router.get("/", renderHome);

/**
 * @route GET /dashboard
 * @description Redirige al usuario al dashboard correcto según su rol.
 * Utiliza `verifyToken` para asegurar que el usuario esté autenticado y luego
 * decide si enviarlo al dashboard de usuario (`/dashboard_usuario`) o al de administrador (`/admin`).
 */
router.get("/dashboard", verifyToken, (req, res) => {
    if (req.user && req.user.rol === 'Administrador') {
        res.redirect('/admin');
    } else if (req.user) {
        res.redirect('/dashboard_usuario');
    } else {
        // Si por alguna razón no hay usuario (ej. token inválido aunque verifyToken debería manejarlo)
        res.redirect('/login');
    }
});

/**
 * @section Rutas de Dashboard de Usuario
 */

/**
 * @route GET /dashboard_usuario
 * @description Muestra el dashboard personalizado para un usuario autenticado.
 * Esta ruta está protegida por dos middlewares:
 * - `verifyToken`: Asegura que solo usuarios con un token JWT válido puedan acceder.
 * - `authorizeRole`: Restringe el acceso solo a usuarios con roles específicos (Marketing, Finanzas, Administrador).
 * La vista es renderizada por `userController.renderDashboard`.
 */
router.get("/dashboard_usuario", verifyToken, authorizeRole(['Administrador', 'Marketing', 'Finanzas', 'RR.HH']), renderUserDashboard);

/**
 * @route GET /reportes_usuario
 * @description Muestra la vista dedicada de reportes personales para un usuario autenticado.
 * Esta ruta está protegida por `verifyToken` para asegurar que solo usuarios autenticados accedan.
 * La vista es renderizada por `userController.renderUserReports` (y también debería permitir RR.HH).
 */
router.get("/reportes_usuario", verifyToken, authorizeRole(['Administrador', 'Marketing', 'Finanzas', 'RR.HH']), renderUserReports); // También añadir autorización aquí

/**
 * @route GET /generate-qr-login
 * @description Genera y devuelve el código QR estático de login para el usuario autenticado.
 * Protegido por `verifyToken`.
 */
router.get("/generate-qr-login", verifyToken, generateUserQrLogin);

/**
 * @route GET /api/user/justificaciones
 * @description Obtiene las justificaciones del usuario autenticado.
 * Protegido por `verifyToken`.
 */
router.get("/api/user/justificaciones", verifyToken, getMyJustifications);

/**
 * @route GET /api/user/licencias
 * @description Obtiene las licencias médicas del usuario autenticado.
 * Protegido por `verifyToken`.
 */
router.get("/api/user/licencias", verifyToken, getMyLicenses);

/**
 * @route GET /mis-documentos
 * @description Muestra la vista dedicada para que el usuario vea el estado de sus justificaciones y licencias.
 * Protegido por `verifyToken` y `authorizeRole`.
 */
router.get("/mis-documentos", verifyToken, authorizeRole(['Administrador', 'Marketing', 'Finanzas', 'RR.HH']), renderMyDocumentsStatus);

// Exporta el router para que pueda ser utilizado por la aplicación principal (app.js).
module.exports = router;
