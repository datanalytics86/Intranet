import { db } from '../services/database.js'
import { downloadFile } from '../services/storage.js'

export const getArchivo = async (req, res) => {
  try {
    const { id } = req.params

    const archivo = await db.getArchivoById(id)

    if (!archivo) {
      return res.status(404).json({ error: 'Archivo no encontrado' })
    }

    // Descargar archivo desde storage
    const fileBlob = await downloadFile(archivo.url_storage)

    // Configurar headers para descarga
    res.setHeader('Content-Type', archivo.tipo_archivo)
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre_archivo}"`)

    // Convertir blob a buffer y enviar
    const buffer = Buffer.from(await fileBlob.arrayBuffer())
    res.send(buffer)

  } catch (error) {
    console.error('Error al descargar archivo:', error)
    res.status(500).json({ error: 'Error al descargar archivo' })
  }
}
