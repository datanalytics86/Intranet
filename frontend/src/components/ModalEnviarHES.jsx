import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import axios from 'axios'

const ModalEnviarHES = ({ solicitud, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    numero_hes: '',
    mensaje: ''
  })
  const [archivo, setArchivo] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ archivo: 'Solo se permiten archivos PDF' })
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ archivo: 'El archivo no debe superar 10MB' })
        return
      }
      setArchivo(file)
      setErrors({ ...errors, archivo: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.numero_hes.trim()) {
      newErrors.numero_hes = 'Campo requerido'
    }

    if (!archivo) {
      newErrors.archivo = 'Debe adjuntar el archivo con instrucciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const data = new FormData()
      data.append('numero_hes', formData.numero_hes)
      data.append('mensaje', formData.mensaje)
      data.append('archivo', archivo)

      await axios.post(`/api/solicitudes/${solicitud.id}/enviar`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('HES enviada exitosamente')
      onSuccess()

    } catch (error) {
      console.error('Error al enviar HES:', error)
      alert(error.response?.data?.error || 'Error al enviar HES')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Enviar HES
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Solicitud: {solicitud.numero_solicitud}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Número HES */}
          <div>
            <label className="label">
              Número HES Asignado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="numero_hes"
              value={formData.numero_hes}
              onChange={handleChange}
              className={`input ${errors.numero_hes ? 'border-red-500' : ''}`}
              placeholder="HES-2024-001"
            />
            {errors.numero_hes && (
              <p className="text-red-500 text-sm mt-1">{errors.numero_hes}</p>
            )}
          </div>

          {/* Archivo */}
          <div>
            <label className="label">
              Archivo con Instrucciones (PDF) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                id="archivo-hes"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="archivo-hes"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {archivo ? archivo.name : 'Seleccionar archivo PDF'}
                </span>
              </label>
            </div>
            {errors.archivo && (
              <p className="text-red-500 text-sm mt-1">{errors.archivo}</p>
            )}
          </div>

          {/* Mensaje adicional */}
          <div>
            <label className="label">
              Mensaje Adicional (Opcional)
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="input"
              rows="4"
              placeholder="Mensaje adicional para el solicitante..."
            />
          </div>

          {/* Información */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Se enviará un correo al solicitante con el número HES y el archivo adjunto.
              La solicitud será marcada como Completada.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-success flex-1"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar HES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEnviarHES
