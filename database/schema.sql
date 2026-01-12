-- ============================================
-- SISTEMA DE GESTIÓN HES
-- Script de creación de base de datos
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: solicitudes_hes
-- ============================================
CREATE TABLE IF NOT EXISTS solicitudes_hes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_solicitud VARCHAR(20) UNIQUE NOT NULL,
  nombre_solicitante VARCHAR(255) NOT NULL,
  email_solicitante VARCHAR(255) NOT NULL,
  empresa_contrato VARCHAR(255) NOT NULL,
  moneda VARCHAR(10) NOT NULL,
  moneda_otra VARCHAR(50),
  monto DECIMAL(15,2) NOT NULL,
  descripcion TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Proceso', 'Pausada', 'Completada')),
  numero_hes VARCHAR(50),
  motivo_pausa TEXT,
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
  fecha_resolucion TIMESTAMP,
  fecha_pausa TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para solicitudes_hes
CREATE INDEX IF NOT EXISTS idx_solicitudes_numero ON solicitudes_hes(numero_solicitud);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_hes(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_email ON solicitudes_hes(email_solicitante);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes_hes(fecha_solicitud DESC);

-- ============================================
-- TABLA: archivos_solicitud
-- ============================================
CREATE TABLE IF NOT EXISTS archivos_solicitud (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES solicitudes_hes(id) ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  url_storage TEXT NOT NULL,
  tipo_archivo VARCHAR(100),
  tamano_bytes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para archivos_solicitud
CREATE INDEX IF NOT EXISTS idx_archivos_solicitud ON archivos_solicitud(solicitud_id);

-- ============================================
-- TABLA: usuarios_admin
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios_admin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para usuarios_admin
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios_admin(email);

-- ============================================
-- TABLA: configuracion
-- ============================================
CREATE TABLE IF NOT EXISTS configuracion (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar configuración por defecto
INSERT INTO configuracion (key, value) VALUES
  ('nombre_empresa', 'Mi Empresa'),
  ('email_equipo_hes', 'equipo@empresa.com')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- TABLA: empresas
-- ============================================
CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar empresas por defecto
INSERT INTO empresas (nombre) VALUES
  ('Empresa A'),
  ('Empresa B'),
  ('Contrato C')
ON CONFLICT DO NOTHING;

-- ============================================
-- TABLA: log_emails
-- ============================================
CREATE TABLE IF NOT EXISTS log_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes_hes(id) ON DELETE SET NULL,
  tipo VARCHAR(50) NOT NULL,
  destinatario VARCHAR(255) NOT NULL,
  asunto VARCHAR(255),
  enviado_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'enviado'
);

-- Índices para log_emails
CREATE INDEX IF NOT EXISTS idx_log_emails_solicitud ON log_emails(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_log_emails_fecha ON log_emails(enviado_at DESC);

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE solicitudes_hes ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_emails ENABLE ROW LEVEL SECURITY;

-- Políticas para solicitudes_hes
-- Permitir INSERT a usuarios anónimos (para crear solicitudes desde el formulario público)
CREATE POLICY "Permitir INSERT público en solicitudes"
  ON solicitudes_hes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Permitir todo a usuarios autenticados en solicitudes"
  ON solicitudes_hes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para archivos_solicitud
CREATE POLICY "Permitir INSERT público en archivos"
  ON archivos_solicitud FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Permitir todo a usuarios autenticados en archivos"
  ON archivos_solicitud FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para usuarios_admin
CREATE POLICY "Permitir SELECT a usuarios autenticados en usuarios_admin"
  ON usuarios_admin FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir INSERT/UPDATE/DELETE a usuarios autenticados en usuarios_admin"
  ON usuarios_admin FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir SELECT sin autenticación para login
CREATE POLICY "Permitir SELECT público en usuarios_admin para login"
  ON usuarios_admin FOR SELECT
  TO anon
  USING (true);

-- Políticas para configuracion
CREATE POLICY "Permitir SELECT público en configuracion"
  ON configuracion FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir UPDATE a usuarios autenticados en configuracion"
  ON configuracion FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para empresas
CREATE POLICY "Permitir SELECT público en empresas"
  ON empresas FOR SELECT
  TO anon, authenticated
  USING (activo = true);

CREATE POLICY "Permitir todo a usuarios autenticados en empresas"
  ON empresas FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para log_emails
CREATE POLICY "Permitir INSERT público en log_emails"
  ON log_emails FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir SELECT a usuarios autenticados en log_emails"
  ON log_emails FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para solicitudes_hes
DROP TRIGGER IF EXISTS update_solicitudes_hes_updated_at ON solicitudes_hes;
CREATE TRIGGER update_solicitudes_hes_updated_at
  BEFORE UPDATE ON solicitudes_hes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para configuracion
DROP TRIGGER IF EXISTS update_configuracion_updated_at ON configuracion;
CREATE TRIGGER update_configuracion_updated_at
  BEFORE UPDATE ON configuracion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET PARA ARCHIVOS
-- ============================================

-- Nota: Esto debe ejecutarse desde la consola de Supabase Storage
-- o mediante el SDK de JavaScript, no es parte del SQL schema.

-- En la consola de Supabase:
-- 1. Ir a Storage
-- 2. Crear un bucket llamado "hes-archivos"
-- 3. Configurar las políticas de acceso:
--    - Permitir INSERT a usuarios anónimos y autenticados
--    - Permitir SELECT/DELETE a usuarios autenticados

-- Ejemplo de políticas de storage (ejecutar en la consola de Supabase):
/*
-- Política de INSERT
CREATE POLICY "Permitir upload a todos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'hes-archivos');

-- Política de SELECT
CREATE POLICY "Permitir download a autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hes-archivos');

-- Política de DELETE
CREATE POLICY "Permitir delete a autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hes-archivos');
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificar creación de tablas
SELECT 'Tablas creadas exitosamente' AS mensaje;

-- Mostrar resumen
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'solicitudes_hes',
  'archivos_solicitud',
  'usuarios_admin',
  'configuracion',
  'empresas',
  'log_emails'
)
ORDER BY tablename;
