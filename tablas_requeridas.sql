-- =============================================================================
-- NISSAN GASME - Esquema de Base de Datos Profesional
-- Diseñado para: Bolsa de Trabajo y Gestión de Candidatos
-- =============================================================================

-- 1. Áreas (Categorías de las vacantes)
-- Clasifica los puestos de trabajo para facilitar la navegación.
CREATE TABLE IF NOT EXISTS areas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sucursales (Ubicaciones)
-- Diferentes sedes o agencias donde se encuentran las vacantes.
CREATE TABLE IF NOT EXISTS sucursales (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Etapas Pipeline (Proceso de contratación)
-- Define el flujo por el que pasa un candidato (Ej: Nuevo, Entrevista, Contratado).
CREATE TABLE IF NOT EXISTS etapas_pipeline (
  id        SERIAL PRIMARY KEY,
  codigo    VARCHAR(40) NOT NULL UNIQUE, -- Ej: 'NEW', 'REV', 'ENT', 'CON', 'REJ'
  nombre    VARCHAR(80) NOT NULL,
  orden     SMALLINT NOT NULL DEFAULT 0,
  activo    BOOLEAN DEFAULT true
);

-- 4. Usuarios
-- Para acceso administrativo o de candidatos (opcional).
CREATE TABLE IF NOT EXISTS usuarios (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255),
  nombre          VARCHAR(120),
  rol             VARCHAR(30) NOT NULL DEFAULT 'candidato', 
  activo          BOOLEAN DEFAULT true,
  creado_en       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Vacantes (Puestos de trabajo publicados)
CREATE TABLE IF NOT EXISTS vacantes (
  id                SERIAL PRIMARY KEY,
  area_id           INT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  sucursal_id       INT REFERENCES sucursales(id) ON DELETE SET NULL,
  titulo            VARCHAR(180) NOT NULL,
  descripcion       TEXT,
  requisitos        TEXT,
  beneficios        TEXT,
  estatus           VARCHAR(30) NOT NULL DEFAULT 'Abierta', -- Abierta, Cerrada, Pausada
  fecha_publicacion DATE DEFAULT CURRENT_DATE,
  fecha_inicio      DATE,
  fecha_fin         DATE,
  creado_en         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Candidatos
-- Información detallada y almacenamiento de currículum.
CREATE TABLE IF NOT EXISTS candidatos (
  id               SERIAL PRIMARY KEY,
  usuario_id       INT UNIQUE REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre           VARCHAR(180) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  telefono         VARCHAR(40),
  ubicacion        VARCHAR(200),
  experiencia      TEXT,
  educacion        TEXT,
  puesto_actual    VARCHAR(180),
  cv_text          TEXT,             -- Texto extraído para búsquedas
  cv_url           TEXT,             -- Ruta al archivo en el servidor
  cv_blob          BYTEA,            -- Respaldo binario del archivo
  cv_mimetype      VARCHAR(100),     -- Tipo de archivo (application/pdf, etc)
  creado_en        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Postulaciones
-- Relación entre vacantes y candidatos con seguimiento de etapa.
CREATE TABLE IF NOT EXISTS postulaciones (
  id                  SERIAL PRIMARY KEY,
  candidato_id        INT NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  vacante_id          INT NOT NULL REFERENCES vacantes(id) ON DELETE CASCADE,
  etapa_id            INT NOT NULL REFERENCES etapas_pipeline(id) ON DELETE RESTRICT,
  codigo_seguimiento  VARCHAR(40) UNIQUE, -- Código alfanumérico para el candidato
  notas               TEXT,
  creado_en           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(candidato_id, vacante_id)
);

-- Índices para optimización de consultas comunes
CREATE INDEX IF NOT EXISTS idx_postulaciones_codigo ON postulaciones(codigo_seguimiento);
CREATE INDEX IF NOT EXISTS idx_candidatos_email ON candidatos(email);
CREATE INDEX IF NOT EXISTS idx_vacantes_estatus ON vacantes(estatus);

-- =============================================================================
-- DATOS INICIALES (Configuración básica del sistema)
-- =============================================================================

INSERT INTO areas (nombre) VALUES 
('Ventas'), ('Servicio'), ('Administración'), ('Refacciones'), ('Sistemas')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO sucursales (nombre) VALUES 
('Gasme Córdoba'), ('Gasme Orizaba'), ('Gasme Tierra Blanca'), ('Gasme Xalapa')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO etapas_pipeline (codigo, nombre, orden) VALUES 
('NEW', 'Nuevo Postulado', 1),
('REV', 'En Revisión', 2),
('ENT', 'Entrevista', 3),
('OFE', 'Oferta', 4),
('CON', 'Contratado', 5),
('REJ', 'Rechazado', 6)
ON CONFLICT (codigo) DO NOTHING;
