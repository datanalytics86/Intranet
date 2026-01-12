import express from 'express'
import {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  getEmpresas,
  createEmpresa,
  deleteEmpresa,
  getConfiguracion,
  updateConfiguracion
} from '../controllers/adminController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Usuarios
router.get('/usuarios', getUsuarios)
router.post('/usuarios', createUsuario)
router.delete('/usuarios/:id', deleteUsuario)

// Empresas
router.get('/empresas', getEmpresas)
router.post('/empresas', createEmpresa)
router.delete('/empresas/:id', deleteEmpresa)

// Configuración
router.get('/configuracion', getConfiguracion)
router.put('/configuracion', updateConfiguracion)

export default router
