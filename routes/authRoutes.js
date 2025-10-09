// Archivo: routes/authRoutes.js
/**
 * @file authRoutes.js
 * @description Define las rutas de la API relacionadas con la autenticación de usuarios.
 * Este módulo gestiona las operaciones de inicio de sesión, registro y cierre de sesión.
 */
const express = require("express"); // Importa el framework Express para crear y gestionar rutas.
const { renderLogin, login, register, logout} = require("../controllers/authController.js"); // Importa las funciones del controlador de autenticación.
const { loginWithQr } = require("../controllers/authController.js"); // Importa la nueva función de login con QR

const router = express.Router(); // Crea una nueva instancia de un router de Express.

/**
 * @section Rutas de Autenticación
 */

/**
 * @route GET /login
 * @description Muestra la página de inicio de sesión.
 * Antes de mostrar la vista, el controlador verifica si el usuario ya está autenticado.
 */
router.get("/login", renderLogin); 

/**
 * @route POST /login
 * @description Procesa las credenciales enviadas por el formulario de inicio de sesión.
 * Intenta autenticar al usuario y, si es exitoso, establece las cookies de sesión y redirige.
 */
router.post("/login", login);

/**
 * @route POST /auth/login-qr
 * @description Procesa el inicio de sesión mediante código QR.
 * Verifica el token JWT del QR y autentica al usuario.
 */
router.post("/auth/login-qr", loginWithQr);

/**
 * @section Rutas de Registro
 */

/**
 * @route GET /register
 * @description Muestra la página de registro de nuevos usuarios.
 */
router.get("/register", (req, res) => res.render("common/register")); // Renderiza la vista del formulario de registro.

/**
 * @route POST /register
 * @description Procesa los datos enviados por el formulario de registro.
 * Crea un nuevo usuario en la base de datos con una contraseña encriptada.
 */
router.post("/register", register);

/**
 * @section Rutas de Cierre de Sesión
 */

/**
 * @route GET /logout
 * @description Cierra la sesión del usuario eliminando las cookies de autenticación.
 * Redirige al usuario a la página principal después de cerrar sesión.
 */
router.get("/logout", logout);

// Exporta el router para que pueda ser utilizado por la aplicación principal (app.js).
module.exports = router;
