import bcrypt from 'bcrypt'
import { db } from '../services/database.js'

// Usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await db.getUsuarios()
    res.json(usuarios)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    // Verificar si el email ya existe
    const existente = await db.getUsuarioByEmail(email)
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 10)

    // Crear usuario
    const usuario = await db.createUsuario({
      nombre,
      email,
      password_hash,
      activo: true
    })

    res.status(201).json(usuario)

  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params

    // No permitir eliminar el propio usuario
    if (req.user.id === id) {
      return res.status(400).json({ error: 'No puede eliminar su propio usuario' })
    }

    await db.deleteUsuario(id)
    res.json({ success: true, message: 'Usuario eliminado' })

  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
}

// Empresas
export const getEmpresas = async (req, res) => {
  try {
    const empresas = await db.getEmpresas()
    res.json(empresas)
  } catch (error) {
    console.error('Error al obtener empresas:', error)
    res.status(500).json({ error: 'Error al obtener empresas' })
  }
}

export const createEmpresa = async (req, res) => {
  try {
    const { nombre } = req.body

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre requerido' })
    }

    const empresa = await db.createEmpresa({
      nombre,
      activo: true
    })

    res.status(201).json(empresa)

  } catch (error) {
    console.error('Error al crear empresa:', error)
    res.status(500).json({ error: 'Error al crear empresa' })
  }
}

export const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params
    await db.deleteEmpresa(id)
    res.json({ success: true, message: 'Empresa eliminada' })

  } catch (error) {
    console.error('Error al eliminar empresa:', error)
    res.status(500).json({ error: 'Error al eliminar empresa' })
  }
}

// Configuración
export const getConfiguracion = async (req, res) => {
  try {
    const config = await db.getConfiguracion()
    res.json(config)
  } catch (error) {
    console.error('Error al obtener configuración:', error)
    res.status(500).json({ error: 'Error al obtener configuración' })
  }
}

export const updateConfiguracion = async (req, res) => {
  try {
    const { nombre_empresa, email_equipo_hes } = req.body

    if (nombre_empresa !== undefined) {
      await db.setConfiguracion('nombre_empresa', nombre_empresa)
    }

    if (email_equipo_hes !== undefined) {
      await db.setConfiguracion('email_equipo_hes', email_equipo_hes)
    }

    res.json({ success: true, message: 'Configuración actualizada' })

  } catch (error) {
    console.error('Error al actualizar configuración:', error)
    res.status(500).json({ error: 'Error al actualizar configuración' })
  }
}
