// Archivo: controllers/licenseAdminController.js
/**
 * @description Controlador admin para listar licencias médicas y actualizar su estado.
 */
const LicenciaMedica = require('../models/lecense');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const renderAdminLicenses = async (req, res) => {
    try {
        res.render('admin/licencias');
    } catch (error) {
        console.error('Error al renderizar licencias:', error);
        res.status(500).render('common/dashboard_error', { message: 'Error al cargar licencias.' });
    }
};

const getAllLicenses = async (req, res) => {
    try {
        const licencias = await LicenciaMedica.findAll({
            include: [{ model: User, as: 'usuario', attributes: ['id','rut','nombre','apellido','correo'] }],
            order: [['fecha_emision', 'DESC']]
        });
        res.json({ licencias: licencias.map(l => l.toJSON()) });
    } catch (error) {
        console.error('Error al obtener licencias:', error);
        res.status(500).json({ error: 'Error al obtener licencias.' });
    }
};

const updateLicenseStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const allowed = ['Pendiente', 'Aprobada', 'Rechazada'];
    if (!allowed.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido.' });
    }
    try {
        const licencia = await LicenciaMedica.findByPk(id);
        if (!licencia) return res.status(404).json({ error: 'Licencia no encontrada.' });

        // Verificar si el usuario logueado está intentando editar su propia licencia
        if (req.user && licencia.id_usuario === req.user.id) {
            return res.status(403).json({ error: 'No puedes modificar el estado de tu propia licencia.' });
        }

        licencia.estado = estado;
        await licencia.save();
        res.json({ message: 'Estado actualizado', licencia });
    } catch (error) {
        console.error('Error al actualizar estado de licencia:', error);
        res.status(500).json({ error: 'Error al actualizar estado.' });
    }
};

module.exports = {
    renderAdminLicenses,
    getAllLicenses,
    updateLicenseStatus
};

/**
 * Descarga/visualiza el archivo asociado a una licencia por ID
 */
module.exports.downloadLicenseFile = async (req, res) => {
    try {
        const { id } = req.params;
        const licencia = await LicenciaMedica.findByPk(id);
        if (!licencia || !licencia.archivo) {
            return res.status(404).send('Archivo no encontrado');
        }
        // licencia.archivo puede ser "<id_usuario>/<filename>" o solo "filename"
        const rawArchivo = String(licencia.archivo);
        const safeParts = rawArchivo.split(/[\\/]/).filter(Boolean);
        const candidates = [
            path.join(__dirname, '..', 'uploads_licmed', ...safeParts),
            path.join(process.cwd(), 'uploads_licmed', ...safeParts),
            licencia.id_usuario ? path.join(__dirname, '..', 'uploads_licmed', String(licencia.id_usuario), rawArchivo) : null,
            licencia.id_usuario ? path.join(process.cwd(), 'uploads_licmed', String(licencia.id_usuario), rawArchivo) : null
        ].filter(Boolean);

        let foundPath = null;
        for (const p of candidates) {
            if (fs.existsSync(p)) { foundPath = p; break; }
        }

        if (!foundPath) {
            console.warn('Archivo de licencia no encontrado', {
                id: licencia.id,
                id_usuario: licencia.id_usuario,
                archivo: rawArchivo,
                candidates
            });
            return res.status(404).send('Archivo no encontrado');
        }
        return res.sendFile(path.resolve(foundPath));
    } catch (error) {
        console.error('Error al servir archivo de licencia:', error);
        return res.status(500).send('Error al obtener el archivo');
    }
};


