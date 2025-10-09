// controllers/reportController.js

const { Op } = require('sequelize');
const moment = require('moment-timezone');
const Asistencia = require('../models/assist');
const User = require('../models/User');
const EstadoAsistencia = require('../models/StateAssist');
const CategoriaAsistencia = require('../models/assistCategory');
const Rol = require('../models/Rol'); // Needed to get user roles

const getAbsenceReports = async (req, res) => {
    try {
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
        const filterType = req.query.filterType || ''; // 'inasistencia', 'atraso', 'salida_anticipada', 'ambas'
        const whereClause = { fecha: { [Op.gte]: sevenDaysAgo } };

        if (filterType) {
            let categoryIds = [];
            // Fetch category IDs dynamically
            const categories = await CategoriaAsistencia.findAll({ attributes: ['id', 'nombre'] });
            const inasistenciaCategory = categories.find(cat => cat.nombre === 'Inasistencia');
            const atrasoCategory = categories.find(cat => cat.nombre === 'Atraso');
            // Assuming 'Salida Anticipada' would also have a category or state ID if it existed as such.

            if (filterType === 'inasistencia' && inasistenciaCategory) {
                categoryIds.push(inasistenciaCategory.id);
            } else if (filterType === 'atraso' && atrasoCategory) {
                categoryIds.push(atrasoCategory.id);
            } else if (filterType === 'ambas' && inasistenciaCategory && atrasoCategory) {
                // This scenario means both atraso AND inasistencia. This is not clear, will assume OR for now
                // and will refine based on user feedback if necessary for 'both'.
                // For 'ambas' (atraso y salida temprana), it implies an additional category or logic.
                // For simplicity, for 'ambas' filtering 'atraso' and 'inasistencia' at the same time
                // is not straightforward with a single category filter.
                // I'll adjust the logic for 'ambas' to be a combination of inasistencia or atraso for now.
                categoryIds.push(inasistenciaCategory.id);
                categoryIds.push(atrasoCategory.id);
            } else if (filterType === 'salida_anticipada') {
                // Placeholder for 'Salida Anticipada' logic
                // This would require comparing hora_salida with a standard work end time.
                // For now, no specific filter is applied here, it will be handled on the frontend if needed for display.
                console.log('Filtro de Salida Anticipada solicitado, pero no implementado en el backend por falta de definición de horario estándar.');
            }
            if (categoryIds.length > 0) {
                whereClause.id_categoria = { [Op.in]: categoryIds };
            }
        }

        const reports = await Asistencia.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['nombre', 'apellido', 'rut'],
                    include: [{
                        model: Rol,
                        as: 'rol',
                        attributes: ['nombre']
                    }]
                },
                {
                    model: EstadoAsistencia,
                    as: 'estado',
                    attributes: ['estado']
                },
                {
                    model: CategoriaAsistencia,
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ],
            order: [['fecha', 'DESC'], ['hora_entrada', 'ASC']]
        });

        const formattedReports = reports.map(report => ({
            id: report.id,
            fecha: moment(report.fecha).format('YYYY-MM-DD'),
            hora_entrada: report.hora_entrada ? moment(report.hora_entrada, 'HH:mm:ss').format('HH:mm') : 'N/A',
            hora_salida: report.hora_salida ? moment(report.hora_salida, 'HH:mm:ss').format('HH:mm') : 'N/A',
            estado: report.estado ? report.estado.estado : 'N/A',
            categoria: report.categoria ? report.categoria.nombre : 'N/A',
            usuario_nombre: report.usuario ? `${report.usuario.nombre} ${report.usuario.apellido}` : 'N/A',
            usuario_rut: report.usuario ? report.usuario.rut : 'N/A',
            usuario_rol: report.usuario && report.usuario.rol ? report.usuario.rol.nombre : 'N/A',
        }));

        res.render('reports/absenceReports', {
            pageTitle: 'Reportes de Asistencia por Empleado',
            reports: formattedReports,
            selectedFilter: filterType // Para mantener el filtro seleccionado en la vista
        });
    } catch (error) {
        console.error('Error al obtener reportes de asistencia:', error);
        res.status(500).render('common/dashboard_error', {
            pageTitle: 'Error',
            message: 'No se pudieron cargar los reportes de asistencia.',
            error: error.message,
        });
    }
};

