const moment = require('moment-timezone');

// Zona horaria usada por la aplicación (Santiago de Chile)
const ZONE = 'America/Santiago';

/**
 * Devuelve true si la hora actual en la zona ZONE está dentro del periodo bloqueado:
 * desde las 22:00 (inclusive) hasta las 06:00 (exclusive).
 */
function isAccessBlockedNow() {
  const now = moment().tz(ZONE);
  const hour = now.hour(); // 0-23
  return (hour >= 22) || (hour < 6);
}

/**
 * Devuelve los milisegundos restantes hasta las 22:00 del mismo día (si aún no llegó)
 * o hasta las 22:00 del día siguiente si ya pasó.
 */
function msUntilNext22() {
  const now = moment().tz(ZONE);
  let target = now.clone().hour(22).minute(0).second(0).millisecond(0);
  if (now.isAfter(target)) {
    target = target.add(1, 'day');
  }
  return target.diff(now);
}

module.exports = { isAccessBlockedNow, msUntilNext22 };
