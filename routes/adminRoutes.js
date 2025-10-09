// Archivo: routes/adminRoutes.js
/**
 * @file adminRoutes.js
 * @description Define las rutas de la API para las operaciones de administración de usuarios (CRUD).
 * Estas rutas están protegidas por middlewares de autenticación y autorización para asegurar
 * que solo los administradores puedan realizar estas operaciones.
 */
const express = require("express"); // Importa el framework Express para crear y gestionar rutas.
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware.js"); // Importa los middlewares de autenticación y autorización.
const { renderAdminUserDashboard, getUsersAndRoles, getUserById, createUser, updateUser, deleteUser, changePassword, activateUser, regenerateUserQrSecret, generateQrForUser } = require("../controllers/adminController.js"); // Importa las funciones del controlador de administración.
const { renderAdminJustifications, getAllJustifications, updateJustificationStatus } = require("../controllers/justificationController.js");
const { renderAdminLicenses, getAllLicenses, updateLicenseStatus, downloadLicenseFile } = require("../controllers/licenseAdminController.js");
const { renderAdminDashboard } = require("../controllers/userController.js"); // Importa la función para renderizar el dashboard de administrador.

const router = express.Router(); // Crea una nueva instancia de un router de Express.

// Middleware para proteger todas las rutas de administración de usuarios.
// Asegura que solo los usuarios autenticados con el rol de 'Administrador' puedan acceder a estas rutas.
router.use(verifyToken, authorizeRole(['Administrador', 'RR.HH']));

/**
 * @route GET /admin
 * @description Ruta para mostrar el dashboard del administrador. Solo accesible para administradores.
 * Renderiza la vista `admin/admin.hbs`.
 */
router.get("/admin", renderAdminDashboard);

/**
 * @route GET /admin/users
 * @description Ruta para mostrar la interfaz del CRUD de usuarios. Solo accesible para administradores.
 * Renderiza la vista `admin/userCRUD.hbs` con una lista de todos los usuarios y sus roles.
 */
router.get("/admin/users", renderAdminUserDashboard);

/**
 * @route GET /api/admin/users
 * @description Ruta API para obtener la lista de usuarios y roles en formato JSON. Solo accesible para administradores.
 * Esta es la ruta que el frontend consumirá para cargar los datos dinámicamente.
 */
router.get("/api/admin/users", getUsersAndRoles);

/**
 * @route GET /api/admin/users/:id
 * @description Ruta API para obtener los datos de un usuario específico por su ID en formato JSON. Solo accesible para administradores.
 * Esta ruta es consumida por el frontend para rellenar los formularios del modal de edición.
 */
router.get("/api/admin/users/:id", getUserById);

/**
 * @route POST /admin/users
 * @description Ruta para crear un nuevo usuario. Solo accesible para administradores.
 * Espera los datos del nuevo usuario en el cuerpo de la petición.
 */
router.post("/admin/users", createUser);

/**
 * @route PUT /admin/users/:id
 * @description Ruta para actualizar un usuario existente. Solo accesible para administradores.
 * Requiere el ID del usuario a actualizar como parámetro en la URL y los datos a modificar en el cuerpo.
 */
router.put("/admin/users/:id", updateUser);

/**
 * @route DELETE /admin/users/:id
 * @description Ruta para eliminar un usuario existente. Solo accesible para administradores.
 * Requiere el ID del usuario a eliminar como parámetro en la URL.
 */
router.delete("/admin/users/:id", deleteUser);

/**
 * @route PUT /admin/users/:id/change-password
 * @description Ruta para cambiar la contraseña de un usuario existente. Solo accesible para administradores.
 * Requiere el ID del usuario como parámetro en la URL y oldPassword, newPassword en el cuerpo.
 */
router.put("/admin/users/:id/change-password", changePassword);

/**
 * @route PUT /admin/users/:id/regen-qr
 * @description Regenera el secreto QR para el usuario indicado.
 */
router.put('/admin/users/:id/regen-qr', regenerateUserQrSecret);

/**
 * @route GET /api/admin/users/:id/generate-qr-login
 * @description Genera (en server) y devuelve un DataURL del QR para el usuario especificado.
 */
router.get('/api/admin/users/:id/generate-qr-login', generateQrForUser);

/**
 * @route PUT /admin/users/:id/activate
 * @description Ruta para reactivar un usuario. Solo accesible para administradores.
 * Requiere el ID del usuario a activar como parámetro en la URL.
 */
router.put("/admin/users/:id/activate", activateUser);

/**
 * Rutas de Justificaciones (Admin)
 */
router.get('/admin/justificaciones', renderAdminJustifications);
router.get('/api/admin/justificaciones', getAllJustifications);
router.put('/api/admin/justificaciones/:id/estado', updateJustificationStatus);

/**
 * Rutas de Licencias (Admin)
 */
router.get('/admin/licencias', renderAdminLicenses);
router.get('/api/admin/licencias', getAllLicenses);
router.put('/api/admin/licencias/:id/estado', updateLicenseStatus);
router.get('/api/admin/licencias/:id/archivo', downloadLicenseFile);

// Exporta el router para que pueda ser utilizado por la aplicación principal (app.js).
module.exports = router;
