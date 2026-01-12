import express from 'express'
import { getArchivo } from '../controllers/archivosController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/:id', authenticateToken, getArchivo)

export default router
