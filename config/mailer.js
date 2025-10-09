// Archivo: config/mailer.js
// Configuración y exportación de un transporter de nodemailer usando variables de entorno.
const nodemailer = require('nodemailer');
require('dotenv').config();

// Las credenciales deben ser provistas a través de variables de entorno.
const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : undefined;
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;
const from = process.env.MAIL_FROM;

let transporter;
try {
    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: user && pass ? { user, pass } : undefined
    });
    // Verificar configuración del transporter
    transporter.verify().then(() => {
        console.log(`Transporter de correo listo (host: ${host}, user: ${user})`);
    }).catch(err => {
        console.warn('Advertencia: no se pudo verificar transporter de correo:', err && err.message ? err.message : err);
    });
} catch (err) {
    console.error('Error creando transporter de nodemailer:', err);
}

module.exports = {
    transporter,
    from
};
