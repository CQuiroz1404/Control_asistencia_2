const LicenciaMedica = require('../models/lecense'); // Importa el modelo de LicenciaMedica
const { extraerDatosLicencia } = require('../helpers/pdfExtractorServer'); // Use server-side extractor helper
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs'); // Importa pdf.js para el backend
const fs = require('fs').promises; // Para trabajar con el sistema de archivos de forma asíncrona
const multer = require('multer'); // Middleware para manejar la subida de archivos
const path = require('path'); // Para manejar rutas de archivos

// Configuración de Multer para la subida de archivos
// Se configura el almacenamiento en disco, especificando el destino y el nombre del archivo.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const userId = (req.user && req.user.id) ? String(req.user.id) : 'unknown';
            const dir = path.join('uploads_licmed', userId);
            // Asegurar que el directorio por usuario exista
            require('fs').mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } catch (e) {
            console.error('Error creando directorio de uploads_licmed por usuario:', e);
            cb(null, path.join('uploads_licmed'));
        }
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único para evitar colisiones
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

const createLicense = async (req, res) => {
    try {
        // Se espera que el archivo PDF se suba con el nombre de campo 'archivoLicencia'
        // Multer añade el archivo subido a req.file
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo PDF.' });
        }

        // Preferir el id del usuario proveniente del token (req.user) para evitar suplantación
        let id_usuario = null;
        if (req.user && req.user.id) {
            id_usuario = Number(req.user.id);
        } else if (req.body && req.body.id_usuario) {
            id_usuario = Number(req.body.id_usuario);
        }

        console.log('req.user:', req.user);
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        // Validar id_usuario
        if (!id_usuario || !Number.isInteger(id_usuario) || id_usuario <= 0) {
            // Si no hay ID de usuario válido, eliminar el archivo subido para evitar basura
            if (req.file && req.file.path) await fs.unlink(req.file.path);
            return res.status(400).json({ error: 'ID de usuario no proporcionado o inválido.' });
        }

        // Si el body llevaba un id diferente al del token, loggear para auditoría
        if (req.body && req.body.id_usuario && Number(req.body.id_usuario) !== id_usuario) {
            console.warn(`Advertencia: el id_usuario enviado en el body (${req.body.id_usuario}) difiere del id del token (${id_usuario}). Se usará el id del token.`);
        }

        const pdfPath = req.file.path; // Ruta temporal del archivo PDF subido por Multer

        // Leer el contenido del PDF
        const data = new Uint8Array(await fs.readFile(pdfPath));
        const loadingTask = pdfjsLib.getDocument({ data: data });
        const pdf = await loadingTask.promise;

        let textoCompleto = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            textoCompleto += pageText + '\n';
        }

        // Extraer datos de la licencia utilizando la función importada
        const datosExtraidos = extraerDatosLicencia(textoCompleto);
        console.log('Datos extraídos del PDF:', datosExtraidos);

        // Helper para normalizar fechas a YYYY-MM-DD (espera dd-mm-yyyy o dd/mm/yyyy)
        const parseFecha = (f) => {
            if (!f || f === 'No encontrado') return null;
            // Acepta formatos dd-mm-yyyy o dd/mm/yyyy
            const m = f.match(/(\d{2})[-\/](\d{2})[-\/](\d{4})/);
            if (!m) return null;
            return `${m[3]}-${m[2]}-${m[1]}`; // YYYY-MM-DD
        };

        // Validar que los campos obligatorios no sean 'No encontrado'
        const camposObligatorios = [
            { nombre: 'folio', valor: datosExtraidos.folio },
            { nombre: 'fecha_emision', valor: datosExtraidos.fechaEmision },
            { nombre: 'fecha_inicio', valor: datosExtraidos.inicioReposo },
            { nombre: 'fecha_fin', valor: datosExtraidos.fechaTermino },
            { nombre: 'dias_reposo', valor: datosExtraidos.dias }
        ];

        for (const campo of camposObligatorios) {
            if (campo.valor === 'No encontrado' || !campo.valor) {
                await fs.unlink(pdfPath); // Eliminar el archivo subido
                return res.status(400).json({ error: `Falta información obligatoria: ${campo.nombre}. No se pudo extraer del PDF.` });
            }
        }

        // Mapear los datos extraídos a los campos del modelo LicenciaMedica
        const nuevaLicencia = await LicenciaMedica.create({
            id_usuario: id_usuario,
            folio: datosExtraidos.folio !== 'No encontrado' ? datosExtraidos.folio : null,
            fecha_emision: parseFecha(datosExtraidos.fechaEmision),
            fecha_inicio: parseFecha(datosExtraidos.inicioReposo),
            fecha_fin: parseFecha(datosExtraidos.fechaTermino),
            dias_reposo: datosExtraidos.dias !== 'No encontrado' ? parseInt(datosExtraidos.dias) : null,
            profesional: datosExtraidos.profesional !== 'No encontrado' ? datosExtraidos.profesional : null,
            nombre_trabajador: datosExtraidos.nombre !== 'No encontrado' ? datosExtraidos.nombre : null,
            rut_trabajador: datosExtraidos.rut !== 'No encontrado' ? datosExtraidos.rut : null,
            edad_trabajador: datosExtraidos.edad !== 'No encontrado' ? parseInt(datosExtraidos.edad) : null,
            sexo_trabajador: datosExtraidos.sexo !== 'No encontrado' ? datosExtraidos.sexo : null,
            direccion_reposo: datosExtraidos.direccion !== 'No encontrado' ? datosExtraidos.direccion : null,
            telefono_contacto: datosExtraidos.telefono !== 'No encontrado' ? datosExtraidos.telefono : null,
            // Guardar ruta relativa por usuario: "<id_usuario>/<filename>"
            archivo: `${id_usuario}/${req.file.filename}`,
            tipo_licencia: datosExtraidos.tipoLicencia !== 'No encontrado' ? datosExtraidos.tipoLicencia : null,
        });

        res.status(201).json({ message: 'Licencia creada con éxito', licencia: nuevaLicencia });
    } catch (error) {
        console.error('Error al crear licencia:', error && error.stack ? error.stack : error);
        if (error && error.original) {
            console.error('SQL error details:', error.original);
        }
        // Si hubo un error y el archivo temporal existe, intentar eliminarlo
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error al eliminar archivo temporal:', unlinkError);
            }
        }
        res.status(500).json({ error: 'Error interno del servidor al crear licencia' });
    }
};

module.exports = { createLicense, upload };
