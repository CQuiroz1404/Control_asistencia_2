# 📋 Sistema de Control de Asistencia

Sistema web completo para la gestión y control de asistencia de empleados, desarrollado con Node.js, Express y MySQL. Incluye funcionalidades de registro de entrada/salida mediante código QR, gestión de justificaciones, licencias médicas y generación de reportes.

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Roles y Permisos](#-roles-y-permisos)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Uso](#-uso)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Sistema de login tradicional con RUT y contraseña
- **Login mediante código QR único** para cada usuario
- Autenticación basada en JWT (Access Token y Refresh Token)
- Contraseñas encriptadas con bcryptjs
- Sesiones seguras con express-session
- Restricción de horario de acceso (sistema cerrado entre 22:00 y 06:00)

### 👥 Gestión de Usuarios
- CRUD completo de usuarios por administradores
- Sistema de roles (Administrador, RR.HH., Marketing, Finanzas)
- Generación automática de códigos QR personalizados
- Activación/desactivación de cuentas
- Notificaciones por correo electrónico

### ⏰ Registro de Asistencia
- Registro de entrada y salida
- Detección automática de atrasos y salidas anticipadas
- Categorización automática de asistencia:
  - Entrada Normal
  - Atraso
  - Salida Normal
  - Salida Anticipada
  - Inasistencia
- Validación de días feriados chilenos
- Marcado automático de asistencia en feriados

### 📄 Gestión de Licencias Médicas
- Carga de licencias médicas en formato PDF
- **Extracción automática de datos** del PDF (folio, fechas, días de reposo, etc.)
- Sistema de aprobación/rechazo
- Almacenamiento organizado por usuario
- Validación de campos obligatorios

### 📝 Justificaciones de Inasistencia
- Sistema de carga de justificaciones con documentos de respaldo
- Workflow de aprobación (Pendiente, Aprobada, Rechazada)
- Control de permisos: usuarios no pueden aprobar sus propias justificaciones
- RR.HH. no puede modificar justificaciones de administradores

### 📊 Reportes y Estadísticas
- Reportes de asistencia de los últimos 7 días
- Filtros por tipo: inasistencias, atrasos, salidas anticipadas
- Exportación de reportes a PDF
- Visualización detallada por usuario
- Dashboard personalizado por rol

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos relacional

### Seguridad y Autenticación
- **jsonwebtoken** - Generación y verificación de JWT
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Gestión de sesiones
- **cookie-parser** - Manejo de cookies

### Procesamiento de Archivos
- **Multer** - Subida de archivos
- **pdf-parse** - Extracción de texto de PDFs
- **pdfjs-dist** - Procesamiento de PDFs en servidor
- **PDFKit** - Generación de documentos PDF

### Utilidades
- **moment-timezone** - Manejo de fechas y zonas horarias
- **qrcode** - Generación de códigos QR
- **uuid** - Generación de identificadores únicos
- **nodemailer** - Envío de correos electrónicos

### Frontend
- **Handlebars** - Motor de plantillas
- **Bootstrap** - Framework CSS (implícito en las vistas)
- **QRCode.js** - Lectura de códigos QR en el navegador

## 📋 Requisitos Previos

- **Node.js** v22 o superior
- **MySQL** v8.0 o superior
- **npm** o **yarn**
- Cuenta de correo electrónico para envío de notificaciones (opcional)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/CQuiroz1404/Control_asistencia_2.git
cd Control_asistencia_2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear la base de datos**
```bash
# Importar el archivo SQL en MySQL
mysql -u root -p < db_asistencia.sql
```

4. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
# Editar .env con tus credenciales
```

5. **Iniciar el servidor**
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## ⚙ Configuración

### Variables de Entorno (.env)

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=asistencia
DB_PORT=3306

# Seguridad JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_REFRESH_SECRET=tu_clave_refresh_muy_segura
SESSION_SECRET=tu_clave_sesion_muy_segura

# Configuración de Correo (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_app
```

### Configuración de Base de Datos

El archivo `config/database.js` utiliza Sequelize para la conexión:

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  }
);
```

## 📁 Estructura del Proyecto

```
Control_asistencia_2/
├── app.js                          # Punto de entrada de la aplicación
├── package.json                    # Dependencias y scripts
├── db_asistencia.sql              # Script de creación de BD
│
├── config/                         # Configuraciones
│   ├── database.js                # Conexión a MySQL
│   ├── database_azure.js          # Conexión a Azure (opcional)
│   └── mailer.js                  # Configuración de correo
│
├── controllers/                    # Lógica de negocio
│   ├── authController.js          # Autenticación y login
│   ├── assistController.js        # Registro de asistencia
│   ├── userController.js          # Gestión de usuarios
│   ├── licenseController.js       # Licencias médicas
│   ├── justificationController.js # Justificaciones
│   ├── reportController.js        # Generación de reportes
│   ├── adminController.js         # Panel de administración
│   └── pdfController.js           # Procesamiento de PDFs
│
├── models/                         # Modelos de Sequelize
│   ├── User.js                    # Modelo de Usuario
│   ├── assist.js                  # Modelo de Asistencia
│   ├── assistCategory.js          # Categorías de asistencia
│   ├── StateAssist.js             # Estados de asistencia
│   ├── Rol.js                     # Roles de usuario
│   ├── lecense.js                 # Licencias médicas
│   ├── justification.js           # Justificaciones
│   └── HoursWork.js               # Horarios laborales
│
├── routes/                         # Definición de rutas
│   ├── authRoutes.js              # Rutas de autenticación
│   ├── userRoutes.js              # Rutas de usuario
│   ├── assistRoutes.js            # Rutas de asistencia
│   ├── licenseRoutes.js           # Rutas de licencias
│   ├── adminRoutes.js             # Rutas de administración
│   ├── reportRoutes.js            # Rutas de reportes
│   └── pdfRoutes.js               # Rutas de PDFs
│
├── middlewares/                    # Middlewares personalizados
│   └── authMiddleware.js          # Verificación de JWT y roles
│
├── helpers/                        # Funciones auxiliares
│   ├── pdfExtractorServer.js      # Extracción de datos de PDFs
│   ├── holidayUtils.js            # Validación de feriados
│   ├── chileanHolidays.json       # Lista de feriados chilenos
│   └── accessTime.js              # Control de horarios de acceso
│
├── views/                          # Plantillas Handlebars
│   ├── layouts/
│   │   └── main.hbs               # Layout principal
│   ├── common/                    # Vistas comunes
│   │   ├── login.hbs              # Página de login
│   │   ├── dashboard_usuario.hbs  # Dashboard de usuario
│   │   └── dashboard_error.hbs    # Página de error
│   ├── admin/                     # Vistas de administrador
│   │   ├── admin.hbs              # Panel de administración
│   │   ├── userCRUD.hbs           # Gestión de usuarios
│   │   ├── licencias.hbs          # Gestión de licencias
│   │   └── justificaciones.hbs    # Gestión de justificaciones
│   ├── justificaciones/           # Formularios de justificación
│   │   ├── inasistencia.hbs
│   │   └── licencia_medica.hbs
│   └── reports/                   # Vistas de reportes
│       └── absenceReports.hbs
│
├── public/                         # Archivos estáticos
│   ├── css/
│   │   └── style.css              # Estilos personalizados
│   └── js/                        # Scripts del cliente
│       ├── admin_dashboard.js
│       ├── qrLoginScanner.js      # Escáner QR para login
│       ├── userCRUD.js
│       ├── licenseFrontend.js
│       └── justificationFrontend.js
│
├── correo/                         # Plantillas de correo
│   ├── correo_newuser.html
│   └── correo_updateqr.html
│
├── uploads_licmed/                 # Archivos de licencias médicas
└── uploads_inasistencia/           # Archivos de justificaciones
```

## 🎯 Funcionalidades Detalladas

### 1. Sistema de Autenticación

#### Login Tradicional
- Ingreso con RUT y contraseña
- Generación de tokens JWT (Access: 15 min, Refresh: 7 días)
- Cookies HttpOnly para mayor seguridad

#### Login por QR
- Cada usuario tiene un código QR único (UUID v4)
- El QR contiene el `qr_login_secret` del usuario
- Escaneo rápido desde dispositivos móviles
- Autenticación instantánea sin credenciales

### 2. Registro de Asistencia

#### Categorización Automática
El sistema determina automáticamente la categoría según:

| Tipo | Horario Normal | Condición |
|------|---------------|-----------|
| Entrada Normal | ≤ 09:30 | Llega a tiempo |
| Atraso | > 09:30 | Llega tarde |
| Salida Normal | ≥ 17:30 | Sale en horario |
| Salida Anticipada | < 17:30 | Sale antes |
| Atraso + Salida Anticipada | - | Combinación de ambos |

#### Validaciones
- No permite registro en días feriados
- Marcado automático como "Presente" en feriados
- Validación de entrada previa antes de salida
- Una sola entrada y salida por día

### 3. Gestión de Licencias Médicas

#### Extracción Automática de Datos
El sistema extrae automáticamente del PDF:
- Folio de la licencia
- Fecha de emisión
- Fecha de inicio del reposo
- Fecha de término
- Días de reposo
- Datos del profesional
- Datos del trabajador (nombre, RUT, edad, sexo)
- Dirección de reposo
- Teléfono de contacto
- Tipo de licencia

#### Workflow
1. Usuario sube PDF de licencia
2. Sistema extrae y valida datos
3. Administrador/RR.HH. revisa
4. Aprueba o rechaza
5. Se actualiza el estado de asistencia

### 4. Sistema de Reportes

#### Tipos de Reportes
- **Reportes de Asistencia**: Últimos 7 días
- **Filtros disponibles**:
  - Inasistencias
  - Atrasos
  - Salidas anticipadas
  - Combinaciones

#### Exportación
- Generación de PDFs con PDFKit
- Incluye datos del usuario y detalles de asistencia
- Descarga automática

### 5. Control de Horarios

El sistema implementa restricciones horarias:
- **Horario cerrado**: 22:00 - 06:00
- Las sesiones expiran automáticamente a las 22:00
- Override para desarrollo mediante cookie `DEV_DISABLE_TIME_BLOCK=1`

## 👤 Roles y Permisos

### Administrador
- ✅ Acceso total al sistema
- ✅ Gestión completa de usuarios
- ✅ Aprobación de licencias y justificaciones
- ✅ Generación de reportes
- ✅ Acceso a todas las funcionalidades

### RR.HH. (Recursos Humanos)
- ✅ Gestión de asistencia
- ✅ Aprobación de licencias y justificaciones
- ✅ Generación de reportes
- ❌ No puede modificar justificaciones de administradores
- ❌ No puede gestionar usuarios administradores

### Marketing / Finanzas
- ✅ Registro de propia asistencia
- ✅ Envío de licencias y justificaciones
- ✅ Visualización de propia asistencia
- ❌ Sin acceso a funciones administrativas

## 🗄 Base de Datos

### Tablas Principales

#### `users`
- id (PK)
- rut (UNIQUE)
- nombre, apellido
- correo (UNIQUE)
- password (encriptado)
- id_rol (FK)
- qr_login_secret (UNIQUE)
- status (activo/desactivado)

#### `asistencia`
- id (PK)
- id_usuario (FK)
- fecha
- hora_entrada
- hora_salida
- id_estado (FK)
- id_categoria (FK)

#### `licencia_medica`
- id (PK)
- id_usuario (FK)
- folio
- fecha_emision
- fecha_inicio
- fecha_fin
- dias_reposo
- estado (Pendiente/Aprobada/Rechazada)
- archivo (ruta del PDF)
- [otros campos extraídos del PDF]

#### `justificacion_comun`
- id (PK)
- id_usuario (FK)
- fecha_inicio
- fecha_fin
- motivo
- archivo
- estado (Pendiente/Aprobada/Rechazada)

#### Tablas de Catálogo
- `rols`: Roles del sistema
- `estadoasistencia`: Estados de asistencia
- `categoria_asistencia`: Categorías de asistencia
- `horastrabajadas`: Configuración de horarios

## 🔌 API Endpoints

### Autenticación
```
POST   /login                  # Login con RUT y contraseña
POST   /login/qr               # Login con código QR
GET    /logout                 # Cerrar sesión
POST   /register               # Registro de nuevo usuario
```

### Asistencia
```
POST   /asistencia/:id         # Registrar entrada/salida
GET    /mis-asistencias/:id    # Obtener asistencias del usuario
GET    /api/time               # Obtener hora del servidor
```

### Usuarios (requiere auth)
```
GET    /dashboard_usuario      # Dashboard principal
GET    /usuarios               # Listar usuarios (admin)
POST   /usuarios               # Crear usuario (admin)
PUT    /usuarios/:id           # Actualizar usuario (admin)
DELETE /usuarios/:id           # Eliminar usuario (admin)
GET    /usuarios/:id/qr        # Obtener QR del usuario
```

### Licencias Médicas (requiere auth)
```
POST   /api/licencias          # Subir nueva licencia
GET    /api/licencias          # Listar licencias (admin/RR.HH.)
PUT    /api/licencias/:id      # Actualizar estado (admin/RR.HH.)
```

### Justificaciones (requiere auth)
```
GET    /admin/justificaciones           # Vista de gestión
GET    /api/justificaciones             # Listar justificaciones
PUT    /api/justificaciones/:id/status  # Actualizar estado
```

### Reportes (requiere auth)
```
GET    /reports/absences       # Obtener reportes de ausencias
GET    /reports/pdf            # Generar y descargar PDF
```

## 💻 Uso

### Primer Inicio

1. **Crear usuario administrador inicial**
```sql
INSERT INTO users (rut, nombre, apellido, correo, password, id_rol, qr_login_secret, status)
VALUES (
  '11.111.111-1',
  'Admin',
  'Sistema',
  'admin@example.com',
  '$2b$10$jtVttTQ2mdcjEIU3tqGv1u8UkSMCPS/Sxzwl4m4WKDE.dCzWzQX8i', -- password: 123456
  1,
  UUID(),
  'activo'
);
```

2. **Acceder al sistema**
- URL: `http://localhost:3000`
- RUT: `11.111.111-1`
- Contraseña: `123456`

