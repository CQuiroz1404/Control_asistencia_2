// Archivo: models/Rol.js
/**
 * @file Rol.js
 * @description Define el modelo `Rol`, que representa los diferentes roles de usuario
 * dentro del sistema (ej: Administrador, Marketing, Finanzas).
 * Este modelo es fundamental para la gestión de permisos y autorización.
 */
const { DataTypes } = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.

/**
 * @model Rol
 * @description Define el modelo `rols` en la base de datos, mapeando a la tabla `rols`.
 * Cada instancia de este modelo representa un rol específico con un nombre y una descripción.
 */
const Rol = sequelize.define('rols', {
    // ID único para cada rol. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Nombre del rol (ej: "Administrador", "Marketing").
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, // No permite valores nulos.
        unique: true // Asegura que no haya nombres de rol duplicados.
    },
    // Descripción detallada del rol, explicando sus permisos o propósito.
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos, la descripción es opcional.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'rols' // Asegura que el nombre de la tabla en la DB sea 'rols'.
});

// Exporta el modelo `Rol` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = Rol;
