// Archivo: models/HoursWork.js
/**
 * @file HoursWork.js
 * @description Define el modelo `HoursWorking` (Horas Trabajadas), que representa los horarios
 * de entrada y salida predefinidos o registrados para los empleados.
 * Este modelo podría ser usado para comparar la asistencia real con los horarios esperados.
 */

const { DataTypes } = require('sequelize'); // Importa DataTypes de Sequelize para definir los tipos de datos de las columnas.
const sequelize = require('../config/database'); // Importa la instancia de Sequelize para la conexión a la base de datos.

/**
 * @model HoursWorking
 * @description Define el modelo `HorasTrabajadas` en la base de datos, mapeando a la tabla `HorasTrabajadas`.
 * Cada instancia representa un registro de horas de trabajo, posiblemente predefinido o un turno.
 */
const HoursWorking = sequelize.define('HorasTrabajadas', {
    // ID único para cada registro de horas trabajadas. Es la clave primaria y se auto-incrementa.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que es la clave primaria.
        autoIncrement: true // Hace que el ID se genere automáticamente.
    },
    // Hora de entrada. Almacenada como STRING para flexibilidad, pero podría ser TIME.
    entrada: {
        type: DataTypes.STRING,
        allowNull: false // No permite valores nulos, la hora de entrada es obligatoria.
    },
    // Hora de salida. Almacenada como STRING para flexibilidad, pero podría ser TIME.
    salida: {
        type: DataTypes.STRING,
        allowNull: false // No permite valores nulos, la hora de salida es obligatoria.
    },
}, {
    timestamps: false, // Deshabilita las columnas `createdAt` y `updatedAt` gestionadas por Sequelize.
    tableName: 'HorasTrabajadas' // Asegura que el nombre de la tabla en la DB sea 'HorasTrabajadas'.
});

// Exporta el modelo `HoursWorking` para que pueda ser utilizado en otros módulos de Sequelize y controladores.
module.exports = HoursWorking;
