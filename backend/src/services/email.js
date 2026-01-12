import nodemailer from 'nodemailer'
import { config } from '../config/env.js'
import { db } from './database.js'

// Crear transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
})

// Plantillas de email

const getEmailTemplate = (tipo, data) => {
  switch (tipo) {
    case 'confirmacion_solicitud':
      return {
        subject: `Solicitud HES ${data.numero_solicitud} recibida`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>Solicitud HES Recibida</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <p>Estimado/a <strong>${data.nombre_solicitante}</strong>,</p>
              <p>Su solicitud de HES ha sido recibida exitosamente.</p>

              <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3b82f6; margin-top: 0;">Detalles de la Solicitud</h3>
                <p><strong>Número de solicitud:</strong> ${data.numero_solicitud}</p>
                <p><strong>Empresa/Contrato:</strong> ${data.empresa_contrato}</p>
                <p><strong>Moneda:</strong> ${data.moneda}</p>
                <p><strong>Monto:</strong> ${parseFloat(data.monto).toLocaleString()}</p>
                <p><strong>Descripción:</strong> ${data.descripcion}</p>
              </div>

              <p>Le notificaremos por correo electrónico cuando su solicitud sea procesada.</p>
              <p>Saludos cordiales,<br><strong>Equipo HES</strong></p>
            </div>
          </div>
        `
      }

    case 'notificacion_equipo':
      return {
        subject: `Nueva solicitud HES ${data.numero_solicitud} - ${data.empresa_contrato}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>Nueva Solicitud HES</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <p>Se ha recibido una nueva solicitud de HES:</p>

              <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Número:</strong> ${data.numero_solicitud}</p>
                <p><strong>Solicitante:</strong> ${data.nombre_solicitante}</p>
                <p><strong>Email:</strong> ${data.email_solicitante}</p>
                <p><strong>Empresa/Contrato:</strong> ${data.empresa_contrato}</p>
                <p><strong>Moneda:</strong> ${data.moneda}</p>
                <p><strong>Monto:</strong> ${parseFloat(data.monto).toLocaleString()}</p>
                <p><strong>Descripción:</strong> ${data.descripcion}</p>
              </div>

              <p>
                <a href="${data.dashboard_url || 'http://localhost:3000/admin/dashboard'}"
                   style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Ver en Dashboard
                </a>
              </p>
            </div>
          </div>
        `
      }

    case 'hes_completada':
      return {
        subject: `HES ${data.numero_hes} procesada - Solicitud ${data.numero_solicitud}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
              <h1>HES Procesada</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <p>Estimado/a <strong>${data.nombre_solicitante}</strong>,</p>
              <p>Su solicitud de HES ha sido procesada exitosamente.</p>

              <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #10b981; margin-top: 0;">Información de su HES</h3>
                <p><strong>Número de solicitud:</strong> ${data.numero_solicitud}</p>
                <p><strong>Número HES asignado:</strong> ${data.numero_hes}</p>
              </div>

              ${data.mensaje ? `<p>${data.mensaje}</p>` : ''}

              <p>El archivo con las instrucciones se encuentra adjunto a este correo.</p>
              <p>Saludos cordiales,<br><strong>Equipo HES</strong></p>
            </div>
          </div>
        `
      }

    case 'solicitud_pausada':
      return {
        subject: `Solicitud HES ${data.numero_solicitud} pausada - Acción requerida`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f59e0b; color: white; padding: 20px; text-align: center;">
              <h1>Solicitud Pausada</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <p>Estimado/a <strong>${data.nombre_solicitante}</strong>,</p>
              <p>Su solicitud de HES <strong>${data.numero_solicitud}</strong> ha sido pausada temporalmente.</p>

              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin-top: 0;">Motivo</h3>
                <p style="color: #78350f;">${data.motivo_pausa}</p>
              </div>

              <p>Por favor, envíe la información adicional solicitada respondiendo a este correo.</p>
              <p>Una vez recibida, procederemos con el procesamiento de su solicitud.</p>
              <p>Saludos cordiales,<br><strong>Equipo HES</strong></p>
            </div>
          </div>
        `
      }

    case 'solicitud_reactivada':
      return {
        subject: `Solicitud HES ${data.numero_solicitud} reactivada`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>Solicitud Reactivada</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <p>Estimado/a <strong>${data.nombre_solicitante}</strong>,</p>
              <p>Su solicitud de HES <strong>${data.numero_solicitud}</strong> ha sido reactivada y está siendo procesada.</p>
              <p>Le notificaremos cuando esté completada.</p>
              <p>Saludos cordiales,<br><strong>Equipo HES</strong></p>
            </div>
          </div>
        `
      }

    default:
      return null
  }
}

// Función principal para enviar emails
export const sendEmail = async (tipo, destinatario, data, adjuntos = []) => {
  try {
    const template = getEmailTemplate(tipo, data)
    if (!template) {
      throw new Error(`Plantilla de email no encontrada: ${tipo}`)
    }

    const mailOptions = {
      from: config.email.from,
      to: destinatario,
      subject: template.subject,
      html: template.html,
      attachments: adjuntos
    }

    const info = await transporter.sendMail(mailOptions)

    // Registrar en log
    await db.logEmail({
      solicitud_id: data.solicitud_id || null,
      tipo,
      destinatario,
      asunto: template.subject,
      status: 'enviado'
    })

    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error('Error al enviar email:', error)

    // Registrar error en log
    await db.logEmail({
      solicitud_id: data.solicitud_id || null,
      tipo,
      destinatario,
      asunto: tipo,
      status: 'error'
    })

    return { success: false, error: error.message }
  }
}

// Función para obtener emails del equipo HES
export const getEquipoHESEmails = async () => {
  const config = await db.getConfiguracion()
  const emailsStr = config.email_equipo_hes || ''

  return emailsStr
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0)
}
