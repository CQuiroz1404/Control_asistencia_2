// Archivo: models/justification.js
/**
 * @file justification.js
 * @description Define el modelo `Justificacion`, que representa las justificaciones comunes
 * presentadas por los usuarios para ausencias o retrasos.
 * Este modelo almacena detalles como el motivo, las fechas y un archivo adjunto si aplica.
 */
const {DataTypes} = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.
const User = require('./User'); // Importa el modelo User, con el que se relaciona la justificación.

/**
 * @model Justificacion
 * @description Define el modelo `justificacion_comun` en la base de datos, mapeando a la tabla `justificacion_comun`.
 * Cada instancia de este modelo representa una solicitud de justificación por parte de un usuario.
 */
const Justificacion = sequelize.define('justificacion_comun', {
    // ID único para cada justificación. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Clave foránea que referencia al ID del usuario que solicita la justificación.
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false // No permite valores nulos, cada justificación debe estar asociada a un usuario.
    },
    // Fecha en que la justificación fue solicitada.
    // Fecha de inicio del período que la justificación cubre.
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false // No permite valores nulos.
    },
    // Fecha de fin del período que la justificación cubre.
    fecha_fin:{
        type: DataTypes.DATE,
        allowNull: false // No permite valores nulos.
    },
    // Motivo de la justificación (ej: "Enfermedad", "Asunto personal").
    motivo:{
        type: DataTypes.STRING,
        allowNull: false // No permite valores nulos.
    },
    // Nombre del archivo adjunto (ej: certificado médico), si aplica.
    archivo:{
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos si no hay un archivo adjunto.
    },
    // Estado actual de la justificación (ej: "Pendiente", "Aprobada", "Rechazada").
    estado:{
        type: DataTypes.STRING,
        allowNull: false, // No permite valores nulos.
        defaultValue: 'Pendiente' // Valor por defecto si no se especifica.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'justificacion_comun' // Asegura que el nombre de la tabla en la DB sea 'justificacion_comun'.
});

// --- Definición de Asociaciones ---

/**
 * @relation Justificacion - User
 * Establece la relación de pertenencia: Una `Justificacion` pertenece a un `User`.
 * `foreignKey: 'id_usuario'`: Indica que `id_usuario` en la tabla `justificacion_comun` es la clave foránea.
 * `as: 'usuario'`: Define el alias para acceder al usuario asociado desde una instancia de `Justificacion`.
 */
Justificacion.belongsTo(User, {foreignKey: 'id_usuario', as: 'usuario'});

/**
 * @relation User - Justificacion
 * Establece la relación inversa: Un `User` puede tener muchas `Justificacion`.
 * `foreignKey: 'id_usuario'`: Indica que `id_usuario` en la tabla `justificacion_comun` es la clave foránea.
 * `as: 'justificaciones'`: Define el alias para acceder a las justificaciones desde una instancia de `User`.
 */
User.hasMany(Justificacion, { foreignKey: 'id_usuario', as: 'justificaciones'});

// Exporta el modelo `Justificacion` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = Justificacion;