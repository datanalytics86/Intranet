import { db } from '../services/database.js'
import { uploadFile } from '../services/storage.js'
import { sendEmail, getEquipoHESEmails } from '../services/email.js'

// Obtener todas las solicitudes
export const getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await db.getSolicitudes()
    res.json(solicitudes)
  } catch (error) {
    console.error('Error al obtener solicitudes:', error)
    res.status(500).json({ error: 'Error al obtener solicitudes' })
  }
}

// Obtener solicitud por ID
export const getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params
    const solicitud = await db.getSolicitudById(id)

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    res.json(solicitud)
  } catch (error) {
    console.error('Error al obtener solicitud:', error)
    res.status(500).json({ error: 'Error al obtener solicitud' })
  }
}

// Crear nueva solicitud
export const createSolicitud = async (req, res) => {
  try {
    const {
      nombre_solicitante,
      email_solicitante,
      empresa_contrato,
      moneda,
      moneda_otra,
      monto,
      descripcion
    } = req.body

    // Validar campos requeridos
    if (!nombre_solicitante || !email_solicitante || !empresa_contrato ||
        !moneda || !monto || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    // Generar número de solicitud
    const numero_solicitud = await db.getNextNumeroSolicitud()

    // Crear solicitud
    const solicitud = await db.createSolicitud({
      numero_solicitud,
      nombre_solicitante,
      email_solicitante,
      empresa_contrato,
      moneda,
      moneda_otra: moneda === 'Otra' ? moneda_otra : null,
      monto: parseFloat(monto),
      descripcion,
      estado: 'Pendiente'
    })

    // Procesar archivos adjuntos
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { path, url } = await uploadFile(file, `solicitudes/${solicitud.id}/`)

        await db.createArchivo({
          solicitud_id: solicitud.id,
          nombre_archivo: file.originalname,
          url_storage: path,
          tipo_archivo: file.mimetype,
          tamano_bytes: file.size
        })
      }
    }

    // Enviar email de confirmación al solicitante
    await sendEmail('confirmacion_solicitud', email_solicitante, {
      solicitud_id: solicitud.id,
      numero_solicitud,
      nombre_solicitante,
      empresa_contrato,
      moneda: moneda === 'Otra' ? moneda_otra : moneda,
      monto,
      descripcion
    })

    // Enviar notificación al equipo HES
    const equipoEmails = await getEquipoHESEmails()
    for (const email of equipoEmails) {
      await sendEmail('notificacion_equipo', email, {
        solicitud_id: solicitud.id,
        numero_solicitud,
        nombre_solicitante,
        email_solicitante,
        empresa_contrato,
        moneda: moneda === 'Otra' ? moneda_otra : moneda,
        monto,
        descripcion
      })
    }

    res.status(201).json({
      success: true,
      numero_solicitud,
      id: solicitud.id
    })

  } catch (error) {
    console.error('Error al crear solicitud:', error)
    res.status(500).json({ error: 'Error al crear solicitud' })
  }
}

// Enviar HES (completar solicitud)
export const enviarHES = async (req, res) => {
  try {
    const { id } = req.params
    const { numero_hes, mensaje } = req.body

    if (!numero_hes) {
      return res.status(400).json({ error: 'Número HES requerido' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Archivo con instrucciones requerido' })
    }

    // Obtener solicitud
    const solicitud = await db.getSolicitudById(id)
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    if (solicitud.estado !== 'Pendiente' && solicitud.estado !== 'En Proceso') {
      return res.status(400).json({ error: 'La solicitud no puede ser completada en su estado actual' })
    }

    // Subir archivo con instrucciones
    const { path, url } = await uploadFile(req.file, `hes/${id}/`)

    // Actualizar solicitud
    await db.updateSolicitud(id, {
      numero_hes,
      estado: 'Completada',
      fecha_resolucion: new Date().toISOString()
    })

    // Guardar archivo en la base de datos
    await db.createArchivo({
      solicitud_id: id,
      nombre_archivo: req.file.originalname,
      url_storage: path,
      tipo_archivo: req.file.mimetype,
      tamano_bytes: req.file.size
    })

    // Descargar el archivo para adjuntarlo al email
    const { downloadFile } = await import('../services/storage.js')
    const archivoBlob = await downloadFile(path)

    // Enviar email al solicitante con el archivo adjunto
    await sendEmail(
      'hes_completada',
      solicitud.email_solicitante,
      {
        solicitud_id: id,
        numero_solicitud: solicitud.numero_solicitud,
        numero_hes,
        nombre_solicitante: solicitud.nombre_solicitante,
        mensaje: mensaje || ''
      },
      [{
        filename: req.file.originalname,
        content: Buffer.from(await archivoBlob.arrayBuffer())
      }]
    )

    res.json({ success: true, message: 'HES enviada exitosamente' })

  } catch (error) {
    console.error('Error al enviar HES:', error)
    res.status(500).json({ error: 'Error al enviar HES' })
  }
}

// Pausar solicitud
export const pausarSolicitud = async (req, res) => {
  try {
    const { id } = req.params
    const { motivo_pausa } = req.body

    if (!motivo_pausa) {
      return res.status(400).json({ error: 'Motivo de pausa requerido' })
    }

    const solicitud = await db.getSolicitudById(id)
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    if (solicitud.estado !== 'Pendiente' && solicitud.estado !== 'En Proceso') {
      return res.status(400).json({ error: 'La solicitud no puede ser pausada en su estado actual' })
    }

    await db.updateSolicitud(id, {
      estado: 'Pausada',
      motivo_pausa,
      fecha_pausa: new Date().toISOString()
    })

    // Enviar email al solicitante
    await sendEmail('solicitud_pausada', solicitud.email_solicitante, {
      solicitud_id: id,
      numero_solicitud: solicitud.numero_solicitud,
      nombre_solicitante: solicitud.nombre_solicitante,
      motivo_pausa
    })

    res.json({ success: true, message: 'Solicitud pausada exitosamente' })

  } catch (error) {
    console.error('Error al pausar solicitud:', error)
    res.status(500).json({ error: 'Error al pausar solicitud' })
  }
}

// Reactivar solicitud
export const reactivarSolicitud = async (req, res) => {
  try {
    const { id } = req.params

    const solicitud = await db.getSolicitudById(id)
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }

    if (solicitud.estado !== 'Pausada') {
      return res.status(400).json({ error: 'La solicitud no está pausada' })
    }

    await db.updateSolicitud(id, {
      estado: 'En Proceso',
      motivo_pausa: null,
      fecha_pausa: null
    })

    // Enviar email al solicitante
    await sendEmail('solicitud_reactivada', solicitud.email_solicitante, {
      solicitud_id: id,
      numero_solicitud: solicitud.numero_solicitud,
      nombre_solicitante: solicitud.nombre_solicitante
    })

    res.json({ success: true, message: 'Solicitud reactivada exitosamente' })

  } catch (error) {
    console.error('Error al reactivar solicitud:', error)
    res.status(500).json({ error: 'Error al reactivar solicitud' })
  }
}
