-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para asistencia
CREATE DATABASE IF NOT EXISTS `asistencia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `asistencia`;

-- Volcando estructura para tabla asistencia.asistencia
CREATE TABLE IF NOT EXISTS `asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `id_estado` int NOT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_estado` (`id_estado`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `asistencia_ibfk_101` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_104` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_106` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_107` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_108` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_asistencia` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_11` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_14` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_17` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_20` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_23` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_26` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_29` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_32` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_35` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_38` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_41` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_44` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_47` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_5` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_50` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_53` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_56` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_59` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_62` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_65` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_68` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_71` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_74` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_77` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_8` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_80` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_83` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_86` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_89` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_92` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_95` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_98` FOREIGN KEY (`id_estado`) REFERENCES `estadoasistencia` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.asistencia: ~29 rows (aproximadamente)
INSERT INTO `asistencia` (`id`, `id_usuario`, `fecha`, `hora_entrada`, `hora_salida`, `id_estado`, `id_categoria`) VALUES
	(3, 1, '2025-09-20', '08:00:00', '17:31:00', 1, 2),
	(4, 2, '2025-09-20', '08:15:00', '17:31:00', 3, 2),
	(5, 3, '2025-09-20', '08:05:00', '17:31:00', 2, 2),
	(6, 4, '2025-09-20', '08:10:00', '17:31:00', 4, 2),
	(9, 3, '2025-09-21', '09:40:00', '16:55:00', 1, 6),
	(10, 4, '2025-09-21', '08:10:00', '17:05:00', 2, 3),
	(11, 1, '2025-09-19', '08:00:00', '17:34:00', 1, 1),
	(12, 2, '2025-09-19', '08:10:00', '17:05:00', 3, 3),
	(13, 3, '2025-09-19', NULL, NULL, 2, 5),
	(14, 4, '2025-09-19', NULL, NULL, 4, 5),
	(15, 1, '2025-09-18', '08:00:00', '17:55:36', 1, 2),
	(16, 2, '2025-09-18', '08:25:00', '17:10:00', 5, 3),
	(17, 3, '2025-09-18', '08:10:00', '17:00:00', 1, 3),
	(18, 4, '2025-09-18', NULL, NULL, 2, 5),
	(19, 1, '2025-09-17', '08:05:00', '18:00:23', 1, 2),
	(20, 2, '2025-09-17', NULL, NULL, 3, 5),
	(21, 3, '2025-09-17', '09:41:30', '17:10:00', 4, 6),
	(22, 4, '2025-09-17', '09:43:29', '17:00:00', 1, 6),
	(23, 1, '2025-09-16', '08:10:00', '17:10:00', 5, 3),
	(24, 2, '2025-09-16', '08:05:00', '17:45:23', 1, 2),
	(25, 3, '2025-09-16', NULL, NULL, 2, 5),
	(26, 4, '2025-09-16', NULL, NULL, 3, 5),
	(28, 1, '2025-09-21', '02:43:15', '02:43:24', 1, 3),
	(29, 1, '2025-09-22', '23:55:09', '23:57:49', 1, 4),
	(32, 1, '2025-09-23', '00:58:53', '00:58:55', 1, 3),
	(33, 1, '2025-09-24', '19:26:31', '19:26:36', 1, 4),
	(34, 2, '2025-09-24', '19:28:55', '19:29:01', 1, 4),
	(35, 4, '2025-09-24', '19:29:16', '19:29:20', 1, 4),
	(36, 10, '2025-09-24', '19:31:07', '19:31:09', 1, 4);

