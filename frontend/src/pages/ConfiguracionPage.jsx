import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'
import axios from 'axios'

const ConfiguracionPage = () => {
  const [activeTab, setActiveTab] = useState('usuarios')
  const [usuarios, setUsuarios] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [configuracion, setConfiguracion] = useState({
    nombre_empresa: '',
    email_equipo_hes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [usersRes, empresasRes, configRes] = await Promise.all([
        axios.get('/api/admin/usuarios'),
        axios.get('/api/admin/empresas'),
        axios.get('/api/admin/configuracion')
      ])

      setUsuarios(usersRes.data)
      setEmpresas(empresasRes.data)
      setConfiguracion(configRes.data)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      alert('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleGuardarConfiguracion = async () => {
    try {
      await axios.put('/api/admin/configuracion', configuracion)
      alert('Configuración guardada exitosamente')
    } catch (error) {
      console.error('Error al guardar configuración:', error)
      alert('Error al guardar la configuración')
    }
  }

  const handleAgregarUsuario = async () => {
    const nombre = prompt('Nombre del usuario:')
    if (!nombre) return

    const email = prompt('Email del usuario:')
    if (!email) return

    const password = prompt('Contraseña:')
    if (!password) return

    try {
      await axios.post('/api/admin/usuarios', { nombre, email, password })
      cargarDatos()
      alert('Usuario creado exitosamente')
    } catch (error) {
      console.error('Error al crear usuario:', error)
      alert(error.response?.data?.error || 'Error al crear usuario')
    }
  }

  const handleEliminarUsuario = async (id) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return

    try {
      await axios.delete(`/api/admin/usuarios/${id}`)
      cargarDatos()
      alert('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      alert('Error al eliminar usuario')
    }
  }

  const handleAgregarEmpresa = async () => {
    const nombre = prompt('Nombre de la empresa/contrato:')
    if (!nombre) return

    try {
      await axios.post('/api/admin/empresas', { nombre })
      cargarDatos()
      alert('Empresa agregada exitosamente')
    } catch (error) {
      console.error('Error al agregar empresa:', error)
      alert('Error al agregar empresa')
    }
  }

  const handleEliminarEmpresa = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta empresa?')) return

    try {
      await axios.delete(`/api/admin/empresas/${id}`)
      cargarDatos()
      alert('Empresa eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar empresa:', error)
      alert('Error al eliminar empresa')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">
            Administración del sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'usuarios'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios Administradores
            </button>
            <button
              onClick={() => setActiveTab('empresas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'empresas'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Empresas/Contratos
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
          </nav>
        </div>

        {/* Contenido */}
        {activeTab === 'usuarios' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Usuarios Administradores
              </h2>
              <button
                onClick={handleAgregarUsuario}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Agregar Usuario
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-600">Cargando...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {usuario.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${
                            usuario.activo ? 'badge-green' : 'badge-orange'
                          }`}>
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEliminarUsuario(usuario.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'empresas' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Empresas/Contratos
              </h2>
              <button
                onClick={handleAgregarEmpresa}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Agregar Empresa
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-600">Cargando...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {empresas.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {empresa.nombre}
                    </span>
                    <button
                      onClick={() => handleEliminarEmpresa(empresa.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'general' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Configuración General
            </h2>

            <div className="space-y-6">
              <div>
                <label className="label">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={configuracion.nombre_empresa}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    nombre_empresa: e.target.value
                  })}
                  className="input"
                  placeholder="Mi Empresa"
                />
              </div>

              <div>
                <label className="label">Emails del Equipo HES</label>
                <input
                  type="text"
                  value={configuracion.email_equipo_hes}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    email_equipo_hes: e.target.value
                  })}
                  className="input"
                  placeholder="equipo@empresa.com, admin@empresa.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separar múltiples emails con comas
                </p>
              </div>

              <button
                onClick={handleGuardarConfiguracion}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save size={18} />
                Guardar Configuración
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ConfiguracionPage
