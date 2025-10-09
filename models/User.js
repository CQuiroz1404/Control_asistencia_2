// Archivo: models/User.js
/**
 * @file User.js
 * @description Define el modelo `User`, que representa a los usuarios de la aplicación en la base de datos.
 * Este modelo almacena información personal del usuario, sus credenciales y su rol dentro del sistema.
 */
const sequelize = require('../config/database.js'); // Importa la instancia de Sequelize para la conexión a la base de datos.
const { DataTypes } = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const Rol = require('./Rol.js'); // Importa el modelo Rol, con el que se relaciona el usuario.

/**
 * @model User
 * @description Define el modelo `users` en la base de datos, mapeando a la tabla `users`.
 * Cada instancia de este modelo representa un usuario único en el sistema.
 */
const User = sequelize.define('users', {
    // ID único para cada usuario. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // RUT del usuario. Es un identificador único y no puede ser nulo.
    rut: {
        type: DataTypes.STRING,
        allowNull: false, // No permite valores nulos.
        unique: true // Asegura que no haya RUTs duplicados.
    },
    // Nombre del usuario.
    nombre: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos, puede ser actualizado después del registro.
    },
    // Apellido del usuario.
    apellido: {
        type: DataTypes.STRING,
        allowNull: true // Permite valores nulos.
    },
    // Correo electrónico del usuario. Debe ser único y no nulo.
    correo: {
        type: DataTypes.STRING,
        allowNull: true, // Permite valores nulos, puede ser actualizado después del registro.
        unique: true, // Asegura que no haya correos duplicados.
        validate: {
            isEmail: true // Valida que el formato sea de correo electrónico.
        }
    },
    // Contraseña del usuario (almacenada encriptada).
    password: {
        type: DataTypes.STRING,
        allowNull: false // No permite valores nulos, la contraseña es obligatoria.
    },
    // Secreto único para el login con QR.
    qr_login_secret: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir nulos temporalmente para la alteración de la tabla
        unique: true // Cada secreto debe ser único
    },
    // Clave foránea que referencia al ID del rol del usuario. Define el nivel de acceso y permisos.
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permite valores nulos, puede ser asignado por defecto o después.
        defaultValue: 2 // Por ejemplo, un rol por defecto para nuevos usuarios (ej: 2 = Empleado).
    },
    // Estado de actividad del usuario (activo/desactivado).
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'activo' // Por defecto, los usuarios están activos.
    }
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'users' // Asegura que el nombre de la tabla en la DB sea 'users'.
});

// --- Definición de Asociaciones ---

/**
 * @relation User - Rol
 * Establece la relación de pertenencia: Un `User` pertenece a un `Rol`.
 * `foreignKey: 'id_rol'`: Indica que `id_rol` en la tabla `users` es la clave foránea que apunta al modelo `Rol`.
 * `as: 'rol'`: Define el alias para acceder al rol asociado desde una instancia de `User` (ej: `user.rol.nombre`).
 */
User.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

/**
 * @relation Rol - User
 * Establece la relación inversa: Un `Rol` puede tener muchos `User`.
 * `foreignKey: 'id_rol'`: Indica que `id_rol` en la tabla `users` es la clave foránea.
 * `as: 'usuarios'`: Define el alias para acceder a los usuarios asociados desde una instancia de `Rol` (ej: `rol.usuarios`).
 */
Rol.hasMany(User, { foreignKey: 'id_rol', as: 'usuarios' });

// Exporta el modelo `User` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = User;
