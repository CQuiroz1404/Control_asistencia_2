// Archivo: models/assist.js
/**
 * @file assist.js
 * @description Define el modelo `Asistencia`, que representa los registros de asistencia de los usuarios en la base de datos.
 * Este modelo almacena información como la fecha, hora de entrada, hora de salida, y el estado de la asistencia.
 */
const {DataTypes} = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.
const User = require('./User'); // Importa el modelo User, con el que se relaciona la asistencia.
const EstadoAsistencia = require('./StateAssist'); // Importa el modelo EstadoAsistencia, con el que se relaciona la asistencia.
const CategoriaAsistencia = require('./assistCategory'); // Importa el modelo CategoriaAsistencia, con el que se relaciona la asistencia.

/**
 * @model Asistencia
 * @description Define el modelo `asistencia` en la base de datos, mapeando a la tabla `asistencia`.
 * Cada instancia de este modelo representa un registro de asistencia de un usuario.
 */
const asistencia = sequelize.define('asistencia', {
    // ID único para cada registro de asistencia. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Clave foránea que referencia al ID del usuario que realizó el registro de asistencia.
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false // No permite valores nulos, cada asistencia debe estar asociada a un usuario.
    },
    // Fecha en que se registró la asistencia.
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull: false // No permite valores nulos.
    },
    // Hora de entrada registrada por el usuario.
    hora_entrada:{
        type: DataTypes.TIME,
        allowNull: true // permite valores nulos, es obligatoria para la entrada.
    },
    // Hora de salida registrada por el usuario (puede ser nula si solo se ha marcado la entrada).
    hora_salida:{
        type: DataTypes.TIME,
        allowNull: true // Permite valores nulos, ya que la salida se puede registrar más tarde.
    },
    // Clave foránea que referencia al ID del estado de asistencia (ej: Presente, Ausente, Retraso).
    id_estado:{
        type: DataTypes.INTEGER,
        allowNull: false // No permite valores nulos.
    },
    // Clave foránea que referencia al ID de la categoría de asistencia (ej: Normal, Justificada, Licencia).
    id_categoria:{
        type: DataTypes.INTEGER,
        allowNull: true // Permite valores nulos, una asistencia podría no tener una categoría específica inicialmente.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'asistencia' // Asegura que el nombre de la tabla en la DB sea 'asistencia'.
});

// --- Definición de Asociaciones ---

/**
 * @relation Asistencia - User
 * Establece la relación de pertenencia: Una `Asistencia` pertenece a un `User`.
 * `foreignKey: 'id_usuario'`: Indica que `id_usuario` en la tabla `asistencia` es la clave foránea que apunta al modelo `User`.
 * `as: 'usuario'`: Define el alias para acceder al usuario asociado desde una instancia de `Asistencia` (ej: `asistencia.usuario`).
 */
asistencia.belongsTo(User, {foreignKey: 'id_usuario', as:'usuario'});

/**
 * @relation User - Asistencia
 * Establece la relación inversa: Un `User` puede tener muchos registros de `Asistencia`.
 * `foreignKey: 'id_usuario'`: Indica que `id_usuario` en la tabla `asistencia` es la clave foránea.
 * `as: 'asistencias'`: Define el alias para acceder a los registros de asistencia desde una instancia de `User` (ej: `user.asistencias`).
 */
User.hasMany(asistencia, {foreignKey:'id_usuario', as:'asistencias'});

/**
 * @relation Asistencia - EstadoAsistencia
 * Establece la relación de pertenencia: Una `Asistencia` pertenece a un `EstadoAsistencia`.
 * `foreignKey: 'id_estado'`: Indica que `id_estado` en la tabla `asistencia` es la clave foránea que apunta al modelo `EstadoAsistencia`.
 * `as: 'estado'`: Define el alias para acceder al estado de asistencia asociado desde una instancia de `Asistencia` (ej: `asistencia.estado`).
 */
asistencia.belongsTo(EstadoAsistencia, {foreignKey: 'id_estado', as:'estado'});

/**
 * @relation EstadoAsistencia - Asistencia
 * Establece la relación inversa: Un `EstadoAsistencia` puede tener muchos registros de `Asistencia`.
 * `foreignKey: 'id_estado'`: Indica que `id_estado` en la tabla `asistencia` es la clave foránea.
 * `as: 'asistencias'`: Define el alias para acceder a los registros de asistencia desde una instancia de `EstadoAsistencia` (ej: `estadoAsistencia.asistencias`).
 */
EstadoAsistencia.hasMany(asistencia, {foreignKey: 'id_estado', as:'asistencias'});

/**
 * @relation Asistencia - CategoriaAsistencia
 * Establece la relación de pertenencia: Una `Asistencia` pertenece a una `CategoriaAsistencia`.
 * `foreignKey: 'id_categoria'`: Indica que `id_categoria` en la tabla `asistencia` es la clave foránea que apunta al modelo `CategoriaAsistencia`.
 * `as: 'categoria'`: Define el alias para acceder a la categoría de asistencia asociada desde una instancia de `Asistencia` (ej: `asistencia.categoria`).
 */
asistencia.belongsTo(CategoriaAsistencia, {foreignKey: 'id_categoria', as:'categoria'});

/**
 * @relation CategoriaAsistencia - Asistencia
 * Establece la relación inversa: Una `CategoriaAsistencia` puede tener muchos registros de `Asistencia`.
 * `foreignKey: 'id_categoria'`: Indica que `id_categoria` en la tabla `asistencia` es la clave foránea.
 * `as: 'assist'`: Define el alias para acceder a los registros de asistencia desde una instancia de `CategoriaAsistencia` (ej: `categoriaAsistencia.assist`).
 */
CategoriaAsistencia.hasMany(asistencia, {foreignKey: 'id_categoria', as:'assist'})

// Exporta el modelo `asistencia` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = asistencia;