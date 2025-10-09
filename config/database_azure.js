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
 * Configuración de conexión pensada para MySQL en Azure.
 * Usa variables de entorno por seguridad. Si no están definidas, se aplican valores por defecto razonables.
 * Variables esperadas (puedes añadirlas a tu .env):
 *  - DB_NAME
 *  - DB_USER
 *  - DB_PASS
 *  - DB_HOST (ej: dev-enterprice-cli.mysql.database.azure.com)
 *  - DB_PORT (opcional, por defecto 3306)
 *  - DB_SSL (opcional, 'true' por defecto en Azure)
 */

const DB_NAME = process.env.DB_NAME || "nombre_de_tu_base";
const DB_USER = process.env.DB_USER || "RooterCLI";
const DB_PASS = process.env.DB_PASS || "tu-password-aqui";
const DB_HOST = process.env.DB_HOST || "dev-enterprice-cli.mysql.database.azure.com";
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const DB_SSL = process.env.DB_SSL ? process.env.DB_SSL === "true" : true;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: false, // quita logs de SQL en consola
  dialectOptions: {
    // En Azure MySQL la conexión TLS/SSL está habilitada por defecto.
    ssl: DB_SSL
      ? {
          rejectUnauthorized: true,
        }
      : undefined,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Si se ejecuta este archivo directamente (node config/database.js), realiza una prueba de conexión.
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("✅ Conexión establecida con MySQL en Azure");
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      // Salimos con código distinto de cero para que la CI o scripts detecten el fallo
      process.exit(1);
    } finally {
      // Cerrar conexión si fue abierta
      try {
        await sequelize.close();
      } catch (e) {
        // ignore
      }
    }
  })();
}

// Exporta la instancia de Sequelize para que pueda ser utilizada en otros módulos de la aplicación.
module.exports = sequelize;