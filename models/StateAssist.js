// Archivo: models/StateAssist.js
/**
 * @file StateAssist.js
 * @description Define el modelo `EstadoAsistencia`, que representa los posibles estados
 * que un registro de asistencia puede tener (ej: Presente, Ausente, Justificado, Vacaciones).
 * Este modelo es clave para categorizar y entender la situación de la asistencia de un usuario.
 */
const { DataTypes } = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database.js'); // Importa la instancia de Sequelize para la conexión a la base de datos.

/**
 * @model EstadoAsistencia
 * @description Define el modelo `EstadoAsistencia` en la base de datos, mapeando a la tabla `EstadoAsistencia`.
 * Cada instancia de este modelo representa un estado de asistencia único.
 */
const EstadoAsistencia = sequelize.define('EstadoAsistencia', {
    // ID único para cada estado de asistencia. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Nombre del estado de asistencia (ej: "Presente", "Ausente", "Justificado").
    estado: {
        type: DataTypes.STRING,
        allowNull: false, // No permite valores nulos.
        unique: true // Asegura que no haya estados duplicados.
    },
    // Descripción detallada del estado de asistencia.
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos, la descripción es opcional.
    },
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'EstadoAsistencia' // Asegura que el nombre de la tabla en la DB sea 'EstadoAsistencia'.
});

// Exporta el modelo `EstadoAsistencia` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = EstadoAsistencia;
