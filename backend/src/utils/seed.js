import bcrypt from 'bcrypt'
import { db } from '../services/database.js'

// Script para crear usuario administrador inicial

const seed = async () => {
  try {
    console.log('🌱 Iniciando seed...')

    // Crear usuario administrador
    const adminEmail = 'admin@empresa.com'
    const adminPassword = 'admin123'
    const adminNombre = 'Administrador'

    // Verificar si ya existe
    const existente = await db.getUsuarioByEmail(adminEmail)

    if (existente) {
      console.log('⚠️  El usuario administrador ya existe')
      console.log(`📧 Email: ${adminEmail}`)
      return
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(adminPassword, 10)

    // Crear usuario
    await db.createUsuario({
      email: adminEmail,
      password_hash,
      nombre: adminNombre,
      activo: true
    })

    console.log('✅ Usuario administrador creado exitosamente')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Contraseña:', adminPassword)
    console.log('\n⚠️  IMPORTANTE: Cambie la contraseña después del primer login')

  } catch (error) {
    console.error('❌ Error en seed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
