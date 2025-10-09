// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const reportController = require('../controllers/reportController');

// Ruta para ver los reportes de inasistencia
router.get('/absence', verifyToken, authorizeRole(['administrador', 'RR.HH']), reportController.getAbsenceReports);

// Ruta para exportar los reportes visibles a PDF (respeta el query param filterType)
router.get('/absence/export', verifyToken, authorizeRole(['administrador', 'RR.HH']), reportController.exportAbsenceReportsPdf);

module.exports = router;
