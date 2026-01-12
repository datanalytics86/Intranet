import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { db } from '../services/database.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const decoded = jwt.verify(token, config.jwt.secret)

    // Verificar que el usuario existe y está activo
    const usuario = await db.getUsuarioById(decoded.userId)

    if (!usuario || !usuario.activo) {
      return res.status(403).json({ error: 'Acceso denegado' })
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre
    }

    next()

  } catch (error) {
    console.error('Error en autenticación:', error)

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' })
    }

    return res.status(500).json({ error: 'Error en autenticación' })
  }
}

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )
}
