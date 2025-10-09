// Archivo: config/database.js
/**
 * @file database.js
 * @description Configura la conexión a la base de datos utilizando Sequelize y las variables de entorno.
 * Este archivo es crucial para establecer la comunicación entre la aplicación Node.js y la base de datos MySQL.
 */
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Carga las variables de entorno desde el archivo .env
dotenv.config();

/**
 * Crea una instancia de Sequelize para la conexión a la base de datos.
 * Los parámetros de conexión se obtienen de las variables de entorno para mayor seguridad y flexibilidad.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos (ej: control_asistencia)
  process.env.DB_USER, // Nombre de usuario para la conexión a la base de datos
  process.env.DB_PASS, // Contraseña del usuario de la base de datos
  {
    host: process.env.DB_HOST, // Host donde se ejecuta la base de datos (ej: localhost)
    dialect: "mysql", // Dialecto de la base de datos a usar (en este caso, MySQL)
    logging: false,   // Controla si Sequelize registra las consultas SQL en la consola. Se establece en false para evitar ruido en producción.
  }
);

console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, process.env.DB_HOST);

// Exporta la instancia de Sequelize para que pueda ser utilizada en otros módulos de la aplicación (ej: para definir modelos).
module.exports = sequelize;