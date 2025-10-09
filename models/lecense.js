// Archivo: models/lecense.js
/**
 * @file lecense.js
 * @description Define el modelo `LicenciaMedica`, que representa las licencias médicas
 * presentadas por los usuarios. Este modelo almacena detalles como el folio, fechas de emisión y reposo,
 * días de reposo, diagnóstico, médico tratante y el archivo adjunto.
 */
const { DataTypes } = require("sequelize"); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require("../config/database"); // Importa la instancia de Sequelize para la conexión a la base de datos.
const User = require("./User"); // Importa el modelo User, con el que se relaciona la licencia médica.

/**
 * @model LicenciaMedica
 * @description Define el modelo `licencia_medica` en la base de datos, mapeando a la tabla `licencia_medica`.
 * Cada instancia de este modelo representa una licencia médica enviada por un usuario.
 */
const LicenciaMedica = sequelize.define('licencia_medica', {
    // ID único para cada licencia médica. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Clave foránea que referencia al ID del usuario a quien pertenece la licencia médica.
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false // No permite valores nulos, cada licencia debe estar asociada a un usuario.
    },
    // Número de folio de la licencia médica, un identificador único externo.
    folio:{
        type: DataTypes.STRING,
        allowNull: false // No permite valores nulos.
        // unique: true // Asegura que no haya folios duplicados.
    },
    // Fecha de emisión de la licencia médica.
    fecha_emision: {
        type: DataTypes.DATEONLY,
        allowNull: false // No permite valores nulos.
    },
    // Fecha de inicio del período de reposo de la licencia.
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false // No permite valores nulos.
    },
    // Fecha de finalización del período de reposo de la licencia.
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false // No permite valores nulos.
    },
    // Cantidad de días de reposo indicados en la licencia.
    dias_reposo:{
        type: DataTypes.INTEGER,
        allowNull: false // No permite valores nulos.
    },
    // Nombre del profesional de la salud que emitió la licencia.
    profesional:{
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Nombre del trabajador extraído del PDF.
    nombre_trabajador: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // RUT del trabajador extraído del PDF.
    rut_trabajador: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Edad del trabajador extraída del PDF.
    edad_trabajador: {
        type: DataTypes.INTEGER,
        allowNull: true // Permite valores nulos.
    },
    // Sexo del trabajador extraído del PDF.
    sexo_trabajador: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Dirección de reposo extraída del PDF.
    direccion_reposo: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Teléfono del trabajador o contacto extraído del PDF.
    telefono_contacto: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Nombre del archivo adjunto (ej: la imagen escaneada de la licencia).
    archivo:{
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos si no hay un archivo digital.
    },
    // Tipo de licencia (ej: "Enfermedad común", "Accidente de trabajo").
    tipo_licencia:{
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Nuevo campo para el estado de la licencia
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
        defaultValue: 'Pendiente', // Valor por defecto para nuevas licencias
        allowNull: false
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'licencia_medica' // Asegura que el nombre de la tabla en la DB sea 'licencia_medica'.
});

// --- Definición de Asociaciones ---

/**
 * @relation LicenciaMedica - User
 * Establece la relación de pertenencia: Una `LicenciaMedica` pertenece a un `User`.
 * `foreignKey: 'id_usuario'`: Indica que `id_usuario` en la tabla `licencia_medica` es la clave foránea.
 * `as: 'usuario'`: Define el alias para acceder al usuario asociado desde una instancia de `LicenciaMedica`.
 */
LicenciaMedica.belongsTo(User, {foreignKey: 'id_usuario', as: 'usuario'});

/**
 * @relation User - LicenciaMedica
 * Establece la relación inversa: Un `User` puede tener muchas `LicenciaMedica`.
 * `foreignKey: 'id_usuario'`: Indica que `id_usuario` en la tabla `licencia_medica` es la clave foránea.
 * `as: 'licencias'`: Define el alias para acceder a las licencias médicas desde una instancia de `User`.
 */
User.hasMany(LicenciaMedica, { foreignKey: 'id_usuario', as: 'licencias'});

// Exporta el modelo `LicenciaMedica` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = LicenciaMedica;
