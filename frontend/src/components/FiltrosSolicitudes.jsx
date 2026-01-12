import { Search, X } from 'lucide-react'

const FiltrosSolicitudes = ({ filtros, setFiltros, empresas }) => {
  const estados = ['Pendiente', 'En Proceso', 'Pausada', 'Completada']

  const handleChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      empresa: '',
      busqueda: '',
      fechaDesde: '',
      fechaHasta: ''
    })
  }

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label className="label">Buscar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => handleChange('busqueda', e.target.value)}
              className="input pl-10"
              placeholder="Número, nombre o email..."
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="label">Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="input"
          >
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        {/* Empresa */}
        <div>
          <label className="label">Empresa</label>
          <select
            value={filtros.empresa}
            onChange={(e) => handleChange('empresa', e.target.value)}
            className="input"
          >
            <option value="">Todas</option>
            {empresas.map(empresa => (
              <option key={empresa} value={empresa}>{empresa}</option>
            ))}
          </select>
        </div>

        {/* Botón limpiar */}
        <div className="flex items-end">
          <button
            onClick={limpiarFiltros}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <X size={18} />
            Limpiar
          </button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="label">Desde</label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => handleChange('fechaDesde', e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Hasta</label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => handleChange('fechaHasta', e.target.value)}
            className="input"
          />
        </div>
      </div>
    </div>
  )
}

export default FiltrosSolicitudes
