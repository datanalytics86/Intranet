import bcrypt from 'bcrypt'
import { db } from '../services/database.js'
import { generateToken } from '../middleware/auth.js'

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' })
    }

    // Buscar usuario
    const usuario = await db.getUsuarioByEmail(email)

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    if (!usuario.activo) {
      return res.status(403).json({ error: 'Usuario inactivo' })
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Generar token
    const token = generateToken(usuario.id)

    // Retornar usuario y token
    res.json({
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error en autenticación' })
  }
}

// Verificar token
export const verifyToken = async (req, res) => {
  try {
    // El middleware authenticateToken ya verificó el token
    // y agregó el usuario a req.user
    res.json({
      user: req.user
    })
  } catch (error) {
    console.error('Error al verificar token:', error)
    res.status(500).json({ error: 'Error al verificar token' })
  }
}