3. **Configurar horarios**
```sql
UPDATE horastrabajadas SET entrada = '09:30:00', salida = '17:30:00' WHERE id = 1;
```

### Uso Diario

#### Para Empleados
1. Login con QR o credenciales
2. Marcar entrada al llegar
3. Marcar salida al terminar
4. Subir justificaciones/licencias si es necesario

#### Para Administradores/RR.HH.
1. Revisar dashboard de reportes
2. Aprobar/rechazar licencias y justificaciones
3. Gestionar usuarios
4. Generar reportes periódicos

### Desarrollo

```bash
# Modo desarrollo con nodemon
npm install -g nodemon
nodemon app.js

# Desactivar restricción horaria en desarrollo
# Agregar cookie en el navegador: DEV_DISABLE_TIME_BLOCK=1
```

## 🔧 Personalización

### Modificar Horarios Laborales
Editar en `controllers/assistController.js`:
```javascript
const horaEntradaNormal = new Date('2000-01-01T09:30:00');
const horaSalidaNormal = new Date('2000-01-01T17:30:00');
```

### Agregar Feriados
Editar `helpers/chileanHolidays.json`:
```json
{
  "2025": [
    { "date": "2025-01-01", "name": "Año Nuevo" },
    { "date": "2025-12-25", "name": "Navidad" }
  ]
}
```