// Exportar reportes filtrados a PDF
const exportAbsenceReportsPdf = async (req, res) => {
    try {
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
        const filterType = req.query.filterType || '';
        const whereClause = { fecha: { [Op.gte]: sevenDaysAgo } };

        if (filterType) {
            let categoryIds = [];
            const categories = await CategoriaAsistencia.findAll({ attributes: ['id', 'nombre'] });
            const inasistenciaCategory = categories.find(cat => cat.nombre === 'Inasistencia');
            const atrasoCategory = categories.find(cat => cat.nombre === 'Atraso');

            if (filterType === 'inasistencia' && inasistenciaCategory) {
                categoryIds.push(inasistenciaCategory.id);
            } else if (filterType === 'atraso' && atrasoCategory) {
                categoryIds.push(atrasoCategory.id);
            } else if (filterType === 'ambas' && inasistenciaCategory && atrasoCategory) {
                categoryIds.push(inasistenciaCategory.id);
                categoryIds.push(atrasoCategory.id);
            } else if (filterType === 'salida_anticipada') {
                console.log('Filtro de Salida Anticipada solicitado para export, no implementado en backend.');
            }
            if (categoryIds.length > 0) {
                whereClause.id_categoria = { [Op.in]: categoryIds };
            }
        }

        const reports = await Asistencia.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['nombre', 'apellido', 'rut'],
                    include: [{
                        model: Rol,
                        as: 'rol',
                        attributes: ['nombre']
                    }]
                },
                {
                    model: EstadoAsistencia,
                    as: 'estado',
                    attributes: ['estado']
                },
                {
                    model: CategoriaAsistencia,
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ],
            order: [['fecha', 'DESC'], ['hora_entrada', 'ASC']]
        });

        const formattedReports = reports.map(report => ({
            id: report.id,
            fecha: moment(report.fecha).format('YYYY-MM-DD'),
            hora_entrada: report.hora_entrada ? moment(report.hora_entrada, 'HH:mm:ss').format('HH:mm') : 'N/A',
            hora_salida: report.hora_salida ? moment(report.hora_salida, 'HH:mm:ss').format('HH:mm') : 'N/A',
            estado: report.estado ? report.estado.estado : 'N/A',
            categoria: report.categoria ? report.categoria.nombre : 'N/A',
            usuario_nombre: report.usuario ? `${report.usuario.nombre} ${report.usuario.apellido}` : 'N/A',
            usuario_rut: report.usuario ? report.usuario.rut : 'N/A',
            usuario_rol: report.usuario && report.usuario.rol ? report.usuario.rol.nombre : 'N/A',
        }));

        // Generar PDF usando pdfkit (layout mejorado)
        const PDFDocument = require('pdfkit');

        res.setHeader('Content-Type', 'application/pdf');
        const filename = `reportes_asistencia_${moment().format('YYYYMMDD_HHmmss')}.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
        doc.pipe(res);

    let pageWidth = doc.page.width;
    let pageHeight = doc.page.height;
    const margin = doc.page.margins.left;

    // Fondo de página solicitado
    const pageBackground = '#E6DFD7';
    // Pintar fondo en la primera página
    doc.save();
    doc.rect(0, 0, pageWidth, pageHeight).fill(pageBackground);
    doc.restore();

    // Contador explícito de páginas
    let pageCount = 1;

        // Encabezado principal
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#333').text('Reportes de Asistencia', { align: 'center' });
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(10).fillColor('#000').text(`Filtro aplicado: ${filterType || 'Todos los tipos'} | Fecha desde: ${moment(sevenDaysAgo).format('YYYY-MM-DD')}`, { align: 'center' });
    doc.moveDown(0.2);
    // Fecha y hora de generación con precisión hasta segundos
    const generatedAt = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#000').text(`Documento generado el: ${generatedAt}`, { align: 'center' });
    doc.moveDown(0.6);

        // Definir columnas con anchos iniciales
        const columns = [
            { key: 'fecha', label: 'Fecha', width: 80 },
            { key: 'usuario_nombre', label: 'Usuario', width: 100 },
            { key: 'usuario_rut', label: 'RUT', width: 90 },
            { key: 'usuario_rol', label: 'Rol', width: 60 },
            { key: 'hora_entrada', label: 'Entrada', width: 55 },
            { key: 'hora_salida', label: 'Salida', width: 55 },
            { key: 'estado', label: 'Estado', width: 75 },
            { key: 'categoria', label: 'Categoría', width: 90 }
        ];

        // Ajustar automáticamente anchos para que la tabla quepa en la página
        const gap = 8; // espacio entre columnas
        const usableWidth = pageWidth - margin * 2; // ancho disponible para las columnas
        const totalRequested = columns.reduce((s, c) => s + c.width, 0) + gap * (columns.length - 1);

        if (totalRequested > usableWidth) {
            // Priorizar el ancho: mantener 'usuario_nombre' y 'categoria' lo más posible
            const priorityKeys = ['usuario_nombre', 'categoria'];
            // Sumar ancho de prioridades
            const priorityWidth = columns.filter(c => priorityKeys.includes(c.key)).reduce((s, c) => s + c.width, 0);
            const restCols = columns.filter(c => !priorityKeys.includes(c.key));
            const restWidthAvailable = usableWidth - priorityWidth - gap * (columns.length - 1);
            if (restWidthAvailable > 0) {
                // Distribuir proporcionalmente a restCols, pero con límites mínimos
                const minWidth = 40;
                const requestedRest = restCols.reduce((s, c) => s + c.width, 0);
                restCols.forEach(c => {
                    const newW = Math.max(minWidth, Math.floor((c.width / requestedRest) * restWidthAvailable));
                    c.width = newW;
                });
            } else {
                // Caso extremo: reducir todo proporcionalmente
                columns.forEach(c => {
                    c.width = Math.max(40, Math.floor((c.width / totalRequested) * usableWidth));
                });
            }
        }

        // Calcular posiciones X de columnas
        let xPositions = [];
        let curX = margin;
        for (const col of columns) {
            xPositions.push(curX);
            curX += col.width + gap; // espacio entre columnas
        }

        let y = doc.y;
        const rowPadding = 6;
        const headerHeight = 20;

        // Función para dibujar encabezado de tabla
        function drawTableHeader() {
            doc.save();
            doc.rect(margin - 2, y - 4, pageWidth - margin * 2 + 4, headerHeight).fill('#2c3e50');
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                doc.text(col.label, xPositions[i], y, { width: col.width, align: 'left' });
            }
            doc.restore();
            y += headerHeight + 6;
        }

        // Dibujar encabezado inicial
        drawTableHeader();

        doc.font('Helvetica').fontSize(9).fillColor('#000');

            if (formattedReports.length === 0) {
            doc.text('No se encontraron reportes con los filtros seleccionados.', margin, y);
            // Pie de página (número de página) usando pageCount
            // Posición segura para el pie: dentro del área imprimible (respetando margin inferior)
            const footerY = Math.max(40, pageHeight - doc.page.margins.bottom - 10);
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                const p = i + 1;
                doc.fontSize(8).fillColor('gray').text(`Página ${p} de ${pageCount}`, margin, footerY, { align: 'center', width: pageWidth - margin * 2 });
            }
            doc.end();
            return;
        }

        // Iterar filas calculando la altura necesaria para cada celda y ajustando salto de página
        for (const row of formattedReports) {
            // Preparar textos por columna
            const texts = columns.map(col => String(row[col.key] || '') );

            // Calcular la altura necesaria por cada celda usando heightOfString
            let heights = texts.map((text, i) => {
                return doc.heightOfString(text, { width: columns[i].width });
            });
            let maxCellHeight = Math.max(...heights) + rowPadding;

            // Si no hay espacio suficiente en la página, agregar nueva página y dibujar encabezado
            if (y + maxCellHeight > pageHeight - margin - 30) {
                doc.addPage();
                pageCount++;
                // actualizar dimensiones de la nueva página
                pageWidth = doc.page.width;
                pageHeight = doc.page.height;
                // Pintar fondo en la nueva página
                doc.save();
                doc.rect(0, 0, pageWidth, pageHeight).fill(pageBackground);
                doc.restore();
                y = doc.page.margins.top;
                // Dibujar header de tabla en nueva página
                drawTableHeader();
                doc.font('Helvetica').fontSize(9).fillColor('#000');
            }

            // Dibujar la fila (texto)
            for (let i = 0; i < columns.length; i++) {
                const tx = xPositions[i];
                const cw = columns[i].width;
                doc.text(texts[i], tx, y + 2, { width: cw, align: 'left' });
            }

            // Línea separadora
            y += maxCellHeight;
            doc.moveTo(margin - 2, y - 4).lineTo(pageWidth - margin + 2, y - 4).strokeColor('#e0e0e0').lineWidth(0.5).stroke();
            y += 4;
        }

        // Pie de página con número de páginas
        const footerY = Math.max(40, pageHeight - doc.page.margins.bottom - 10);
        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);
            const p = i + 1;
            doc.fontSize(8).fillColor('gray').text(`Página ${p} de ${pageCount}`, margin, footerY, { align: 'center', width: pageWidth - margin * 2 });
        }

        doc.end();

    } catch (error) {
        console.error('Error al exportar reportes a PDF:', error);
        res.status(500).render('common/dashboard_error', {
            pageTitle: 'Error al exportar PDF',
            message: 'Ocurrió un error al generar el PDF de reportes.',
            error: error.message
        });
    }
};

module.exports = {
    getAbsenceReports,
    exportAbsenceReportsPdf,
};
