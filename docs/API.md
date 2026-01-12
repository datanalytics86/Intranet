# Documentación API

API REST para el Sistema de Gestión HES.

Base URL: `http://localhost:5000/api` (desarrollo)

## 🔐 Autenticación

La mayoría de endpoints requieren autenticación mediante JWT token.

### Headers requeridos:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## 📋 Endpoints

### Auth

#### POST /api/auth/login
Login de usuario administrador.

**Request:**
```json
{
  "email": "admin@empresa.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@empresa.com",
    "nombre": "Administrador"
  }
}
```

#### GET /api/auth/verify
Verificar validez del token actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@empresa.com",
    "nombre": "Administrador"
  }
}
```

---

### Solicitudes

#### GET /api/solicitudes
Obtener todas las solicitudes (requiere auth).

**Response (200):**
```json
[
  {
    "id": "uuid",
    "numero_solicitud": "HES-2024-0001",
    "nombre_solicitante": "Juan Pérez",
    "email_solicitante": "juan@example.com",
    "empresa_contrato": "Empresa A",
    "moneda": "CLP",
    "moneda_otra": null,
    "monto": "1000000.00",
    "descripcion": "Descripción de la solicitud",
    "estado": "Pendiente",
    "numero_hes": null,
    "motivo_pausa": null,
    "fecha_solicitud": "2024-01-15T10:30:00Z",
    "fecha_resolucion": null,
    "fecha_pausa": null,
    "archivos": [
      {
        "id": "uuid",
        "nombre_archivo": "documento.pdf",
        "url_storage": "solicitudes/uuid/documento.pdf",
        "tipo_archivo": "application/pdf",
        "tamano_bytes": 125000
      }
    ]
  }
]
```

#### GET /api/solicitudes/:id
Obtener solicitud por ID (requiere auth).

**Response (200):**
```json
{
  "id": "uuid",
  "numero_solicitud": "HES-2024-0001",
  ...
}
```

#### POST /api/solicitudes
Crear nueva solicitud (público - no requiere auth).

**Content-Type:** `multipart/form-data`

**Form Data:**
```
nombre_solicitante: string (required)
email_solicitante: string (required, email)
empresa_contrato: string (required)
moneda: string (required)
moneda_otra: string (si moneda es "Otra")
monto: number (required)
descripcion: text (required)
archivos: files[] (max 5, 10MB cada uno)
```

**Response (201):**
```json
{
  "success": true,
  "numero_solicitud": "HES-2024-0001",
  "id": "uuid"
}
```

#### POST /api/solicitudes/:id/enviar
Enviar HES (completar solicitud) - requiere auth.

**Content-Type:** `multipart/form-data`

**Form Data:**
```
numero_hes: string (required)
mensaje: string (optional)
archivo: file (required, PDF con instrucciones)
```

**Response (200):**
```json
{
  "success": true,
  "message": "HES enviada exitosamente"
}
```

#### PATCH /api/solicitudes/:id/pausar
Pausar solicitud - requiere auth.

**Request:**
```json
{
  "motivo_pausa": "Se requiere información adicional"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Solicitud pausada exitosamente"
}
```

#### PATCH /api/solicitudes/:id/reactivar
Reactivar solicitud pausada - requiere auth.

**Response (200):**
```json
{
  "success": true,
  "message": "Solicitud reactivada exitosamente"
}
```

---

### Admin - Usuarios

#### GET /api/admin/usuarios
Obtener todos los usuarios admin - requiere auth.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "email": "admin@empresa.com",
    "nombre": "Administrador",
    "activo": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/admin/usuarios
Crear nuevo usuario admin - requiere auth.

**Request:**
```json
{
  "nombre": "Nuevo Admin",
  "email": "nuevo@empresa.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "nuevo@empresa.com",
  "nombre": "Nuevo Admin",
  "activo": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### DELETE /api/admin/usuarios/:id
Eliminar usuario admin - requiere auth.

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado"
}
```

---

### Admin - Empresas

#### GET /api/admin/empresas
Obtener todas las empresas - requiere auth.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "nombre": "Empresa A",
    "activo": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/admin/empresas
Crear nueva empresa - requiere auth.

**Request:**
```json
{
  "nombre": "Nueva Empresa"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "nombre": "Nueva Empresa",
  "activo": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### DELETE /api/admin/empresas/:id
Eliminar empresa - requiere auth.

**Response (200):**
```json
{
  "success": true,
  "message": "Empresa eliminada"
}
```

---

### Admin - Configuración

#### GET /api/admin/configuracion
Obtener configuración - requiere auth.

**Response (200):**
```json
{
  "nombre_empresa": "Mi Empresa",
  "email_equipo_hes": "equipo@empresa.com, admin@empresa.com"
}
```

#### PUT /api/admin/configuracion
Actualizar configuración - requiere auth.

**Request:**
```json
{
  "nombre_empresa": "Nueva Empresa",
  "email_equipo_hes": "equipo@nueva.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Configuración actualizada"
}
```

---

### Archivos

#### GET /api/archivos/:id
Descargar archivo - requiere auth.

**Response (200):**
Archivo binario con headers:
```
Content-Type: application/pdf (o tipo correspondiente)
Content-Disposition: attachment; filename="documento.pdf"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token no proporcionado |
| 403 | Forbidden - Token inválido/expirado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error |

### Ejemplo de respuesta de error:
```json
{
  "error": "Descripción del error"
}
```

---

## 📝 Notas

### Validación de archivos
- Formatos permitidos: PDF, XLSX, XLS, DOC, DOCX
- Tamaño máximo: 10MB por archivo
- Máximo 5 archivos por solicitud

### Estados de solicitud
- `Pendiente`: Recién creada
- `En Proceso`: Siendo procesada
- `Pausada`: Requiere información adicional
- `Completada`: HES enviada

### Rate Limiting
Por implementar en producción usando `express-rate-limit`.

### Webhooks
No implementados actualmente. Considerar para integraciones futuras.

---

## 🧪 Testing con cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"admin123"}'
```

### Obtener solicitudes
```bash
curl -X GET http://localhost:5000/api/solicitudes \
  -H "Authorization: Bearer <token>"
```

### Crear solicitud
```bash
curl -X POST http://localhost:5000/api/solicitudes \
  -F "nombre_solicitante=Juan Pérez" \
  -F "email_solicitante=juan@example.com" \
  -F "empresa_contrato=Empresa A" \
  -F "moneda=CLP" \
  -F "monto=1000000" \
  -F "descripcion=Descripción de prueba" \
  -F "archivos=@/path/to/file.pdf"
```

---

Para más detalles sobre implementación, ver código fuente en:
- `backend/src/controllers/`
- `backend/src/routes/`
