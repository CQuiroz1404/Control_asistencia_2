// Archivo: models/asisstLicense.js
/**
 * @file asisstLicense.js
 * @description Define el modelo `AsistenciaLicencia`, que sirve como una tabla de unión
 * para establecer la relación muchos a muchos entre `LicenciaMedica` y `Asistencia`.
 * Este modelo registra qué licencias médicas están asociadas a qué registros de asistencia.
 */
const {DataTypes} = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.
const LicenciaMedica = require('./lecense'); // Importa el modelo LicenciaMedica, con el que se relaciona.
const Asistencia = require('./assist'); // Importa el modelo Asistencia, con el que se relaciona.

/**
 * @model AsistenciaLicencia
 * @description Define el modelo `asistencia_licencia` en la base de datos.
 * Esta tabla no posee una clave primaria auto-incremental, sino una clave compuesta formada por los IDs de asistencia y licencia.
 */
const AsistenciaLicencia = sequelize.define('asistencia_licencia', {
    // Columna para el ID de la asistencia. Forma parte de la clave primaria compuesta.
    id_asistencia:{
        type: DataTypes.INTEGER,
        primaryKey: true // Indica que es parte de la clave primaria.
    },
    // Columna para el ID de la licencia médica. Forma parte de la clave primaria compuesta.
    id_licencia:{
        type: DataTypes.INTEGER,
        primaryKey: true // Indica que es parte de la clave primaria.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` ya que no son necesarias para esta tabla de unión.
    tableName: 'asistencia_licencia' // Asegura que el nombre de la tabla en la DB sea 'asistencia_licencia'.
});

// --- Definición de Asociaciones ---

/**
 * @relation AsistenciaLicencia - LicenciaMedica
 * Establece la relación de pertenencia: Una `AsistenciaLicencia` pertenece a una `LicenciaMedica`.
 * `foreignKey: 'id_licencia'`: Indica que `id_licencia` en `AsistenciaLicencia` es la clave foránea.
 * `as: 'licencia'`: Define el alias para acceder a la licencia asociada desde un registro de `AsistenciaLicencia`.
 */
AsistenciaLicencia.belongsTo(LicenciaMedica, {foreignKey: 'id_licencia', as:'licencia'});

/**
 * @relation LicenciaMedica - AsistenciaLicencia
 * Establece la relación inversa: Una `LicenciaMedica` puede tener múltiples registros de `AsistenciaLicencia`.
 * `foreignKey: 'id_licencia'`: Indica que `id_licencia` es la clave foránea en `AsistenciaLicencia`.
 * `as: 'asistencias'`: Define el alias para acceder a los registros de asistencia asociados desde una licencia médica.
 */
LicenciaMedica.hasMany(AsistenciaLicencia, {foreignKey: 'id_licencia', as:'asistencias'});

/**
 * @relation AsistenciaLicencia - Asistencia
 * Establece la relación de pertenencia: Un registro de `AsistenciaLicencia` pertenece a una `Asistencia`.
 * `foreignKey: 'id_asistencia'`: Indica que `id_asistencia` en `AsistenciaLicencia` es la clave foránea.
 * `as: 'asistencia'`: Define el alias para acceder a la asistencia asociada desde un registro de `AsistenciaLicencia`.
 */
AsistenciaLicencia.belongsTo(Asistencia, {foreignKey: 'id_asistencia', as:'asistencia'});

/**
 * @relation Asistencia - AsistenciaLicencia
 * Establece la relación inversa: Una `Asistencia` puede tener múltiples registros de `AsistenciaLicencia`.
 * `foreignKey: 'id_asistencia'`: Indica que `id_asistencia` es la clave foránea en `AsistenciaLicencia`.
 * `as: 'licencias'`: Define el alias para acceder a las licencias médicas asociadas desde una asistencia.
 */
Asistencia.hasMany(AsistenciaLicencia, {foreignKey: 'id_asistencia', as:'licencias'});

// Exporta el modelo `AsistenciaLicencia` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = AsistenciaLicencia;