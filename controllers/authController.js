// Archivo: controllers/authController.js
/**
 * @file authController.js
 * @description Controlador para manejar todas las operaciones de autenticación de usuarios.
 * Incluye funciones para el login, registro, logout, y la generación de tokens JWT (Access y Refresh).
 * Este controlador interactúa con los modelos de Usuario y Rol, y utiliza bcrypt para la seguridad de las contraseñas.
 */

// Importación de módulos necesarios para la autenticación
const jwt = require("jsonwebtoken");          // JSON Web Token: Utilizado para crear, firmar y verificar tokens de autenticación.
const bcrypt = require("bcryptjs");           // Bcryptjs: Librería para encriptar y comparar contraseñas de forma segura (hashing).
const User = require("../models/User");       // Modelo de Usuario: Representa la tabla de usuarios en la base de datos.
const Rol = require("../models/Rol");         // Modelo de Rol: Representa la tabla de roles de usuario en la base de datos.
const { v4: uuidv4 } = require('uuid'); // Importar uuid para generar IDs únicos
const { isAccessBlockedNow, msUntilNext22 } = require('../helpers/accessTime');

// Obtención de las claves secretas para la firma de tokens desde variables de entorno.
// Es CRÍTICO que estas claves sean seguras, complejas y se mantengan en secreto, especialmente en entornos de producción.
// Se recomienda usar herramientas como Dotenvx para gestionar estas variables de forma segura.
const JWT_SECRET = process.env.JWT_SECRET; // Clave para firmar el token de acceso (vida corta).
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Clave para firmar el token de refresco (vida más larga).
// const JWT_QR_SECRET = process.env.JWT_QR_SECRET || 'super_secreto_para_qrs_seguros'; // Ya no se usará JWT para QR de login

/**
 * @function generateAccessToken
 * @description Genera un JSON Web Token (JWT) de acceso con una duración corta.
 * Este token se usa para autenticar solicitudes a recursos protegidos y expira rápidamente para mejorar la seguridad.
 * @param {Object} user - Objeto de usuario obtenido de la base de datos, que debe contener `id`, `rut`, `nombre` y `rol.nombre`.
 * @returns {String} Un JWT de acceso firmado que expira en 15 minutos.
 */
function generateAccessToken(user) {
  return jwt.sign(
    { 
      id: user.id,                    // ID único del usuario, utilizado para identificarlo.
      rut: user.rut,                  // RUT del usuario, un identificador adicional.
      nombre: user.nombre,            // Nombre del usuario, para personalización.
      rol: user.rol.nombre            // Nombre del rol del usuario, para autorización basada en roles.
    },
    JWT_SECRET,                       // La clave secreta para firmar este token de acceso.
    { expiresIn: "15m" }              // Configura la expiración del token a 15 minutos.
  );
}

/**
 * @function generateRefreshToken
 * @description Genera un JSON Web Token (JWT) de refresco con una duración más larga.
 * Este token se utiliza para obtener nuevos tokens de acceso una vez que el token de acceso actual ha expirado,
 * evitando que el usuario tenga que iniciar sesión nuevamente con frecuencia.
 * @param {Object} user - Objeto de usuario que solo necesita el `id` para generar el token de refresco.
 * @returns {String} Un JWT de refresco firmado que expira en 7 días.
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },                  // Solo incluye el ID del usuario en el payload para el token de refresco.
    JWT_REFRESH_SECRET,               // Clave secreta diferente para los tokens de refresco, para una seguridad adicional.
    { expiresIn: "7d" }               // Configura la expiración del token a 7 días.
  );
}

/**
 * @function renderLogin
 * @description Controlador para renderizar la página de inicio de sesión (`login.hbs`).
 * Antes de mostrar la página de login, verifica si el usuario ya tiene un token de acceso válido.
 * Si el token es válido, redirige al usuario directamente al dashboard, mejorando la experiencia de usuario.
 * @param {Object} req - Objeto de solicitud HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @returns {void} Renderiza la vista de login o redirige al dashboard.
 */
const renderLogin = (req, res) => {
  // Obtiene el token de acceso de las cookies de la solicitud.
  const token = req.cookies.accessToken;

  // Si existe un token de acceso, intenta verificar su validez.
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        // Si el token es válido y no hay errores, el usuario ya está autenticado.
        return res.redirect("/dashboard_usuario"); // Redirige al dashboard del usuario.
      }
      // Si hay un error (token expirado o inválido), se procede a mostrar la página de login.
      res.render("common/login", { error: null });
    });
  } else {
    // Si no hay ningún token de acceso en las cookies, muestra la página de login normalmente.
    res.render("common/login", { error: null });
  }
};