-- Volcando estructura para tabla asistencia.categoria_asistencia
CREATE TABLE IF NOT EXISTS `categoria_asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.categoria_asistencia: ~8 rows (aproximadamente)
INSERT INTO `categoria_asistencia` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Entrada Normal', 'Marcaje de entrada en horario establecido'),
	(2, 'Salida Normal', 'Marcaje de salida en horario establecido'),
	(3, 'Salida Anticipada', 'Salida con anterioridad al horario laboral definido'),
	(4, 'Atraso', 'Entrada posterior al horario laboral definido'),
	(5, 'Inasistencia', 'Día completo sin presentarse'),
	(6, 'atrasado y salida anticipada', 'si llega atrasado y sale anticipadamente'),
	(7, 'Falta Justificada Licencia Medica', 'Falta aprobada por licencia medica'),
	(8, 'Falta Justificada Inasistencia', 'Falta aprobada por inasistencia');

-- Volcando estructura para tabla asistencia.estadoasistencia
CREATE TABLE IF NOT EXISTS `estadoasistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `estado` (`estado`),
  UNIQUE KEY `estado_2` (`estado`),
  UNIQUE KEY `estado_3` (`estado`),
  UNIQUE KEY `estado_4` (`estado`),
  UNIQUE KEY `estado_5` (`estado`),
  UNIQUE KEY `estado_6` (`estado`),
  UNIQUE KEY `estado_7` (`estado`),
  UNIQUE KEY `estado_8` (`estado`),
  UNIQUE KEY `estado_9` (`estado`),
  UNIQUE KEY `estado_10` (`estado`),
  UNIQUE KEY `estado_11` (`estado`),
  UNIQUE KEY `estado_12` (`estado`),
  UNIQUE KEY `estado_13` (`estado`),
  UNIQUE KEY `estado_14` (`estado`),
  UNIQUE KEY `estado_15` (`estado`),
  UNIQUE KEY `estado_16` (`estado`),
  UNIQUE KEY `estado_17` (`estado`),
  UNIQUE KEY `estado_18` (`estado`),
  UNIQUE KEY `estado_19` (`estado`),
  UNIQUE KEY `estado_20` (`estado`),
  UNIQUE KEY `estado_21` (`estado`),
  UNIQUE KEY `estado_22` (`estado`),
  UNIQUE KEY `estado_23` (`estado`),
  UNIQUE KEY `estado_24` (`estado`),
  UNIQUE KEY `estado_25` (`estado`),
  UNIQUE KEY `estado_26` (`estado`),
  UNIQUE KEY `estado_27` (`estado`),
  UNIQUE KEY `estado_28` (`estado`),
  UNIQUE KEY `estado_29` (`estado`),
  UNIQUE KEY `estado_30` (`estado`),
  UNIQUE KEY `estado_31` (`estado`),
  UNIQUE KEY `estado_32` (`estado`),
  UNIQUE KEY `estado_33` (`estado`),
  UNIQUE KEY `estado_34` (`estado`),
  UNIQUE KEY `estado_35` (`estado`),
  UNIQUE KEY `estado_36` (`estado`),
  UNIQUE KEY `estado_37` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.estadoasistencia: ~5 rows (aproximadamente)
INSERT INTO `estadoasistencia` (`id`, `estado`, `descripcion`) VALUES
	(1, 'Presente', 'El trabajador se encuentra en su puesto de trabajo'),
	(2, 'Ausente', 'El trabajador no se presentó y no tiene justificación'),
	(3, 'Justificado', 'El trabajador no asistió, pero presentó una justificación válida'),
	(4, 'Licencia Médica', 'El trabajador no asistió por licencia médica'),
	(5, 'Permiso Administrativo', 'Ausencia autorizada por motivos administrativos');

-- Volcando estructura para tabla asistencia.horastrabajadas
CREATE TABLE IF NOT EXISTS `horastrabajadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entrada` varchar(255) DEFAULT NULL,
  `salida` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.horastrabajadas: ~1 rows (aproximadamente)
INSERT INTO `horastrabajadas` (`id`, `entrada`, `salida`) VALUES
	(1, '09:30:00', '17:30:00');

