// Archivo: routes/assistRoutes.js
/**
 * @file assistRoutes.js
 * @description Define las rutas de la API relacionadas con la gestión de asistencia de los usuarios.
 * Este módulo utiliza el `asistenciaController` para manejar las operaciones de registro y consulta de asistencia.
 */
const express = require('express'); // Importa el framework Express para crear y gestionar rutas.
const router = express.Router(); // Crea una nueva instancia de un router de Express.
const { registrarAsistencia, misAsistencias, getMisAsistenciasByUserId, autoMarkHolidayAttendance } = require('../controllers/assistController'); // Importa el controlador de asistencia que contiene la lógica de negocio.
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware'); // Importar authorizeRole

/**
 * Rutas de Asistencia
 */

// Ruta para ver las asistencias personales de un usuario (protegida por JWT)
router.get('/asistencia/mis-asistencias/:id', verifyToken, misAsistencias); // Corregido

// Ruta para registrar la entrada/salida de asistencia (protegida por JWT)
router.post('/asistencia/registrar/:id', verifyToken, registrarAsistencia); // Corregido

// Ruta para el marcado automático de asistencia en feriados (SOLO PARA PRUEBAS)
router.get('/mark-holidays', verifyToken, authorizeRole(['administrador']), async (req, res) => {
    const result = await autoMarkHolidayAttendance();
    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ error: result.message, details: result.error });
    }
});

// Exporta el router para que pueda ser utilizado por la aplicación principal (app.js).
module.exports = router;
