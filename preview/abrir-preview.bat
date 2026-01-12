@echo off
chcp 65001 >nul
cls

echo 🎨 Preview del Sistema de Gestión HES
echo =====================================
echo.
echo Seleccione una opción:
echo.
echo 1) 📋 Índice de previews (Recomendado)
echo 2) 🏠 Página principal
echo 3) 📝 Formulario de solicitud
echo 4) 🔐 Login administrador
echo 5) 📊 Dashboard administrador
echo 6) ⚙️  Configuración
echo 7) 🌐 Iniciar servidor local (puerto 8000)
echo 8) ❌ Salir
echo.

set /p opcion="Ingrese su opción [1-8]: "

if "%opcion%"=="1" (
    echo Abriendo índice de previews...
    start index.html
    goto end
)

if "%opcion%"=="2" (
    echo Abriendo página principal...
    start preview-home.html
    goto end
)

if "%opcion%"=="3" (
    echo Abriendo formulario de solicitud...
    start preview-solicitud.html
    goto end
)

if "%opcion%"=="4" (
    echo Abriendo login...
    start preview-login.html
    goto end
)

if "%opcion%"=="5" (
    echo Abriendo dashboard...
    start preview-dashboard.html
    goto end
)

if "%opcion%"=="6" (
    echo Abriendo configuración...
    start preview-configuracion.html
    goto end
)

if "%opcion%"=="7" (
    echo Iniciando servidor local en puerto 8000...
    echo Presione Ctrl+C para detener
    echo.
    python -m http.server 8000
    goto end
)

if "%opcion%"=="8" (
    echo ¡Hasta luego!
    goto end
)

echo ❌ Opción inválida

:end
pause
