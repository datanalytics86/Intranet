import express from 'express'
import {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  enviarHES,
  pausarSolicitud,
  reactivarSolicitud
} from '../controllers/solicitudesController.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Rutas públicas
router.post('/', upload.array('archivos', 5), createSolicitud)

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, getSolicitudes)
router.get('/:id', authenticateToken, getSolicitudById)
router.post('/:id/enviar', authenticateToken, upload.single('archivo'), enviarHES)
router.patch('/:id/pausar', authenticateToken, pausarSolicitud)
router.patch('/:id/reactivar', authenticateToken, reactivarSolicitud)

export default router
