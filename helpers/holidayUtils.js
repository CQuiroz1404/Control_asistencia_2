// helpers/holidayUtils.js
const moment = require('moment-timezone');
const chileanHolidaysData = require('./chileanHolidays.json'); // Importar el archivo JSON local

const getChileanHolidays = async (year = moment().year()) => {
    try {
        // Filtrar los feriados para el año actual del archivo JSON estático
        return chileanHolidaysData
            .filter(holiday => moment(holiday.fecha).year() === year)
            .map(holiday => ({
                title: holiday.nombre,
                start: holiday.fecha,
                backgroundColor: '#007bff', // Color para feriados
                borderColor: '#007bff',
                allDay: true
            }));
    } catch (error) {
        console.error('Error al obtener los feriados de Chile desde el archivo local:', error);
        return [];
    }
};

const isHoliday = async (date) => {
    const year = moment(date).year();
    const holidays = await getChileanHolidays(year);
    const dateString = moment(date).format('YYYY-MM-DD');
    return holidays.some(holiday => holiday.start === dateString);
};

module.exports = {
    getChileanHolidays,
    isHoliday
};
