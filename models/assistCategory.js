// Archivo: models/assistCategory.js
/**
 * @file assistCategory.js
 * @description Define el modelo `CategoriaAsistencia`, que representa las diferentes categorías
 * o tipos de asistencia que un usuario puede tener (ej: Normal, Justificada, Licencia Médica).
 * Este modelo ayuda a clasificar los registros de asistencia.
 */
const {DataTypes} = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.

/**
 * @model CategoriaAsistencia
 * @description Define el modelo `categoria_asistencia` en la base de datos, mapeando a la tabla `categoria_asistencia`.
 * Cada instancia de este modelo representa una categoría de asistencia única.
 */
const CategoriaAsistencia = sequelize.define('categoria_asistencia', {
    // ID único para cada categoría de asistencia. Es la clave primaria y se auto-incrementa.
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Nombre de la categoría de asistencia (ej: "Normal", "Justificada").
    nombre:{
        type: DataTypes.STRING,
        allowNull: false, // No permite valores nulos.
        unique: true // Asegura que no haya nombres de categoría duplicados.
    },
    // Descripción detallada de la categoría de asistencia.
    descripcion:{
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos, la descripción es opcional.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'categoria_asistencia' // Asegura que el nombre de la tabla en la DB sea 'categoria_asistencia'.
});

// Exporta el modelo `CategoriaAsistencia` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = CategoriaAsistencia;