# Sistema de Gestión HES

Sistema completo para gestión de solicitudes de Hojas de Estado de Pago (HES).

## 🚀 Características

### Portal Público (Solicitantes)
- ✅ Formulario de solicitud HES intuitivo
- ✅ Carga de múltiples archivos adjuntos (PDF, Excel, Word)
- ✅ Validación de campos en tiempo real
- ✅ Confirmación por email con número de seguimiento
- ✅ Diseño responsive y profesional

### Dashboard Administrador
- ✅ Vista completa de todas las solicitudes
- ✅ Filtros avanzados (estado, fecha, empresa, búsqueda)
- ✅ Gestión de solicitudes (enviar HES, pausar, reactivar)
- ✅ Exportación a Excel
- ✅ Sistema de notificaciones por email
- ✅ Descarga de archivos adjuntos

### Módulo de Configuración
- ✅ Gestión de usuarios administradores
- ✅ CRUD de empresas/contratos
- ✅ Configuración de emails del equipo HES
- ✅ Personalización de la empresa

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Excel Export**: SheetJS (xlsx)

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT
- **Email**: Nodemailer
- **File Upload**: Multer
- **Password Hashing**: bcrypt

### Hosting
- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: Supabase

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratuita)
- Servicio SMTP para emails (Gmail, Resend, etc.)

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Intranet
```

### 2. Configurar Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. Ejecutar el script SQL:
   - Ir a SQL Editor en Supabase
   - Copiar y ejecutar el contenido de `database/schema.sql`
4. Crear el bucket de storage:
   - Ir a Storage
   - Crear bucket llamado `hes-archivos`
   - Configurar como público
5. Obtener credenciales:
   - Ir a Project Settings → API
   - Copiar `Project URL` y `anon public key`

### 3. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

Completar el archivo `.env` con:
- Credenciales de Supabase
- Clave secreta para JWT
- Configuración SMTP de email

**Configuración de Email (Gmail)**:
1. Activar verificación en 2 pasos en tu cuenta de Gmail
2. Generar una "Contraseña de aplicación":
   - Ir a Cuenta de Google → Seguridad
   - Contraseñas de aplicaciones
   - Generar nueva contraseña
3. Usar esa contraseña en `EMAIL_PASSWORD`

**Configuración de Email (Resend - Recomendado)**:
1. Crear cuenta en [Resend](https://resend.com)
2. Obtener API key
3. Configurar dominio personalizado (opcional)

### 4. Crear usuario administrador inicial

```bash
cd backend
npm run seed
```

Credenciales por defecto:
- **Email**: admin@empresa.com
- **Contraseña**: admin123

⚠️ **IMPORTANTE**: Cambiar la contraseña después del primer login

### 5. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# (Opcional) Crear .env si necesitas configurar API URL para producción
cp .env.example .env
```

### 6. Ejecutar en desarrollo

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```
El backend correrá en http://localhost:5000

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```
El frontend correrá en http://localhost:3000

### 7. Acceder a la aplicación

- **Portal público**: http://localhost:3000
- **Login admin**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/admin/dashboard

## 🚀 Deployment

### Frontend (Vercel)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar el repositorio
3. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Agregar variable de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app
   ```
5. Actualizar `frontend/vercel.json` con la URL real de tu backend
6. Deploy

### Backend (Railway)

1. Crear cuenta en [Railway](https://railway.app)
2. Nuevo proyecto → Deploy from GitHub
3. Seleccionar el repositorio
4. Configurar:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
5. Agregar variables de entorno (todas las del .env)
6. Deploy

**Alternativa: Render**

1. Crear cuenta en [Render](https://render.com)
2. Nuevo Web Service → Connect repository
3. Configurar:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Agregar variables de entorno
5. Deploy

### Después del deployment

1. Actualizar `frontend/vercel.json` con la URL real del backend
2. Redeploy el frontend
3. Probar todas las funcionalidades

## 📁 Estructura del Proyecto

```
Intranet/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── contexts/        # Contextos de React (Auth)
│   │   ├── services/        # Servicios y utilidades
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Entry point
│   ├── public/              # Archivos estáticos
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── config/          # Configuración
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Servicios (DB, email, storage)
│   │   ├── middleware/      # Middleware (auth, upload)
│   │   ├── utils/           # Utilidades (seed script)
│   │   └── server.js        # Servidor Express
│   └── package.json
│
├── database/                 # Scripts SQL
│   └── schema.sql           # Schema de la base de datos
│
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
└── README.md
```

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Passwords hasheados con bcrypt
- ✅ Row Level Security (RLS) en Supabase
- ✅ Validación de archivos (tipo y tamaño)
- ✅ Variables de entorno para credenciales
- ✅ CORS configurado
- ✅ Protección de rutas en frontend y backend

## 📧 Sistema de Emails

El sistema envía emails automáticos en las siguientes situaciones:

1. **Confirmación de solicitud**: Al solicitante cuando crea una solicitud
2. **Notificación al equipo HES**: Cuando se recibe una nueva solicitud
3. **HES completada**: Al solicitante con el número HES y archivo adjunto
4. **Solicitud pausada**: Al solicitante indicando el motivo
5. **Solicitud reactivada**: Al solicitante cuando se reactiva

## 📊 Base de Datos

### Tablas principales:
- `solicitudes_hes`: Solicitudes de HES
- `archivos_solicitud`: Archivos adjuntos
- `usuarios_admin`: Usuarios administradores
- `empresas`: Empresas/contratos
- `configuracion`: Configuración del sistema
- `log_emails`: Registro de emails enviados

Ver `database/schema.sql` para el schema completo.

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🐛 Solución de Problemas

### Error al enviar emails
- Verificar credenciales SMTP en `.env`
- Para Gmail: usar contraseña de aplicación, no la contraseña normal
- Verificar que el puerto y configuración SSL son correctos

### Error de conexión a Supabase
- Verificar que SUPABASE_URL y SUPABASE_KEY son correctos
- Verificar que el bucket existe y tiene las políticas correctas
- Verificar que las tablas están creadas (ejecutar schema.sql)

### Archivos no se suben
- Verificar que el bucket en Supabase Storage existe
- Verificar las políticas de acceso del bucket
- Verificar el límite de tamaño (10MB por defecto)

### Error de autenticación
- Verificar JWT_SECRET en `.env`
- Verificar que el usuario existe y está activo
- Borrar token del localStorage y volver a hacer login

## 📝 Notas de Desarrollo

### Configuración de empresas
Las empresas/contratos se configuran en el módulo de configuración. Inicialmente hay 3 empresas de ejemplo que puedes modificar.

### Monedas soportadas
- UF, CLP, AUD, USD, Otra (personalizable)

### Límites de archivos
- Máximo 5 archivos por solicitud
- Tamaño máximo: 10MB por archivo
- Formatos: PDF, Excel (.xlsx, .xls), Word (.doc, .docx)

### Estados de solicitud
- **Pendiente**: Recién creada
- **En Proceso**: Siendo procesada
- **Pausada**: Requiere información adicional
- **Completada**: HES enviada

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Soporte

Para soporte o preguntas, contactar a: [tu-email@empresa.com]

---

Desarrollado con ❤️ para gestión eficiente de HES
