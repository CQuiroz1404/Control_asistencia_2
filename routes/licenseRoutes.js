const express = require('express');
const router = express.Router();
const { createLicense } = require('../controllers/licenseController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación
const { upload } = require('../controllers/licenseController'); // Importa la configuración de Multer desde el controlador
// Podrías necesitar middlewares de autenticación y autorización aquí
// const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

/**
 * @route POST /licenses
 * @description Ruta para subir y crear una nueva licencia médica.
 * Requiere autenticación y posiblemente autorización.
 */
router.post('/licenses', verifyToken, upload.single('archivoLicencia'), createLicense);

module.exports = router;