/**
 * @function loginWithQr
 * @description Controlador para procesar el inicio de sesión de un usuario mediante código QR.
 * Verifica el secreto del QR, autentica al usuario y establece cookies de sesión.
 * @param {Object} req - Objeto de solicitud HTTP que contiene `qrCodeContent` (el secreto del QR) en el cuerpo.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<void>} Envía una respuesta JSON indicando el éxito o fracaso y redirige al dashboard.
 */
const loginWithQr = async (req, res) => {
  const { qrCodeContent } = req.body;

  if (!qrCodeContent) {
    return res.status(400).json({ error: 'Contenido del código QR es requerido.' });
  }

  try {
    // Buscar el usuario por el qr_login_secret directamente
    const user = await User.findOne({
      where: { qr_login_secret: qrCodeContent },
      include: [{ model: Rol, as: 'rol' }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Código QR inválido o no reconocido.' });
    }

    // Verificar si el usuario está desactivado
    if (user.status === 'desactivado') {
        console.log("Error: intento de login QR con cuenta desactivada");
        return res.status(403).json({
            error: "Tu cuenta ha sido desactivada. Por favor, contacta al administrador."
        });
    }

    // Comprobar horario de acceso (similar al login normal)
    const devOverrideQR = (process.env.NODE_ENV !== 'production') && req.cookies && req.cookies.DEV_DISABLE_TIME_BLOCK === '1';
    if (isAccessBlockedNow() && !devOverrideQR) {
      console.log('Intento de login QR fuera de horario permitido');
      return res.status(403).json({ error: 'El sistema se encuentra cerrado entre las 22:00 y las 06:00. Intenta más tarde.' });
    }

    // Generar tokens de acceso y refresco
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Establecer cookies
    const msTo22 = msUntilNext22();
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: Math.min(8 * 60 * 60 * 1000, msTo22), // el menor entre 8h y lo que falta hasta las 22:00
    });


    if (req.session && req.session.cookie) {
      req.session.cookie.maxAge = Math.min(req.session.cookie.maxAge || (24*60*60*1000), msTo22);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: 'Inicio de sesión exitoso', redirectUrl: '/dashboard_usuario' });
  } catch (err) {
    console.error("Error en el proceso de login QR:", err);
    return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión con QR.', details: err.message });
  }
};

/**
 * @function login
 * @description Controlador para procesar las credenciales de inicio de sesión de un usuario.
 * Verifica el RUT y la contraseña proporcionados, genera tokens JWT y establece cookies para la sesión.
 * @param {Object} req - Objeto de solicitud HTTP que contiene `rut` y `password` en el cuerpo.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<void>} Redirige al dashboard en caso de éxito o renderiza el login con un mensaje de error.
 */
