#!/bin/bash

# Script para abrir previews del Sistema HES

echo "🎨 Preview del Sistema de Gestión HES"
echo "====================================="
echo ""
echo "Seleccione una opción:"
echo ""
echo "1) 📋 Índice de previews (Recomendado)"
echo "2) 🏠 Página principal"
echo "3) 📝 Formulario de solicitud"
echo "4) 🔐 Login administrador"
echo "5) 📊 Dashboard administrador"
echo "6) ⚙️  Configuración"
echo "7) 🌐 Iniciar servidor local (puerto 8000)"
echo "8) ❌ Salir"
echo ""
read -p "Ingrese su opción [1-8]: " opcion

case $opcion in
    1)
        echo "Abriendo índice de previews..."
        if command -v xdg-open > /dev/null; then
            xdg-open index.html
        elif command -v open > /dev/null; then
            open index.html
        else
            echo "Por favor abra manualmente: preview/index.html"
        fi
        ;;
    2)
        echo "Abriendo página principal..."
        if command -v xdg-open > /dev/null; then
            xdg-open preview-home.html
        elif command -v open > /dev/null; then
            open preview-home.html
        else
            echo "Por favor abra manualmente: preview/preview-home.html"
        fi
        ;;
    3)
        echo "Abriendo formulario de solicitud..."
        if command -v xdg-open > /dev/null; then
            xdg-open preview-solicitud.html
        elif command -v open > /dev/null; then
            open preview-solicitud.html
        else
            echo "Por favor abra manualmente: preview/preview-solicitud.html"
        fi
        ;;
    4)
        echo "Abriendo login..."
        if command -v xdg-open > /dev/null; then
            xdg-open preview-login.html
        elif command -v open > /dev/null; then
            open preview-login.html
        else
            echo "Por favor abra manualmente: preview/preview-login.html"
        fi
        ;;
    5)
        echo "Abriendo dashboard..."
        if command -v xdg-open > /dev/null; then
            xdg-open preview-dashboard.html
        elif command -v open > /dev/null; then
            open preview-dashboard.html
        else
            echo "Por favor abra manualmente: preview/preview-dashboard.html"
        fi
        ;;
    6)
        echo "Abriendo configuración..."
        if command -v xdg-open > /dev/null; then
            xdg-open preview-configuracion.html
        elif command -v open > /dev/null; then
            open preview-configuracion.html
        else
            echo "Por favor abra manualmente: preview/preview-configuracion.html"
        fi
        ;;
    7)
        echo "Iniciando servidor local en puerto 8000..."
        echo "Presione Ctrl+C para detener"
        echo ""
        if command -v python3 > /dev/null; then
            python3 -m http.server 8000
        elif command -v python > /dev/null; then
            python -m http.server 8000
        else
            echo "❌ Python no está instalado. Instale Python o use 'npx serve'"
        fi
        ;;
    8)
        echo "¡Hasta luego!"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac
