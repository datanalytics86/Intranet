#!/bin/bash

# Script optimizado para GitHub Codespaces

echo "🎨 Preview del Sistema HES - GitHub Codespaces"
echo "=============================================="
echo ""

# Detectar si estamos en Codespaces
if [ -n "$CODESPACE_NAME" ]; then
    echo "✅ Detectado: GitHub Codespaces"
    echo "🌐 Iniciando servidor en puerto 8000..."
    echo ""
    echo "📌 Codespaces abrirá automáticamente el puerto"
    echo "📌 Click en la notificación 'Open in Browser'"
    echo "📌 O usa el panel 'PORTS' para abrir el puerto 8000"
    echo ""
    echo "🔗 Luego abre: index.html en el navegador"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    echo "=========================================="
    echo ""

    # Cambiar al directorio preview
    cd "$(dirname "$0")"

    # Iniciar servidor
    python3 -m http.server 8000
else
    echo "⚠️  No se detectó Codespaces"
    echo "Usando método estándar..."
    echo ""

    cd "$(dirname "$0")"

    # Intentar abrir el navegador
    if command -v xdg-open > /dev/null; then
        xdg-open index.html
    elif command -v open > /dev/null; then
        open index.html
    else
        echo "Por favor abra manualmente: preview/index.html"
    fi
fi