const login = async (req, res) => {
    // Registros de consola para depuración, mostrando los datos recibidos.
    console.log("POST /login ejecutado", req.body);
    const { rut, password } = req.body; // Extrae el RUT y la contraseña del cuerpo de la petición.
    console.log("Datos recibidos:", rut, password);

    try {
        // Busca el usuario en la base de datos por su RUT, incluyendo la información de su rol.
        const user = await User.findOne({ 
            where: { rut }, 
            include: [{ model: Rol, as: 'rol'}] // Incluye la relación con el modelo Rol.
        });
        console.log("Usuario encontrado:", user);

        // Si no se encuentra ningún usuario con el RUT proporcionado.
        if (!user) {
            console.log("Error: usuario no existe");
            return res.status(401).render("common/login", { 
                error: "Usuario no registrado" // Mensaje de error para el usuario.
            });
        }

        // Verificar si el usuario está desactivado
        if (user.status === 'desactivado') {
            console.log("Error: usuario desactivado");
            return res.status(403).render("common/login", {
                error: "Tu cuenta ha sido desactivada. Por favor, contacta al administrador."
            });
        }

        // Compara la contraseña enviada con la contraseña encriptada almacenada en la base de datos.
        if (!bcrypt.compareSync(password, user.password)) {
            console.log("Error: contraseña incorrecta");
            return res.status(401).render("common/login", { 
                error: "Contraseña incorrecta" // Mensaje de error para el usuario.
            });
        }

    // Antes de generar tokens, comprobar si el sistema está en horario bloqueado.
    const devOverride = (process.env.NODE_ENV !== 'production') && req.cookies && req.cookies.DEV_DISABLE_TIME_BLOCK === '1';
    if (isAccessBlockedNow() && !devOverride) {
      console.log('Intento de login fuera de horario permitido');
      return res.status(403).render('common/login', { error: 'El sistema se encuentra cerrado entre las 22:00 y las 06:00. Intenta más tarde.' });
    }

    // Si el RUT y la contraseña son correctos, se procede a generar los tokens.
        console.log("Login correcto, generando tokens...");
        const accessToken = generateAccessToken(user); // Genera el token de acceso.
        const refreshToken = generateRefreshToken(user); // Genera el token de refresco.

        // Establece el token de acceso en una cookie HTTP-only. Esto previene ataques XSS.
    // Queremos que la sesión/cookie se cierre a las 22:00. Calculamos el tiempo restante hasta las 22:00.
    const msTo22 = msUntilNext22();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,     // La cookie no es accesible a través de JavaScript del lado del cliente.
      secure: process.env.NODE_ENV === 'production', // `true` en producción para solo enviar sobre HTTPS.
      sameSite: "strict", // Protección contra ataques CSRF, asegura que la cookie solo se envíe para solicitudes del mismo sitio.
      // Usamos el menor entre 15 minutos y el tiempo hasta las 22:00 para forzar expiración a las 22:00.
      maxAge: Math.min(15 * 60 * 1000, msTo22),
    });

    // Si express-session está en uso, ajustar la cookie de sesión para expirar también a las 22:00.
    try {
      if (req.session && req.session.cookie) {
        req.session.cookie.maxAge = Math.min(req.session.cookie.maxAge || (24*60*60*1000), msTo22);
      }
    } catch (e) {
      console.warn('No fue posible ajustar la expiración de la sesión:', e.message);
    }

        // Establece el token de refresco en otra cookie HTTP-only.
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // `true` en producción para solo enviar sobre HTTPS.
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // Duración de la cookie: 7 días (en milisegundos).
        });

        // Redirige al usuario al dashboard después de un inicio de sesión exitoso.
        res.redirect("/dashboard_usuario");
    } catch (err) {
        // Manejo de errores generales del servidor durante el proceso de login.
        console.error("Error en el proceso de login:", err);
        res.status(500).send("Error al iniciar sesión: " + err.message); // Envía un mensaje de error genérico al cliente.
    }
};

/**
 * @function register
 * @description Controlador para registrar un nuevo usuario en la aplicación.
 * Recibe el RUT y la contraseña, encripta la contraseña y guarda el nuevo usuario en la base de datos.
 * @param {Object} req - Objeto de solicitud HTTP que contiene `rut` y `password` en el cuerpo.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @returns {Promise<void>} Redirige a la página de login en caso de éxito o envía un mensaje de error.
 */
const register = async (req, res) => {
    const { rut, password } = req.body; // Extrae el RUT y la contraseña del cuerpo de la petición.

    try {
        // Encripta la contraseña antes de almacenarla en la base de datos.
        // Se utiliza un factor de costo (salt rounds) de 10 para una buena seguridad y rendimiento.
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Generar un secreto QR único para el usuario
        const qrLoginSecret = uuidv4();

        // Crea un nuevo registro de usuario en la base de datos con el RUT y la contraseña encriptada.
        await User.create({ 
            rut, 
            password: hashedPassword,
            qr_login_secret: qrLoginSecret // Guardar el secreto QR
        });
        
        // Redirige al usuario a la página de login para que pueda iniciar sesión con sus nuevas credenciales.
        res.redirect("/login");
    } catch (err) {
        // Manejo de errores (ej: RUT duplicado, errores de validación).
        console.error("Error en el proceso de registro:", err);
        res.status(400).send("Error al registrar usuario: " + err.message); // Envía un mensaje de error al cliente.
    }
};

/**
 * @function logout
 * @description Controlador para cerrar la sesión de un usuario.
 * Elimina las cookies de `accessToken` y `refreshToken`, invalidando la sesión actual del usuario.
 * @param {Object} req - Objeto de solicitud HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @returns {void} Redirige al usuario a la página principal.
 */
const logout = (req, res) => {
    // Elimina la cookie del token de acceso.
    res.clearCookie("accessToken");
    // Elimina la cookie del token de refresco.
    res.clearCookie("refreshToken");
    
    // Redirige al usuario a la página principal de la aplicación después de cerrar sesión.
    res.redirect("/");
};

// Exporta todas las funciones del controlador para que puedan ser utilizadas por los routers de Express.
module.exports = {
    renderLogin,
    login,
    register,
    logout,
    loginWithQr // Exportar la nueva función
};