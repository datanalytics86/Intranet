import { Eye, Send, Pause, Play } from 'lucide-react'

const SolicitudesTable = ({
  solicitudes,
  loading,
  onVerDetalle,
  onEnviarHES,
  onPausarHES,
  onReactivar
}) => {
  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'badge-yellow',
      'En Proceso': 'badge-blue',
      'Pausada': 'badge-orange',
      'Completada': 'badge-green'
    }
    return badges[estado] || 'badge-yellow'
  }

  const formatMonto = (monto) => {
    return parseFloat(monto).toLocaleString('es-CL')
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL')
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Cargando solicitudes...</p>
      </div>
    )
  }

  if (solicitudes.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">No se encontraron solicitudes</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solicitante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moneda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                  {solicitud.numero_solicitud}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatFecha(solicitud.fecha_solicitud)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {solicitud.nombre_solicitante}
                  </div>
                  <div className="text-sm text-gray-500">
                    {solicitud.email_solicitante}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {solicitud.empresa_contrato}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {solicitud.moneda === 'Otra' ? solicitud.moneda_otra : solicitud.moneda}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatMonto(solicitud.monto)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${getEstadoBadge(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onVerDetalle(solicitud)}
                      className="text-primary-600 hover:text-primary-800"
                      title="Ver detalle"
                    >
                      <Eye size={18} />
                    </button>

                    {(solicitud.estado === 'Pendiente' || solicitud.estado === 'En Proceso') && (
                      <>
                        <button
                          onClick={() => onEnviarHES(solicitud)}
                          className="text-green-600 hover:text-green-800"
                          title="Enviar HES"
                        >
                          <Send size={18} />
                        </button>
                        <button
                          onClick={() => onPausarHES(solicitud)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Pausar"
                        >
                          <Pause size={18} />
                        </button>
                      </>
                    )}

                    {solicitud.estado === 'Pausada' && (
                      <button
                        onClick={() => onReactivar(solicitud)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Reactivar"
                      >
                        <Play size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SolicitudesTable
