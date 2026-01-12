import { X, Download } from 'lucide-react'
import axios from 'axios'

const ModalDetalle = ({ solicitud, onClose }) => {
  const formatMonto = (monto) => {
    return parseFloat(monto).toLocaleString('es-CL')
  }

  const formatFecha = (fecha) => {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleString('es-CL')
  }

  const handleDownload = async (archivoId, nombreArchivo) => {
    try {
      const response = await axios.get(`/api/archivos/${archivoId}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', nombreArchivo)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error al descargar archivo:', error)
      alert('Error al descargar el archivo')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalle de Solicitud
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información general */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de Solicitud</p>
                <p className="text-base font-medium text-gray-900">
                  {solicitud.numero_solicitud}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <span className={`badge ${
                  solicitud.estado === 'Pendiente' ? 'badge-yellow' :
                  solicitud.estado === 'En Proceso' ? 'badge-blue' :
                  solicitud.estado === 'Pausada' ? 'badge-orange' :
                  'badge-green'
                }`}>
                  {solicitud.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Solicitud</p>
                <p className="text-base font-medium text-gray-900">
                  {formatFecha(solicitud.fecha_solicitud)}
                </p>
              </div>
              {solicitud.numero_hes && (
                <div>
                  <p className="text-sm text-gray-600">Número HES</p>
                  <p className="text-base font-medium text-gray-900">
                    {solicitud.numero_hes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Solicitante */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Solicitante
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="text-base font-medium text-gray-900">
                  {solicitud.nombre_solicitante}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base font-medium text-gray-900">
                  {solicitud.email_solicitante}
                </p>
              </div>
            </div>
          </div>

          {/* Detalles financieros */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles Financieros
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Empresa/Contrato</p>
                <p className="text-base font-medium text-gray-900">
                  {solicitud.empresa_contrato}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Moneda</p>
                <p className="text-base font-medium text-gray-900">
                  {solicitud.moneda === 'Otra' ? solicitud.moneda_otra : solicitud.moneda}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Monto a Liberar</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatMonto(solicitud.monto)}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Descripción
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {solicitud.descripcion}
              </p>
            </div>
          </div>

          {/* Archivos adjuntos */}
          {solicitud.archivos && solicitud.archivos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Archivos Adjuntos
              </h3>
              <div className="space-y-2">
                {solicitud.archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {archivo.nombre_archivo}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(archivo.tamano_bytes / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(archivo.id, archivo.nombre_archivo)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          {(solicitud.motivo_pausa || solicitud.fecha_resolucion) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información Adicional
              </h3>
              <div className="space-y-3">
                {solicitud.motivo_pausa && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange-900 mb-1">
                      Motivo de Pausa
                    </p>
                    <p className="text-sm text-orange-700">
                      {solicitud.motivo_pausa}
                    </p>
                    <p className="text-xs text-orange-600 mt-2">
                      Fecha: {formatFecha(solicitud.fecha_pausa)}
                    </p>
                  </div>
                )}
                {solicitud.fecha_resolucion && (
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Resolución</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatFecha(solicitud.fecha_resolucion)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalDetalle
