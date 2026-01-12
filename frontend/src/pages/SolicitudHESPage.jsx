import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, CheckCircle } from 'lucide-react'
import axios from 'axios'

const SolicitudHESPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [numeroSolicitud, setNumeroSolicitud] = useState('')
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    nombre_solicitante: '',
    email_solicitante: '',
    empresa_contrato: '',
    moneda: '',
    moneda_otra: '',
    monto: '',
    descripcion: '',
  })

  const [archivos, setArchivos] = useState([])

  const monedas = ['UF', 'CLP', 'AUD', 'USD', 'Otra']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = []
    const newErrors = {}

    files.forEach(file => {
      // Validar extensión
      const ext = file.name.split('.').pop().toLowerCase()
      if (!['pdf', 'xlsx', 'xls', 'doc', 'docx'].includes(ext)) {
        newErrors.archivos = 'Solo se permiten archivos PDF, Excel y Word'
        return
      }

      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        newErrors.archivos = 'Los archivos no deben superar 10MB'
        return
      }

      validFiles.push(file)
    })

    // Validar máximo 5 archivos
    if (archivos.length + validFiles.length > 5) {
      newErrors.archivos = 'Máximo 5 archivos permitidos'
      setErrors(prev => ({ ...prev, ...newErrors }))
      return
    }

    setArchivos(prev => [...prev, ...validFiles])
    setErrors(prev => ({ ...prev, ...newErrors }))
  }

  const removeFile = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre_solicitante.trim()) {
      newErrors.nombre_solicitante = 'Campo requerido'
    }

    if (!formData.email_solicitante.trim()) {
      newErrors.email_solicitante = 'Campo requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_solicitante)) {
      newErrors.email_solicitante = 'Email inválido'
    }

    if (!formData.empresa_contrato) {
      newErrors.empresa_contrato = 'Campo requerido'
    }

    if (!formData.moneda) {
      newErrors.moneda = 'Campo requerido'
    }

    if (formData.moneda === 'Otra' && !formData.moneda_otra.trim()) {
      newErrors.moneda_otra = 'Especifique la moneda'
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'Ingrese un monto válido'
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Campo requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const data = new FormData()

      // Agregar datos del formulario
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })

      // Agregar archivos
      archivos.forEach(archivo => {
        data.append('archivos', archivo)
      })

      const response = await axios.post('/api/solicitudes', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setNumeroSolicitud(response.data.numero_solicitud)
      setShowSuccess(true)

    } catch (error) {
      console.error('Error al enviar solicitud:', error)
      alert(error.response?.data?.error || 'Error al enviar la solicitud. Por favor intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Solicitud Enviada!
          </h2>
          <p className="text-gray-600 mb-4">
            Su solicitud ha sido registrada exitosamente.
          </p>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Número de seguimiento:</p>
            <p className="text-2xl font-bold text-primary-600">{numeroSolicitud}</p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Recibirá un correo de confirmación en {formData.email_solicitante}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary w-full"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitud de HES
          </h1>
          <p className="text-gray-600 mt-2">
            Complete el formulario para solicitar una Hoja de Estado de Pago
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="label">
              Nombre del Solicitante <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre_solicitante"
              value={formData.nombre_solicitante}
              onChange={handleChange}
              className={`input ${errors.nombre_solicitante ? 'border-red-500' : ''}`}
              placeholder="Juan Pérez"
            />
            {errors.nombre_solicitante && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre_solicitante}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email_solicitante"
              value={formData.email_solicitante}
              onChange={handleChange}
              className={`input ${errors.email_solicitante ? 'border-red-500' : ''}`}
              placeholder="juan.perez@empresa.com"
            />
            {errors.email_solicitante && (
              <p className="text-red-500 text-sm mt-1">{errors.email_solicitante}</p>
            )}
          </div>

          {/* Empresa/Contrato */}
          <div>
            <label className="label">
              Empresa/Contrato <span className="text-red-500">*</span>
            </label>
            <select
              name="empresa_contrato"
              value={formData.empresa_contrato}
              onChange={handleChange}
              className={`input ${errors.empresa_contrato ? 'border-red-500' : ''}`}
            >
              <option value="">Seleccione una empresa</option>
              <option value="Empresa A">Empresa A</option>
              <option value="Empresa B">Empresa B</option>
              <option value="Contrato C">Contrato C</option>
            </select>
            {errors.empresa_contrato && (
              <p className="text-red-500 text-sm mt-1">{errors.empresa_contrato}</p>
            )}
          </div>

          {/* Moneda */}
          <div>
            <label className="label">
              Moneda EDP <span className="text-red-500">*</span>
            </label>
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className={`input ${errors.moneda ? 'border-red-500' : ''}`}
            >
              <option value="">Seleccione una moneda</option>
              {monedas.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.moneda && (
              <p className="text-red-500 text-sm mt-1">{errors.moneda}</p>
            )}
          </div>

          {/* Moneda Otra */}
          {formData.moneda === 'Otra' && (
            <div>
              <label className="label">
                Especifique la moneda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="moneda_otra"
                value={formData.moneda_otra}
                onChange={handleChange}
                className={`input ${errors.moneda_otra ? 'border-red-500' : ''}`}
                placeholder="EUR, GBP, etc."
              />
              {errors.moneda_otra && (
                <p className="text-red-500 text-sm mt-1">{errors.moneda_otra}</p>
              )}
            </div>
          )}

          {/* Monto */}
          <div>
            <label className="label">
              Monto a Liberar <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className={`input ${errors.monto ? 'border-red-500' : ''}`}
              placeholder="1000000"
              step="0.01"
            />
            {errors.monto && (
              <p className="text-red-500 text-sm mt-1">{errors.monto}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="label">
              Descripción/Glosa <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`input ${errors.descripcion ? 'border-red-500' : ''}`}
              rows="4"
              placeholder="Descripción detallada del estado de pago..."
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
          </div>

          {/* Archivos */}
          <div>
            <label className="label">
              Archivos de Respaldo
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Máximo 5 archivos. Formatos: PDF, Excel, Word. Tamaño máximo: 10MB por archivo.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.xlsx,.xls,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={40} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Haga clic para seleccionar archivos
                </span>
              </label>
            </div>

            {errors.archivos && (
              <p className="text-red-500 text-sm mt-1">{errors.archivos}</p>
            )}

            {/* Lista de archivos */}
            {archivos.length > 0 && (
              <div className="mt-4 space-y-2">
                {archivos.map((archivo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {archivo.name}
                    </span>
                    <span className="text-xs text-gray-500 mx-2">
                      {(archivo.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SolicitudHESPage
