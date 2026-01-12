import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'

// Importar rutas
import solicitudesRoutes from './routes/solicitudesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import archivosRoutes from './routes/archivosRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/solicitudes', solicitudesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/archivos', archivosRoutes)

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err)

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Archivo demasiado grande. Máximo 10MB.' })
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Demasiados archivos. Máximo 5 archivos.' })
  }

  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: 'Error interno del servidor' })
})

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Iniciar servidor
const PORT = config.port

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`)
  console.log(`📝 Modo: ${config.nodeEnv}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
})

export default app
