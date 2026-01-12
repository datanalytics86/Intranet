# Guía de Deployment

Esta guía detalla el proceso completo de deployment de la aplicación HES.

## 📋 Checklist Pre-Deployment

- [ ] Cuenta de Supabase creada y configurada
- [ ] Base de datos creada (ejecutar schema.sql)
- [ ] Bucket de storage creado
- [ ] Servicio de email configurado (Gmail/Resend)
- [ ] Todas las variables de entorno documentadas

## 🗄️ 1. Configurar Supabase

### Crear Proyecto

1. Ir a [app.supabase.com](https://app.supabase.com)
2. Click en "New Project"
3. Completar:
   - **Name**: hes-sistema
   - **Database Password**: (generar contraseña segura)
   - **Region**: Seleccionar más cercana
4. Esperar a que el proyecto se cree (~2 minutos)

### Ejecutar Schema SQL

1. En el panel de Supabase, ir a **SQL Editor**
2. Click en **New Query**
3. Copiar todo el contenido de `database/schema.sql`
4. Pegar y ejecutar (Run)
5. Verificar que aparece "Success"

### Crear Storage Bucket

1. Ir a **Storage** en el menú lateral
2. Click en **Create a new bucket**
3. Configurar:
   - **Name**: `hes-archivos`
   - **Public bucket**: ✅ Sí
4. Click en **Create bucket**

### Configurar Políticas de Storage

1. Click en el bucket `hes-archivos`
2. Ir a la pestaña **Policies**
3. Agregar las siguientes políticas:

**Política INSERT (Upload)**:
```sql
CREATE POLICY "Permitir upload a todos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'hes-archivos');
```

**Política SELECT (Download)**:
```sql
CREATE POLICY "Permitir download a autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hes-archivos');
```

**Política DELETE**:
```sql
CREATE POLICY "Permitir delete a autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hes-archivos');
```

### Obtener Credenciales

1. Ir a **Project Settings** → **API**
2. Copiar:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_KEY)

## 📧 2. Configurar Email

### Opción A: Gmail (Más Simple)

1. Ir a tu cuenta de Google
2. Activar **Verificación en 2 pasos**
3. Ir a **Seguridad** → **Contraseñas de aplicaciones**
4. Seleccionar:
   - App: "Correo"
   - Dispositivo: "Otro" (nombre: "Sistema HES")
5. Copiar la contraseña generada (16 caracteres)

Variables de entorno:
```
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=contraseña-de-aplicacion-de-16-caracteres
EMAIL_FROM=tu-email@gmail.com
```

### Opción B: Resend (Recomendado para Producción)

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar email
3. Ir a **API Keys** → **Create API Key**
4. Copiar la key (empieza con `re_`)
5. (Opcional) Configurar dominio personalizado en **Domains**

Variables de entorno:
```
EMAIL_SERVICE=resend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=resend
EMAIL_PASSWORD=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=Sistema HES <noreply@tudominio.com>
```

## 🚂 3. Deploy Backend (Railway)

### Crear Proyecto

1. Ir a [railway.app](https://railway.app)
2. Login con GitHub
3. Click en **New Project**
4. Seleccionar **Deploy from GitHub repo**
5. Autorizar Railway a acceder a tu repo
6. Seleccionar el repositorio

### Configurar Servicio

1. Railway detectará automáticamente Node.js
2. En **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Healthcheck Path**: `/api/health`

### Agregar Variables de Entorno

En la sección **Variables**, agregar todas las variables:

```
PORT=5000
NODE_ENV=production

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...
SUPABASE_BUCKET_NAME=hes-archivos

JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-minimo-32-caracteres

EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion
EMAIL_FROM=tu-email@gmail.com
```

### Deploy

1. Click en **Deploy**
2. Esperar a que termine el build (~2-3 minutos)
3. Copiar la URL generada (ej: `https://hes-backend-production.up.railway.app`)
4. Probar: `https://tu-url.railway.app/api/health`

### Crear Usuario Admin

Desde Railway Dashboard:
1. Ir a **Settings** → **Connect**
2. Click en **Connect** para abrir una shell
3. Ejecutar:
```bash
npm run seed
```

## ▲ 4. Deploy Frontend (Vercel)

### Preparar Frontend

1. Editar `frontend/vercel.json`
2. Reemplazar `your-backend-url.railway.app` con tu URL real de Railway

Ejemplo:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://hes-backend-production.up.railway.app/api/$1"
    }
  ]
}
```

3. Commit y push los cambios:
```bash
git add .
git commit -m "Configure backend URL for production"
git push
```

### Crear Proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Login con GitHub
3. Click en **Add New** → **Project**
4. Importar tu repositorio
5. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Variables de Entorno (Opcional)

Si prefieres usar variable de entorno en lugar de vercel.json:

```
VITE_API_URL=https://tu-backend.railway.app
```

Y actualizar `frontend/src/services/api.js` para usar esta variable.

### Deploy

1. Click en **Deploy**
2. Esperar a que termine (~2 minutos)
3. Copiar la URL generada (ej: `https://hes-sistema.vercel.app`)

