// Archivo: models/asisstJustification.js
/**
 * @file asisstJustification.js
 * @description Define el modelo `AsistenciaJustificacion`, que actúa como una tabla intermedia
 * para la relación muchos a muchos entre `Asistencia` y `Justificacion`.
 * Este modelo gestiona qué justificaciones corresponden a qué registros de asistencia.
 */
const { DataTypes } = require('sequelize'); // Importa DataTypes de Sequelize para definir tipos de columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.
const Asistencia = require('./assist'); // Importa el modelo Asistencia, con el que se relaciona.
const Justificacion = require('./justification'); // Importa el modelo Justificacion, con el que se relaciona.

/**
 * @model AsistenciaJustificacion
 * @description Define el modelo `asistencia_justificacion` en la base de datos.
 * Esta tabla no tiene un ID propio, sino que utiliza una clave compuesta (`id_asistencia`, `id_justificacion`).
 */
const AsistenciaJustificacion = sequelize.define('asistencia_justificacion', {
    // Columna para el ID de la asistencia. Parte de la clave primaria compuesta.
    id_asistencia:{
        type: DataTypes.INTEGER,
        primaryKey: true // Indica que es parte de la clave primaria.
    },
    // Columna para el ID de la justificación. Parte de la clave primaria compuesta.
    id_justificacion:{
        type: DataTypes.INTEGER,
        primaryKey: true // Indica que es parte de la clave primaria.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` ya que no son necesarias para esta tabla de unión.
    tableName: 'asistencia_justificacion' // Asegura que el nombre de la tabla en la DB sea 'asistencia_justificacion'.
});

// --- Definición de Asociaciones ---

/**
 * @relation AsistenciaJustificacion - Asistencia
 * Establece la relación de pertenencia: Una `AsistenciaJustificacion` pertenece a una `Asistencia`.
 * `foreignKey: 'id_asistencia'`: Indica que `id_asistencia` en `AsistenciaJustificacion` es la clave foránea.
 * `as: 'asistencia'`: Define el alias para acceder a la asistencia asociada desde una justificación.
 */
AsistenciaJustificacion.belongsTo(Asistencia, {foreignKey: 'id_asistencia', as:'asistencia'});

/**
 * @relation Asistencia - AsistenciaJustificacion
 * Establece la relación inversa: Una `Asistencia` puede tener múltiples `AsistenciaJustificacion`.
 * `foreignKey: 'id_asistencia'`: Indica que `id_asistencia` es la clave foránea en `AsistenciaJustificacion`.
 * `as: 'justificaciones'`: Define el alias para acceder a las justificaciones desde una asistencia.
 */
Asistencia.hasMany(AsistenciaJustificacion, {foreignKey: 'id_asistencia', as:'justificaciones'});

/**
 * @relation AsistenciaJustificacion - Justificacion
 * Establece la relación de pertenencia: Una `AsistenciaJustificacion` pertenece a una `Justificacion`.
 * `foreignKey: 'id_justificacion'`: Indica que `id_justificacion` en `AsistenciaJustificacion` es la clave foránea.
 * `as: 'justificacion'`: Define el alias para acceder a la justificación asociada desde una asistencia-justificación.
 */
AsistenciaJustificacion.belongsTo(Justificacion, {foreignKey: 'id_justificacion', as:'justificacion'});

/**
 * @relation Justificacion - AsistenciaJustificacion
 * Establece la relación inversa: Una `Justificacion` puede tener múltiples `AsistenciaJustificacion`.
 * `foreignKey: 'id_justificacion'`: Indica que `id_justificacion` es la clave foránea en `AsistenciaJustificacion`.
 * `as: 'asistencias'`: Define el alias para acceder a los registros de asistencia asociados desde una justificación.
 */
Justificacion.hasMany(AsistenciaJustificacion, {foreignKey:'id_justificacion', as:'asistencias'});

// Exporta el modelo `AsistenciaJustificacion` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = AsistenciaJustificacion;