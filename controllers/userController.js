// Archivo: controllers/userController.js
/**
 * @file userController.js
 * @description Controlador dedicado a manejar las vistas y la lógica asociada a las operaciones del usuario,
 * como la visualización del dashboard. Interactúa con otros controladores para obtener datos necesarios.
 */

// Importación de funciones necesarias de otros controladores o módulos.
const { getMisAsistenciasByUserId } = require("../controllers/assistController"); // Función para obtener las asistencias de un usuario.
const { _fetchUsersAndRolesData } = require("../controllers/adminController"); // Importa la función interna para obtener usuarios y roles.
const Asistencia = require('../models/assist'); // Importar el modelo Asistencia
const EstadoAsistencia = require('../models/StateAssist'); // Importar el modelo EstadoAsistencia
const CategoriaAsistencia = require('../models/assistCategory'); // Importar el modelo CategoriaAsistencia
const User = require('../models/User'); // Importar el modelo User para acceder al qr_login_secret
const QRCode = require('qrcode'); // Importar la librería qrcode
const moment = require('moment-timezone'); // Para formatear fechas
// const fetch = require('node-fetch'); // Ya no es necesario aquí
const { getChileanHolidays } = require('../helpers/holidayUtils'); // Importar desde el nuevo archivo
const Justificacion = require('../models/justification'); // Importar el modelo Justificacion
const LicenciaMedica = require('../models/lecense'); // Importar el modelo LicenciaMedica

/**
 * @function renderHome
 * @description Renderiza la página de inicio de la aplicación.
 * Esta es típicamente la primera vista que un usuario ve al acceder a la URL raíz.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `home.hbs`.
 */
const renderHome = (req, res) => {
  res.render("home");
};

/**
 * @function renderUserDashboard
 * @description Renderiza el dashboard principal para un usuario autenticado (no administrador).
 * Esta función está protegida por middleware JWT y carga los datos de asistencia del usuario
 * antes de mostrar la vista. Los datos del usuario (`req.user`) son provistos por el middleware de autenticación.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `common/dashboard_usuario.hbs` con los datos del usuario,
 * o una página de error si falla la carga de datos.
 */
const renderUserDashboard = async (req, res) => {
  // `req.user` contiene la información del usuario autenticado, gracias al middleware `authMiddleware.js`.
  try {
    // Renderiza la vista del dashboard, pasando el objeto `usuario` (con datos de `req.user`)
    res.render("common/dashboard_usuario", {
      usuario: { ...req.user, isAdmin: req.user.rol === 'Administrador' }
    });
  } catch (error) {
    // Si ocurre un error durante el renderizado,
    // se registra el error y se muestra una página de error al usuario.
    console.error("Error al renderizar el dashboard del usuario:", error);
    res.status(500).render("common/dashboard_error", { message: "Error al cargar el dashboard." });
  }
};

/**
 * @function renderAdminDashboard
 * @description Renderiza el dashboard principal para un usuario administrador.
 * Esta función está protegida por middleware JWT y de autorización de rol.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario administrador).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `admin/admin.hbs` con los datos necesarios,
 * o una página de error si falla.
 */
const renderAdminDashboard = async (req, res) => {
  try {
    // Obtener usuarios y roles para la sección de gestión de usuarios en el dashboard de admin
    const { users, roles } = await _fetchUsersAndRolesData(); // Usa la función interna para obtener datos

    // Datos de ejemplo para los KPIs y reportes (estos deberían ser obtenidos de la BD en una implementación real)
    const attendancePercent = 85; // Ejemplo
    const lateCount = 10;         // Ejemplo
    const earlyLeaveCount = 5;    // Ejemplo
    const absentCount = 2;        // Ejemplo

    // Datos de reportes de ejemplo (vacío por ahora)
    const reports = []; // Aquí irían los reportes detallados de asistencia de todos los usuarios

    res.render("admin/admin", {
      user: req.user, // Información del usuario administrador logeado
      users: users,   // Lista de todos los usuarios para la tabla de gestión
      roles: roles,   // Lista de todos los roles para los filtros o selectores (si aplica)
      attendancePercent,
      lateCount,
      earlyLeaveCount,
      absentCount,
      reports: reports
    });
  } catch (error) {
    console.error("Error al renderizar el dashboard del administrador:", error);
    res.status(500).render("common/dashboard_error", { message: "Error al cargar el dashboard de administrador." });
  }
};

/**
 * @function renderUserReports
 * @description Renderiza la vista de reportes personales para un usuario autenticado.
 * Esta función está protegida por middleware JWT y carga los datos de asistencia del usuario
 * para mostrarlos en una vista dedicada.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `common/reportes_usuario.hbs` con los datos del usuario y sus asistencias,
 * o una página de error si falla la carga de datos.
 */