### Personalizar Notificaciones
Editar plantillas en `correo/`:
- `correo_newuser.html`: Bienvenida a nuevo usuario
- `correo_updateqr.html`: Actualización de código QR

## 🐛 Solución de Problemas

### La base de datos no se conecta
```bash
# Verificar que MySQL esté corriendo
mysql -u root -p

# Verificar credenciales en .env
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=asistencia
```

### Los tokens JWT no funcionan
```bash
# Generar claves secretas seguras
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copiar el resultado a JWT_SECRET en .env
```

### Los archivos PDF no se procesan
```bash
# Verificar que las carpetas de uploads existan
mkdir uploads_licmed
mkdir uploads_inasistencia

# Verificar permisos
chmod 755 uploads_licmed uploads_inasistencia
```

### Problemas con zona horaria
El sistema usa `America/Santiago` por defecto. Para cambiar:
```javascript
// En app.js o assistController.js
moment().tz('America/Santiago') // Cambiar a tu zona horaria
```

## 📊 Mejoras Futuras

- [ ] Implementar notificaciones push
- [ ] Dashboard con gráficos estadísticos
- [ ] App móvil nativa
- [ ] Integración con sistemas de RRHH externos
- [ ] Reconocimiento facial para asistencia
- [ ] Exportación de reportes a Excel
- [ ] Sistema de permisos más granular
- [ ] Auditoría de cambios
- [ ] Backup automático de base de datos

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia ISC.

## 👨‍💻 Autores

- **Repositorio Original**: [D4rK14/Control_de_asistencia](https://github.com/D4rK14/Control_de_asistencia)
- **Repositorio Actual**: [CQuiroz1404/Control_asistencia_2](https://github.com/CQuiroz1404/Control_asistencia_2)

## 📞 Soporte

Para preguntas o problemas, por favor abre un issue en el repositorio de GitHub.

---

**Desarrollado con ❤️ para facilitar la gestión de asistencia en empresas**
