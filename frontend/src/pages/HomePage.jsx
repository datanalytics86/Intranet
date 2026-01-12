import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
            <FileText size={40} className="text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Gestión HES
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Plataforma para solicitud y gestión de Hojas de Estado de Pago
        </p>

        {/* Botón principal */}
        <Link
          to="/solicitud"
          className="inline-block w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Solicitar HES
        </Link>

        {/* Link admin */}
        <div className="mt-8">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            Acceso administrador
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
