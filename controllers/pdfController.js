// Archivo: controllers/pdfController.js
/**
 * @file pdfController.js
 * @description Controlador encargado de la lógica para subir y procesar archivos PDF.
 * Este módulo maneja la visualización de formularios de subida y la extracción de datos de licencias médicas a partir de PDFs.
 */

const fs = require("fs"); // Módulo nativo de Node.js para interactuar con el sistema de archivos (ej: leer, eliminar archivos).
const pdfParse = require("pdf-parse"); // Librería para extraer texto de archivos PDF.
// La función extraerDatosLicencia es para el frontend y no debe ser requerida en el backend.
// const { extraerDatosLicencia } = require("../public/js/pdfExtractor"); // Importa la función personalizada para extraer datos específicos de licencias médicas.

/**
 * @function renderUpload
 * @description Renderiza la vista del formulario para justificar una inasistencia (subida de documento).
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `justificaciones/inasistencia.hbs`.
 */
const renderUpload = (req, res) => {
  // Pasar el usuario a la vista para poder obtener el id en caso de ser necesario
  res.render("justificaciones/inasistencia", { usuario: req.user });
};

// Multer storage para las justificaciones de inasistencia.
const path = require('path');
const multer = require('multer');
const moment = require('moment-timezone');
const Justificacion = require('../models/justification');

const storageInasistencia = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const userId = (req.user && req.user.id) ? String(req.user.id) : 'unknown';
      const dir = path.join('uploads_inasistencia', userId);
      require('fs').mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (e) {
      console.error('Error creando directorio de uploads_inasistencia por usuario:', e);
      cb(null, path.join('uploads_inasistencia'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadInasistencia = multer({ storage: storageInasistencia });

/**
 * @function procesarJustificacion
 * @description Guarda en la base de datos una justificación de inasistencia y el archivo
 * subido en la carpeta `uploads_inasistencia/<userId>/`.
 */
const procesarJustificacion = async (req, res) => {
  try {
    // Se espera que el archivo venga en el campo 'pdfFile' (conservamos nombre del formulario)
    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }

    let id_usuario = null;
    if (req.user && req.user.id) {
      id_usuario = Number(req.user.id);
    } else if (req.body && req.body.id_usuario) {
      id_usuario = Number(req.body.id_usuario);
    }

    if (!id_usuario || !Number.isInteger(id_usuario) || id_usuario <= 0) {
      // eliminar archivo si se creó
      try { require('fs').unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).send('ID de usuario no proporcionado o inválido.');
    }

    // Validar y normalizar entradas del formulario
    const fecha_inicio = req.body.fecha_inicio || req.body.fecha || null;
    const fecha_fin = req.body.fecha_fin || req.body.fecha || null;
    const motivo = req.body.motivo || req.body.motivo_text || 'Sin motivo especificado';

    if (!fecha_inicio || !fecha_fin) {
      // eliminar archivo si se creó
      try { require('fs').unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).send('Faltan las fechas de inicio/fin.');
    }

    // Guardar registro en la tabla justificacion_comun
    // Preferir la fecha/hora enviada por el cliente (para que coincida con el header), si viene y es válida
    let fechaSolicitudToUse = null;
    if (req.body && req.body.client_datetime) {
      const c = moment(req.body.client_datetime, 'YYYY-MM-DD HH:mm:ss', true);
      if (c.isValid()) {
        fechaSolicitudToUse = c.format('YYYY-MM-DD HH:mm:ss');
      }
    }
    if (!fechaSolicitudToUse) {
      fechaSolicitudToUse = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
    }

    const nueva = await Justificacion.create({
      id_usuario: id_usuario,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      motivo: motivo,
      archivo: `${id_usuario}/${req.file.filename}`,
      estado: 'Pendiente'
    });

    // Responder con JSON para que el frontend (fetch) pueda mostrar notificación y redirigir
    return res.status(201).json({ message: 'Justificación enviada correctamente', justificacion: nueva });
  } catch (err) {
    console.error('Error al procesar justificación:', err);
    // intentar eliminar archivo si existe
    if (req.file && req.file.path) {
      try { require('fs').unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(500).json({ error: 'Error interno al guardar la justificación' });
  }
};

/**
 * @function renderPdfView
 * @description Renderiza la vista del formulario para subir una licencia médica.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `justificaciones/licencia_medica.hbs`.
 */
const renderPdfView = (req, res) => {
  // Pasamos `req.user` (con el middleware verifyToken) para que la vista pueda
  // incluir el ID del usuario en el input hidden (ej: {{usuario.id}}).
  res.render("justificaciones/licencia_medica", { usuario: req.user });
};

/**
 * @function procesarPDF
 * @description Procesa un archivo PDF subido, extrae su texto y luego utiliza una función personalizada
 * para obtener datos estructurados de una licencia médica. Finalmente, renderiza una vista con estos datos.
 * @param {Object} req - Objeto de solicitud de Express, se espera que `req.file` contenga la información del archivo subido por `multer`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza una vista con los datos extraídos o envía un mensaje de error.
 */
const procesarPDF = async (req, res) => {
  // Verifica si se ha subido algún archivo. Si no, envía un error 400.
  if (!req.file) {
    return res.status(400).send("No se ha subido ningún archivo.");
  }

  const filePath = req.file.path; // Ruta temporal donde `multer` guarda el archivo subido.

  try {
    // Lee el contenido binario del archivo PDF desde la ruta temporal.
    const dataBuffer = fs.readFileSync(filePath);

    // Extrae todo el texto del PDF utilizando la librería `pdf-parse`.
    const data = await pdfParse(dataBuffer);

    // Utiliza la función personalizada `extraerDatosLicencia` para analizar el texto extraído
    // y obtener datos específicos de la licencia médica de forma estructurada.
    // const datosExtraidos = extraerDatosLicencia(data.text);

    // Renderiza una vista (ej: `pdf/pdf-view`) pasando los datos extraídos para mostrarlos al usuario.
    // res.render("pdf/pdf-view", { datos: datosExtraidos });
    res.json({ message: "PDF procesado correctamente. El texto se ha extraído.", text: data.text });
  } catch (err) {
    // Captura y registra cualquier error que ocurra durante el proceso de lectura o parseo del PDF.
    console.error("Error al procesar PDF:", err);
    // Envía una respuesta de error 500 al cliente con un mensaje descriptivo.
    res.status(500).send("Error al procesar el PDF. Asegúrate de que es un archivo válido.");
  } finally {
    // Bloque `finally` asegura que el archivo temporal se elimine siempre, incluso si ocurre un error.
    fs.unlinkSync(filePath); // Elimina el archivo PDF temporal del servidor para liberar espacio.
  }
};

// Exporta las funciones del controlador para que puedan ser utilizadas por las rutas de Express.
module.exports = {
  renderUpload,
  renderPdfView,
  procesarPDF,
  procesarJustificacion,
  uploadInasistencia
};