const renderUserReports = async (req, res) => {
  try {
    const id_usuario = req.user.id; // Extrae el ID del usuario del objeto `req.user`.

    const asistencias = await Asistencia.findAll({
        where: { id_usuario },
        include: [
            { model: EstadoAsistencia, as: 'estado', attributes: ['estado'] },
            { model: CategoriaAsistencia, as: 'categoria', attributes: ['nombre'] }
        ],
        order: [['fecha', 'ASC']]
    });

    // Convertir las instancias de Sequelize a objetos planos
    const plainAsistencias = asistencias.map(assist => assist.toJSON());

    const calendarEvents = plainAsistencias.map(asistencia => {
        let color = '#6c757d'; // Default secondary color
        let title = 'Asistencia';

        if (asistencia.categoria && asistencia.categoria.nombre) {
            title = asistencia.categoria.nombre;
            switch (asistencia.categoria.nombre) {
                case 'Entrada Normal':
                case 'Salida Normal':
                    color = '#28a745'; // Green for Presente
                    break;
                case 'Atraso':
                    color = '#ffc107'; // Yellow for Atraso
                    break;
                case 'Inasistencia':
                    color = '#343a40'; // Dark for Inasistencia
                    break;
                case 'Salida Anticipada':
                    color = '#fd7e14'; // Orange for Salida Anticipada
                    break;
                default:
                    color = '#007bff'; // Blue for other categories
            }
        } else if (asistencia.estado && asistencia.estado.estado) {
            title = asistencia.estado.estado;
            switch (asistencia.estado.estado) {
                case 'Presente':
                    color = '#28a745';
                    break;
                case 'Ausente':
                    color = '#dc3545'; // Red for Ausente
                    break;
                case 'Justificado':
                case 'Licencia Médica':
                case 'Permiso Administrativo':
                    color = '#17a2b8'; // Teal for Justificado/Licencia/Permiso
                    break;
                default:
                    color = '#6c757d';
            }
        }

        return {
            title: title,
            start: moment(asistencia.fecha).format('YYYY-MM-DD'),
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
                hora_entrada: asistencia.hora_entrada ? moment(asistencia.hora_entrada, 'HH:mm:ss').format('HH:mm') : 'N/A',
                hora_salida: asistencia.hora_salida ? moment(asistencia.hora_salida, 'HH:mm:ss').format('HH:mm') : 'N/A',
                estado_detalle: asistencia.estado ? asistencia.estado.estado : 'N/A',
                categoria_detalle: asistencia.categoria ? asistencia.categoria.nombre : 'N/A'
            }
        };
    });

  // Añadir eventos de justificaciones aprobadas (Falta Justificada - Inasistencia)
  try {
    const approvedJustifications = await Justificacion.findAll({ where: { id_usuario, estado: 'Aprobada' } });
    approvedJustifications.forEach(j => {
      // Justificacion usa campos fecha_inicio y fecha_fin
      const start = moment(j.fecha_inicio).format('YYYY-MM-DD');
      // FullCalendar trata `end` como exclusivo, por eso sumamos 1 día para incluir la fecha_fin
      const end = moment(j.fecha_fin).add(1, 'day').format('YYYY-MM-DD');
      calendarEvents.push({
        title: 'Falta Justificada - Inasistencia',
        start: start,
        end: end,
        allDay: true,
        backgroundColor: '#20c997', // verde para inasistencia justificada
        borderColor: '#20c997',
        extendedProps: {
          id_categoria: 8,
          tipo: 'justificacion',
          referencia_id: j.id
        }
      });
    });
  } catch (err) {
    console.error('Error al obtener justificaciones aprobadas para calendarEvents:', err);
  }

  // Añadir eventos de licencias médicas aprobadas (Falta Justificada - Licencia Médica)
  try {
    const approvedLicenses = await LicenciaMedica.findAll({ where: { id_usuario, estado: 'Aprobada' } });
    approvedLicenses.forEach(l => {
      // LicenciaMedica usa fecha_inicio (Inicio de Reposo) y fecha_fin (Fecha de Término)
      const start = moment(l.fecha_inicio).format('YYYY-MM-DD');
      const end = moment(l.fecha_fin).add(1, 'day').format('YYYY-MM-DD');
      calendarEvents.push({
        title: 'Falta Justificada - Licencia Médica',
        start: start,
        end: end,
        allDay: true,
        backgroundColor: '#0dcaf0', // cyan/info para licencia médica
        borderColor: '#0dcaf0',
        extendedProps: {
          id_categoria: 7,
          tipo: 'licencia_medica',
          referencia_id: l.id
        }
      });
    });
  } catch (err) {
    console.error('Error al obtener licencias médicas aprobadas para calendarEvents:', err);
  }

  // Obtener feriados para el año actual y añadirlos a los eventos del calendario
  const currentYear = moment().year();
  const chileanHolidays = await getChileanHolidays(currentYear); // Usar la función importada
  calendarEvents.push(...chileanHolidays); // Añadir feriados a la lista de eventos

    res.render("common/reportes_usuario", {
      usuario: { ...req.user, isAdmin: req.user.rol === 'Administrador' },
      asistencias: plainAsistencias, // Pasar los objetos planos a la tabla
      calendarEvents: JSON.stringify(calendarEvents)
    });
  } catch (error) {
    // Si ocurre un error durante la obtención de asistencias o el renderizado,
    // se registra el error y se muestra una página de error al usuario.
    console.error("Error al renderizar los reportes del usuario:", error);
    res.status(500).render("common/dashboard_error", { message: "Error al cargar los reportes." });
  }
};

/**
 * @function generateUserQrLogin
 * @description Genera un código QR estático para el login de un usuario.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Genera un código QR y lo envía como respuesta.
 */
const generateUserQrLogin = async (req, res) => {
  try {
    const user = req.user;
    const qrLoginSecret = user.qr_login_secret;

    if (!qrLoginSecret) {
      return res.status(400).json({ message: "El usuario no tiene un secreto de login QR configurado." });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(qrLoginSecret);
    res.send(qrCodeDataUrl);
  } catch (error) {
    console.error("Error al generar el código QR de login:", error);
    res.status(500).json({ message: "Error al generar el código QR de login." });
  }
};

/**
 * @function getMyJustifications
 * @description Obtiene todas las justificaciones de un usuario específico.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user.id`).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con las justificaciones del usuario.
 */
const getMyJustifications = async (req, res) => {
    try {
        const id_usuario = req.user.id; // ID del usuario logueado
    const justificaciones = await Justificacion.findAll({
      where: { id_usuario },
      order: [['id', 'DESC']]
    });
        res.json({ justificaciones: justificaciones.map(j => j.toJSON()) });
    } catch (error) {
        console.error("Error al obtener justificaciones del usuario:", error);
        res.status(500).json({ error: 'Error al obtener tus justificaciones.' });
    }
};

/**
 * @function getMyLicenses
 * @description Obtiene todas las licencias médicas de un usuario específico.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user.id`).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con las licencias médicas del usuario.
 */
const getMyLicenses = async (req, res) => {
    try {
        const id_usuario = req.user.id; // ID del usuario logueado
        const licencias = await LicenciaMedica.findAll({
            where: { id_usuario },
            order: [['fecha_emision', 'DESC']]
        });
        res.json({ licencias: licencias.map(l => l.toJSON()) });
    } catch (error) {
        console.error("Error al obtener licencias médicas del usuario:", error);
        res.status(500).json({ error: 'Error al obtener tus licencias médicas.' });
    }
};

/**
 * @function renderMyDocumentsStatus
 * @description Renderiza la vista del estado de las justificaciones y licencias del usuario.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `common/my_documents_status.hbs`.
 */
const renderMyDocumentsStatus = (req, res) => {
    try {
        res.render("common/my_documents_status", { usuario: req.user });
    } catch (error) {
        console.error("Error al renderizar la vista de estado de documentos:", error);
        res.status(500).render("common/dashboard_error", { message: "Error al cargar la vista de documentos." });
    }
};

// Función para obtener feriados de feriados.cl (ELIMINAR ESTA FUNCIÓN DE AQUÍ)
// const getChileanHolidays = async (year = moment().year()) => {
//     try {
//         const response = await fetch(`https://api.feriados.cl/api/feriados/${year}`);
//         if (!response.ok) {
//             throw new Error(`Error al obtener feriados: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data.data.map(holiday => ({
//             title: holiday.nombre,
//             start: holiday.fecha,
//             backgroundColor: '#007bff', // Color para feriados
//             borderColor: '#007bff',
//             allDay: true
//             // Puedes añadir más propiedades si FullCalendar las usa, como extendedProps para tooltips
//         }));
//     } catch (error) {
//         console.error('Error al obtener los feriados de Chile:', error);
//         return [];
//     }
// };

// Exporta las funciones del controlador para que puedan ser utilizadas por los routers de Express.
module.exports = {
  renderHome,
  renderUserDashboard,
  renderAdminDashboard,
  renderUserReports,
  generateUserQrLogin,
  getMyJustifications,
  getMyLicenses,
  renderMyDocumentsStatus // Exportar la nueva función
};
