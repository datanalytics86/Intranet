# 🎨 Preview del Sistema HES

Esta carpeta contiene previews estáticos (HTML standalone) de todas las páginas de la aplicación web.

## 📖 Cómo Ver los Previews

### Opción 1: Abrir directamente en el navegador

1. Abre cualquier archivo `.html` directamente en tu navegador
2. Recomendado empezar con: `index.html`

### Opción 2: Servidor local simple

```bash
# Desde la carpeta preview
python -m http.server 8000

# O con Node.js
npx serve

# Luego abre: http://localhost:8000
```

## 📄 Páginas Disponibles

### 🏠 index.html
**Página de inicio del preview** - Índice con acceso a todos los previews

### 🌐 preview-home.html
**Página Principal Pública**
- Logo y nombre de empresa
- Botón principal "Solicitud de HES"
- Diseño minimalista y profesional
- Tarjetas informativas

### 📝 preview-solicitud.html
**Formulario de Solicitud HES**
- Todos los campos requeridos
- Validación visual
- Upload múltiple de archivos
- Selector condicional de moneda
- Vista previa de archivos seleccionados
- Página de confirmación

### 🔐 preview-login.html
**Login Administrador**
- Formulario de autenticación
- Diseño con gradiente
- Credenciales de prueba visibles
- Opción "Recordarme"

### 📊 preview-dashboard.html
**Dashboard Administrador** (⭐ Preview más completo)
- Estadísticas en tarjetas
- Tabla de solicitudes con datos de ejemplo
- Filtros funcionales (diseño)
- Badges de estado con colores
- 3 modales interactivos:
  - Ver detalle completo
  - Enviar HES (con upload de archivo)
  - Pausar solicitud (con motivo)
- Botones de acción por estado
- Paginación
- Botón exportar Excel

### ⚙️ preview-configuracion.html
**Módulo de Configuración**
- Sistema de tabs (Usuarios, Empresas, General)
- CRUD de usuarios administradores
- Gestión de empresas en tarjetas
- Configuración general del sistema
- Configuración de emails SMTP

## 🎯 Navegación

Los previews están interconectados:
- Desde `Home` → `Solicitud`
- Desde `Home` → `Login` → `Dashboard` → `Configuración`
- Botones de "Volver" funcionan correctamente

## 🎨 Características Visuales

### Colores del Sistema
- **Primary**: Azul (#0284c7)
- **Success**: Verde
- **Warning**: Amarillo/Naranja
- **Danger**: Rojo

### Estados de Solicitud (con badges)
- 🟡 **Pendiente** - Amarillo
- 🔵 **En Proceso** - Azul
- 🟠 **Pausada** - Naranja
- 🟢 **Completada** - Verde

### Responsive Design
Todos los previews son responsive y se adaptan a:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔍 Detalles Interactivos

### Dashboard (preview-dashboard.html)
```javascript
// Los modales se pueden abrir/cerrar
toggleModal('modalDetalle')
toggleModal('modalEnviar')
toggleModal('modalPausar')

// Las alertas confirman acciones
alert('Solicitud reactivada')
alert('HES enviada exitosamente!')
```

### Configuración (preview-configuracion.html)
```javascript
// Las tabs cambian con clicks
showTab('usuarios')
showTab('empresas')
showTab('general')
```

## 📦 Tecnología Usada en Previews

- **HTML5** - Estructura
- **Tailwind CSS** (CDN) - Estilos
- **JavaScript vanilla** - Interactividad básica
- **Lucide Icons** (via SVG) - Iconografía

## 🚀 Notas de Implementación

Los previews muestran el diseño exacto que tendrá la aplicación real:

1. **Colores y espaciado** - Idénticos a la implementación React
2. **Componentes** - Diseñados para ser convertidos a componentes React
3. **Estados** - Todos los estados visuales están representados
4. **Validación** - Estilos de error mostrados en formularios
5. **Loading states** - Botones con estado "loading"

## 💡 Para Desarrolladores

Si vas a implementar cambios de diseño:

1. Modifica los previews primero
2. Prueba visualmente
3. Luego replica en los componentes React

Los previews usan la misma configuración de Tailwind que el proyecto real:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    }
  }
}
```

## 📸 Capturas Recomendadas

Para documentación o presentaciones, recomiendo capturar:

1. **Home** - Página principal limpia
2. **Solicitud** - Formulario completo con archivos
3. **Dashboard** - Tabla con todos los estados + modal abierto
4. **Configuración** - Tab de empresas (tarjetas)

## ⚠️ Limitaciones

Estos son previews estáticos:
- ❌ No hay conexión a backend
- ❌ No hay persistencia de datos
- ❌ Los archivos no se suben realmente
- ❌ Los filtros no ejecutan queries reales

✅ **Pero sí muestran**:
- Todo el diseño y layout
- Todos los estados visuales
- La experiencia de usuario completa
- Responsive design

---

**¿Listo para la implementación real?**

Consulta el README.md principal en la raíz del proyecto para instrucciones de instalación y deployment.
