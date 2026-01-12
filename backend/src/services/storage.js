import { supabase } from './database.js'
import { config } from '../config/env.js'

const bucketName = config.supabase.bucketName

// Subir archivo a Supabase Storage
export const uploadFile = async (file, folder = '') => {
  try {
    const fileName = `${folder}${Date.now()}-${file.originalname}`
    const filePath = fileName.replace(/\s+/g, '-')

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      })

    if (error) throw error

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: publicUrlData.publicUrl
    }

  } catch (error) {
    console.error('Error al subir archivo:', error)
    throw new Error('Error al subir archivo a storage')
  }
}

// Descargar archivo de Supabase Storage
export const downloadFile = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath)

    if (error) throw error

    return data

  } catch (error) {
    console.error('Error al descargar archivo:', error)
    throw new Error('Error al descargar archivo')
  }
}

// Eliminar archivo de Supabase Storage
export const deleteFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) throw error

    return true

  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    throw new Error('Error al eliminar archivo')
  }
}

// Obtener URL pública de un archivo
export const getPublicUrl = (filePath) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return data.publicUrl
}