-- Volcando estructura para tabla asistencia.justificacion_comun
CREATE TABLE IF NOT EXISTS `justificacion_comun` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `justificacion_comun_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.justificacion_comun: ~11 rows (aproximadamente)
INSERT INTO `justificacion_comun` (`id`, `id_usuario`, `fecha_inicio`, `fecha_fin`, `motivo`, `archivo`, `estado`) VALUES
	(7, 4, '2025-09-27 00:00:00', '2025-09-30 00:00:00', 'Me quede dormio', '4/1758760657868-IEI-094_E1_S1_1_1_Evaluacion 1 de empleabilidad..docx', 'Aprobada'),
	(8, 1, '2025-09-10 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio', '1/1758760713276-IEI-094_E1_S1_1_1_Evaluacion 1 de empleabilidad..docx', 'Pendiente'),
	(9, 1, '2025-09-10 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio', '1/1758760717317-IEI-094_E1_S1_1_1_Evaluacion 1 de empleabilidad..docx', 'Pendiente'),
	(10, 1, '2025-09-10 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio', '1/1758760718657-IEI-094_E1_S1_1_1_Evaluacion 1 de empleabilidad..docx', 'Pendiente'),
	(11, 1, '2025-09-10 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio', '1/1758760719720-IEI-094_E1_S1_1_1_Evaluacion 1 de empleabilidad..docx', 'Pendiente'),
	(12, 1, '2025-09-02 00:00:00', '2025-09-16 00:00:00', 'Me quede dormio parte 2', '1/1758760940408-IEI-075_U1_S4_1_4_PAUTA DE ACTIVIDAD.docx', 'Pendiente'),
	(13, 1, '2025-09-02 00:00:00', '2025-09-16 00:00:00', 'Me quede dormio parte 2', '1/1758760978554-IEI-075_U1_S4_1_4_PAUTA DE ACTIVIDAD.docx', 'Pendiente'),
	(14, 1, '2025-09-02 00:00:00', '2025-09-16 00:00:00', 'Me quede dormio parte 2', '1/1758761148814-IEI-075_U1_S4_1_4_PAUTA DE ACTIVIDAD.docx', 'Pendiente'),
	(15, 1, '2025-09-09 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio parte 2', '1/1758761171745-reportes_asistencia_20250924_205659.pdf', 'Pendiente'),
	(16, 1, '2025-09-09 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio parte 2', '1/1758761474397-reportes_asistencia_20250924_205659.pdf', 'Rechazada'),
	(17, 1, '2025-09-09 00:00:00', '2025-09-25 00:00:00', 'Me quede dormio parte 2', '1/1758761497151-reportes_asistencia_20250924_205659.pdf', 'Aprobada');

-- Volcando estructura para tabla asistencia.licencia_medica
CREATE TABLE IF NOT EXISTS `licencia_medica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `folio` varchar(255) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `dias_reposo` int NOT NULL,
  `profesional` varchar(255) DEFAULT NULL,
  `nombre_trabajador` varchar(255) DEFAULT NULL,
  `rut_trabajador` varchar(255) DEFAULT NULL,
  `edad_trabajador` int DEFAULT NULL,
  `sexo_trabajador` varchar(255) DEFAULT NULL,
  `direccion_reposo` varchar(255) DEFAULT NULL,
  `telefono_contacto` varchar(255) DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL,
  `tipo_licencia` varchar(255) DEFAULT NULL,
  `estado` enum('Pendiente','Aprobada','Rechazada') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `licencia_medica_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.licencia_medica: ~15 rows (aproximadamente)
INSERT INTO `licencia_medica` (`id`, `id_usuario`, `folio`, `fecha_emision`, `fecha_inicio`, `fecha_fin`, `dias_reposo`, `profesional`, `nombre_trabajador`, `rut_trabajador`, `edad_trabajador`, `sexo_trabajador`, `direccion_reposo`, `telefono_contacto`, `archivo`, `tipo_licencia`, `estado`) VALUES
	(2, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758511557298-MedicaLIcencia.pdf', 'MIXTA', 'Aprobada'),
	(3, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758511573088-MedicaLIcencia.pdf', 'MIXTA', 'Rechazada'),
	(4, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758514428385-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(5, 10, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758515004325-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(6, 4, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758515054675-MedicaLIcencia.pdf', 'MIXTA', 'Rechazada'),
	(7, 2, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758515085097-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(8, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758739321990-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(9, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758739366398-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(10, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758740223389-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(11, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1758743112549-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(12, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1/1758746093044-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(13, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1/1758746194617-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(14, 2, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '2/1758753264681-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(15, 1, '5039680-0', '2021-01-22', '2021-01-20', '2021-02-02', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '1/1758760267130-MedicaLIcencia.pdf', 'MIXTA', 'Pendiente'),
	(16, 4, '5039680-0', '2021-01-22', '2025-09-15', '2025-09-30', 14, 'Ingrid Natalia Millar Ferrada', 'AUGUSTO HERNÁN LATORRE VALDEBENITO', '20996578-K', 18, 'Masculino', 'SAN MARTIN 1239 Victoria', '944483591', '4/1758760374856-MedicaLIcencia.pdf', 'MIXTA', 'Aprobada');

-- Volcando estructura para tabla asistencia.rols
CREATE TABLE IF NOT EXISTS `rols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`),
  UNIQUE KEY `nombre_37` (`nombre`),
  UNIQUE KEY `nombre_38` (`nombre`),
  UNIQUE KEY `nombre_39` (`nombre`),
  UNIQUE KEY `nombre_40` (`nombre`),
  UNIQUE KEY `nombre_41` (`nombre`),
  UNIQUE KEY `nombre_42` (`nombre`),
  UNIQUE KEY `nombre_43` (`nombre`),
  UNIQUE KEY `nombre_44` (`nombre`),
  UNIQUE KEY `nombre_45` (`nombre`),
  UNIQUE KEY `nombre_46` (`nombre`),
  UNIQUE KEY `nombre_47` (`nombre`),
  UNIQUE KEY `nombre_48` (`nombre`),
  UNIQUE KEY `nombre_49` (`nombre`),
  UNIQUE KEY `nombre_50` (`nombre`),
  UNIQUE KEY `nombre_51` (`nombre`),
  UNIQUE KEY `nombre_52` (`nombre`),
  UNIQUE KEY `nombre_53` (`nombre`),
  UNIQUE KEY `nombre_54` (`nombre`),
  UNIQUE KEY `nombre_55` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.rols: ~4 rows (aproximadamente)
INSERT INTO `rols` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Administrador', 'Acceso total al sistema'),
	(2, 'Marketing', 'El que vela por la publicidad de la empresa'),
	(3, 'rr.hh', 'Maneja a los humanos'),
	(4, 'Finanzas', 'El que maneja y direge la economia de la empresa');

-- Volcando estructura para tabla asistencia.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int DEFAULT '2',
  `qr_login_secret` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_rut_unique` (`rut`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `rut_2` (`rut`),
  UNIQUE KEY `rut_3` (`rut`),
  UNIQUE KEY `rut_4` (`rut`),
  UNIQUE KEY `rut_5` (`rut`),
  UNIQUE KEY `rut_6` (`rut`),
  UNIQUE KEY `rut_7` (`rut`),
  UNIQUE KEY `rut_8` (`rut`),
  UNIQUE KEY `rut_9` (`rut`),
  UNIQUE KEY `rut_10` (`rut`),
  UNIQUE KEY `rut_11` (`rut`),
  UNIQUE KEY `rut_12` (`rut`),
  UNIQUE KEY `rut_13` (`rut`),
  UNIQUE KEY `rut_14` (`rut`),
  UNIQUE KEY `rut_15` (`rut`),
  UNIQUE KEY `rut_16` (`rut`),
  UNIQUE KEY `rut_17` (`rut`),
  UNIQUE KEY `rut_18` (`rut`),
  UNIQUE KEY `rut_19` (`rut`),
  UNIQUE KEY `rut_20` (`rut`),
  UNIQUE KEY `rut_21` (`rut`),
  UNIQUE KEY `rut_22` (`rut`),
  UNIQUE KEY `users_correo_unique` (`correo`),
  UNIQUE KEY `users_qr_login_secret_unique` (`qr_login_secret`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `qr_login_secret` (`qr_login_secret`),
  UNIQUE KEY `correo_2` (`correo`),
  UNIQUE KEY `qr_login_secret_2` (`qr_login_secret`),
  UNIQUE KEY `correo_3` (`correo`),
  UNIQUE KEY `qr_login_secret_3` (`qr_login_secret`),
  UNIQUE KEY `correo_4` (`correo`),
  UNIQUE KEY `correo_5` (`correo`),
  UNIQUE KEY `qr_login_secret_4` (`qr_login_secret`),
  UNIQUE KEY `correo_6` (`correo`),
  UNIQUE KEY `qr_login_secret_5` (`qr_login_secret`),
  UNIQUE KEY `correo_7` (`correo`),
  UNIQUE KEY `qr_login_secret_6` (`qr_login_secret`),
  UNIQUE KEY `correo_8` (`correo`),
  UNIQUE KEY `qr_login_secret_7` (`qr_login_secret`),
  UNIQUE KEY `correo_9` (`correo`),
  UNIQUE KEY `qr_login_secret_8` (`qr_login_secret`),
  UNIQUE KEY `correo_10` (`correo`),
  UNIQUE KEY `qr_login_secret_9` (`qr_login_secret`),
  UNIQUE KEY `correo_11` (`correo`),
  UNIQUE KEY `qr_login_secret_10` (`qr_login_secret`),
  UNIQUE KEY `correo_12` (`correo`),
  UNIQUE KEY `qr_login_secret_11` (`qr_login_secret`),
  UNIQUE KEY `correo_13` (`correo`),
  UNIQUE KEY `qr_login_secret_12` (`qr_login_secret`),
  UNIQUE KEY `correo_14` (`correo`),
  UNIQUE KEY `qr_login_secret_13` (`qr_login_secret`),
  UNIQUE KEY `correo_15` (`correo`),
  UNIQUE KEY `qr_login_secret_14` (`qr_login_secret`),
  UNIQUE KEY `correo_16` (`correo`),
  UNIQUE KEY `qr_login_secret_15` (`qr_login_secret`),
  UNIQUE KEY `correo_17` (`correo`),
  UNIQUE KEY `qr_login_secret_16` (`qr_login_secret`),
  UNIQUE KEY `correo_18` (`correo`),
  UNIQUE KEY `qr_login_secret_17` (`qr_login_secret`),
  UNIQUE KEY `correo_19` (`correo`),
  KEY `id_rol` (`id_rol`),
  KEY `users_id_rol_foreign` (`id_rol`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rols` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla asistencia.users: ~7 rows (aproximadamente)
INSERT INTO `users` (`id`, `rut`, `nombre`, `apellido`, `correo`, `password`, `id_rol`, `qr_login_secret`, `status`) VALUES
	(1, '11.111.111-1', 'Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 1, 'a2bbda11-b3ec-4d92-96ea-b5415d007c7a', 'activo'),
	(2, '22.222.222-2', 'María', 'López', 'maria.lopez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 2, '10599f07-3af5-432d-a177-b31bf86b4555', 'activo'),
	(3, '33.333.333-3', 'Carlos', 'Gonzales', 'carlos.soto@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 4, '0eeac301-502f-40c8-a28c-e1b2c9676c48', 'activo'),
	(4, '44.444.444-4', 'Ana', 'González', 'ana.gonzalez@example.com', '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', 3, 'f9608dfc-4383-43dc-8b48-e333405e2f0d', 'activo'),
	(5, '99.999.999-9', 'Arturo', 'Vidal', 'avidal@mail.com', '$2b$10$4bLY5OHlxDrarRcHVV52l.GkUFV/SNTiavqerL5qTfCM/D8yP6N32', 4, 'f5ee867e-c5ee-48af-aebd-5aba2481dfbc', 'activo'),
	(10, '55.555.555-K', 'Mario', 'Gonzalez', 'm.gonzalez@example.com', '$2b$10$9FhqHafSkfXWlSv5VvmXeuT6HNznJiv.C5zOQBp6UKwe98DE2y5t2', 2, '7cc87648-5975-453e-8fe0-7539be58f313', 'activo'),
	(19, '66.666.666-6', 'Pepito', 'Marcelo', 'Pepito.marcelo@example.com', '$2b$10$egqVxXBjR/eh1hjpvjmuoubrriVBEtVj8kKFRMGcEZqVoG0CSy7O.', 1, '4ccfdc0d-7b19-4219-aff5-3d3a73907163', 'activo');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
