import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import SolicitudHESPage from './pages/SolicitudHESPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/solicitud" element={<SolicitudHESPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
