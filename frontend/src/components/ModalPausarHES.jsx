import { useState } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'

const ModalPausarHES = ({ solicitud, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!motivo.trim()) {
      setError('Debe especificar el motivo de la pausa')
      return
    }

    setLoading(true)

    try {
      await axios.patch(`/api/solicitudes/${solicitud.id}/pausar`, {
        motivo_pausa: motivo
      })

      alert('Solicitud pausada exitosamente')
      onSuccess()

    } catch (error) {
      console.error('Error al pausar solicitud:', error)
      alert(error.response?.data?.error || 'Error al pausar solicitud')
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
              Pausar Solicitud
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
          {/* Motivo */}
          <div>
            <label className="label">
              Motivo de la Pausa <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                setError('')
              }}
              className={`input ${error ? 'border-red-500' : ''}`}
              rows="5"
              placeholder="Especifique el motivo por el cual se pausa esta solicitud..."
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Información */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              Se enviará un correo al solicitante indicando que debe enviar información adicional.
              La solicitud será marcada como Pausada.
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
              className="btn btn-danger flex-1"
              disabled={loading}
            >
              {loading ? 'Pausando...' : 'Pausar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalPausarHES
