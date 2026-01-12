import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import SolicitudesTable from '../components/SolicitudesTable'
import FiltrosSolicitudes from '../components/FiltrosSolicitudes'
import ModalDetalle from '../components/ModalDetalle'
import ModalEnviarHES from '../components/ModalEnviarHES'
import ModalPausarHES from '../components/ModalPausarHES'
import axios from 'axios'
import { Download, RefreshCw } from 'lucide-react'
import * as XLSX from 'xlsx'

const DashboardPage = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSolicitud, setSelectedSolicitud] = useState(null)
  const [modalDetalle, setModalDetalle] = useState(false)
  const [modalEnviar, setModalEnviar] = useState(false)
  const [modalPausar, setModalPausar] = useState(false)

  const [filtros, setFiltros] = useState({
    estado: '',
    empresa: '',
    busqueda: '',
    fechaDesde: '',
    fechaHasta: ''
  })

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [solicitudes, filtros])

  const cargarSolicitudes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/solicitudes')
      setSolicitudes(response.data)
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
      alert('Error al cargar las solicitudes')
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let filtered = [...solicitudes]

    // Filtro por estado
    if (filtros.estado) {
      filtered = filtered.filter(s => s.estado === filtros.estado)
    }

    // Filtro por empresa
    if (filtros.empresa) {
      filtered = filtered.filter(s => s.empresa_contrato === filtros.empresa)
    }

    // Búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase()
      filtered = filtered.filter(s =>
        s.numero_solicitud.toLowerCase().includes(busqueda) ||
        s.nombre_solicitante.toLowerCase().includes(busqueda) ||
        s.email_solicitante.toLowerCase().includes(busqueda)
      )
    }

    // Filtro por fecha
    if (filtros.fechaDesde) {
      filtered = filtered.filter(s =>
        new Date(s.fecha_solicitud) >= new Date(filtros.fechaDesde)
      )
    }

    if (filtros.fechaHasta) {
      filtered = filtered.filter(s =>
        new Date(s.fecha_solicitud) <= new Date(filtros.fechaHasta)
      )
    }

    setFilteredSolicitudes(filtered)
  }

  const handleVerDetalle = (solicitud) => {
    setSelectedSolicitud(solicitud)
    setModalDetalle(true)
  }

  const handleEnviarHES = (solicitud) => {
    setSelectedSolicitud(solicitud)
    setModalEnviar(true)
  }

  const handlePausarHES = (solicitud) => {
    setSelectedSolicitud(solicitud)
    setModalPausar(true)
  }

  const handleReactivar = async (solicitud) => {
    if (!confirm('¿Está seguro de reactivar esta solicitud?')) return

    try {
      await axios.patch(`/api/solicitudes/${solicitud.id}/reactivar`)
      cargarSolicitudes()
      alert('Solicitud reactivada exitosamente')
    } catch (error) {
      console.error('Error al reactivar:', error)
      alert('Error al reactivar la solicitud')
    }
  }

  const handleExportarExcel = () => {
    const data = filteredSolicitudes.map(s => ({
      'Número': s.numero_solicitud,
      'Fecha Solicitud': new Date(s.fecha_solicitud).toLocaleDateString(),
      'Solicitante': s.nombre_solicitante,
      'Email': s.email_solicitante,
      'Empresa/Contrato': s.empresa_contrato,
      'Moneda': s.moneda === 'Otra' ? s.moneda_otra : s.moneda,
      'Monto': parseFloat(s.monto).toLocaleString(),
      'Descripción': s.descripcion,
      'Estado': s.estado,
      'Número HES': s.numero_hes || '-',
      'Fecha Resolución': s.fecha_resolucion ?
        new Date(s.fecha_resolucion).toLocaleDateString() : '-',
      'Motivo Pausa': s.motivo_pausa || '-'
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes HES')

    const fecha = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `Solicitudes_HES_${fecha}.xlsx`)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Gestión de solicitudes HES
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={cargarSolicitudes}
              className="btn btn-secondary flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
            <button
              onClick={handleExportarExcel}
              className="btn btn-success flex items-center gap-2"
              disabled={filteredSolicitudes.length === 0}
            >
              <Download size={18} />
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {solicitudes.filter(s => s.estado === 'Pendiente').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-blue-600">
              {solicitudes.filter(s => s.estado === 'En Proceso').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-green-600">
              {solicitudes.filter(s => s.estado === 'Completada').length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosSolicitudes
          filtros={filtros}
          setFiltros={setFiltros}
          empresas={[...new Set(solicitudes.map(s => s.empresa_contrato))]}
        />

        {/* Tabla */}
        <SolicitudesTable
          solicitudes={filteredSolicitudes}
          loading={loading}
          onVerDetalle={handleVerDetalle}
          onEnviarHES={handleEnviarHES}
          onPausarHES={handlePausarHES}
          onReactivar={handleReactivar}
        />
      </div>

      {/* Modales */}
      {modalDetalle && (
        <ModalDetalle
          solicitud={selectedSolicitud}
          onClose={() => setModalDetalle(false)}
        />
      )}

      {modalEnviar && (
        <ModalEnviarHES
          solicitud={selectedSolicitud}
          onClose={() => setModalEnviar(false)}
          onSuccess={() => {
            setModalEnviar(false)
            cargarSolicitudes()
          }}
        />
      )}

      {modalPausar && (
        <ModalPausarHES
          solicitud={selectedSolicitud}
          onClose={() => setModalPausar(false)}
          onSuccess={() => {
            setModalPausar(false)
            cargarSolicitudes()
          }}
        />
      )}
    </Layout>
  )
}

export default DashboardPage
