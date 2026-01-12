import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

// Crear cliente de Supabase
export const supabase = createClient(
  config.supabase.url,
  config.supabase.key
)

// Funciones auxiliares para operaciones de base de datos

export const db = {
  // Solicitudes
  async getSolicitudes() {
    const { data, error } = await supabase
      .from('solicitudes_hes')
      .select(`
        *,
        archivos:archivos_solicitud(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getSolicitudById(id) {
    const { data, error } = await supabase
      .from('solicitudes_hes')
      .select(`
        *,
        archivos:archivos_solicitud(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createSolicitud(solicitudData) {
    const { data, error } = await supabase
      .from('solicitudes_hes')
      .insert(solicitudData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSolicitud(id, updates) {
    const { data, error } = await supabase
      .from('solicitudes_hes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getNextNumeroSolicitud() {
    const year = new Date().getFullYear()
    const prefix = `HES-${year}-`

    const { data, error } = await supabase
      .from('solicitudes_hes')
      .select('numero_solicitud')
      .like('numero_solicitud', `${prefix}%`)
      .order('numero_solicitud', { ascending: false })
      .limit(1)

    if (error) throw error

    if (data.length === 0) {
      return `${prefix}0001`
    }

    const lastNumber = parseInt(data[0].numero_solicitud.split('-')[2])
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0')
    return `${prefix}${nextNumber}`
  },

  // Archivos
  async createArchivo(archivoData) {
    const { data, error } = await supabase
      .from('archivos_solicitud')
      .insert(archivoData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getArchivoById(id) {
    const { data, error } = await supabase
      .from('archivos_solicitud')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Usuarios admin
  async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios_admin')
      .select('id, email, nombre, activo, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getUsuarioByEmail(email) {
    const { data, error } = await supabase
      .from('usuarios_admin')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  async getUsuarioById(id) {
    const { data, error } = await supabase
      .from('usuarios_admin')
      .select('id, email, nombre, activo, created_at')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createUsuario(usuarioData) {
    const { data, error } = await supabase
      .from('usuarios_admin')
      .insert(usuarioData)
      .select('id, email, nombre, activo, created_at')
      .single()

    if (error) throw error
    return data
  },

  async deleteUsuario(id) {
    const { error } = await supabase
      .from('usuarios_admin')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Empresas
  async getEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('activo', true)
      .order('nombre')

    if (error) throw error
    return data
  },

  async createEmpresa(empresaData) {
    const { data, error } = await supabase
      .from('empresas')
      .insert(empresaData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteEmpresa(id) {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Configuración
  async getConfiguracion() {
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')

    if (error) throw error

    // Convertir array a objeto
    const config = {}
    data.forEach(item => {
      config[item.key] = item.value
    })

    return config
  },

  async setConfiguracion(key, value) {
    const { error } = await supabase
      .from('configuracion')
      .upsert({ key, value })

    if (error) throw error
  },

  // Log de emails
  async logEmail(logData) {
    const { error } = await supabase
      .from('log_emails')
      .insert(logData)

    if (error) console.error('Error al registrar email:', error)
  }
}