### Probar Aplicación

1. Abrir la URL de Vercel
2. Ir a Login: `/login`
3. Ingresar:
   - Email: `admin@empresa.com`
   - Contraseña: `admin123`
4. Cambiar la contraseña inmediatamente

## 🔄 5. Configuración Post-Deployment

### Actualizar Configuración en la App

1. Login al dashboard admin
2. Ir a **Configuración** → **General**
3. Actualizar:
   - **Nombre de Empresa**: Tu empresa real
   - **Emails Equipo HES**: Emails que recibirán notificaciones

### Agregar Empresas/Contratos

1. Ir a **Configuración** → **Empresas/Contratos**
2. Eliminar las empresas de ejemplo
3. Agregar tus empresas reales

### Crear Usuarios Adicionales

1. Ir a **Configuración** → **Usuarios Administradores**
2. Click en **Agregar Usuario**
3. Completar datos

### Probar Flujo Completo

1. **Crear Solicitud**:
   - Ir a la home pública
   - Click en "Solicitar HES"
   - Completar formulario
   - Verificar email de confirmación

2. **Ver en Dashboard**:
   - Login como admin
   - Verificar que la solicitud aparece
   - Verificar email de notificación al equipo

3. **Enviar HES**:
   - Click en botón enviar
   - Completar datos
   - Verificar email con archivo adjunto

4. **Pausar y Reactivar**:
   - Pausar una solicitud
   - Verificar email
   - Reactivar
   - Verificar email

5. **Exportar Excel**:
   - Click en exportar
   - Verificar archivo descargado

## 🔧 Troubleshooting

### Backend no responde

```bash
# Ver logs en Railway
railway logs

# Verificar health check
curl https://tu-backend.railway.app/api/health
```

### Emails no se envían

1. Verificar credenciales en variables de entorno
2. Para Gmail: verificar contraseña de aplicación
3. Ver logs del backend
4. Probar envío manual desde Railway shell:
```bash
node -e "require('./src/services/email.js').sendEmail(...)"
```

### Archivos no se suben

1. Verificar bucket existe en Supabase
2. Verificar políticas de storage
3. Verificar SUPABASE_KEY es correcta
4. Ver logs del backend

### Frontend no conecta con backend

1. Verificar vercel.json tiene URL correcta
2. Verificar CORS en backend permite tu dominio
3. Abrir DevTools → Network para ver requests
4. Verificar proxy en vite.config.js (solo desarrollo)

## 🔐 Seguridad

### Variables de Entorno

- ✅ NUNCA commitear archivos .env
- ✅ Usar contraseñas fuertes (32+ caracteres)
- ✅ Cambiar JWT_SECRET en producción
- ✅ Usar contraseñas de aplicación para Gmail

### Supabase

- ✅ Verificar RLS policies están activas
- ✅ Usar anon key en frontend
- ✅ NUNCA exponer service_role key

### Backend

- ✅ HTTPS en producción (Railway/Vercel lo hacen automático)
- ✅ Validar todos los inputs
- ✅ Rate limiting (opcional, agregar express-rate-limit)

## 📊 Monitoreo

### Railway

- Ver logs en tiempo real
- Configurar alertas de uptime
- Monitorear uso de recursos

### Vercel

- Ver analytics de tráfico
- Monitorear builds
- Configurar alerts

### Supabase

- Monitorear queries lentas
- Ver uso de storage
- Configurar backups automáticos

## 🔄 Actualizaciones

### Deploy nuevos cambios

```bash
# Hacer cambios en código
git add .
git commit -m "Descripción de cambios"
git push

# Railway y Vercel deployearán automáticamente
```

### Rollback

**Vercel**:
1. Ir a Deployments
2. Seleccionar deployment anterior
3. Click en "Promote to Production"

**Railway**:
1. Ir a Deployments
2. Click en deployment anterior
3. Click en "Rollback"

## 📞 Soporte

Si tienes problemas:
1. Revisar logs (Railway/Vercel)
2. Verificar configuración paso a paso
3. Revisar documentación de Supabase/Railway/Vercel
4. Contactar soporte técnico

---

✅ Una vez completados todos los pasos, tu aplicación estará 100% funcional en producción.
