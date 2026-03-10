-- =============================================================================
-- NISSAN GASME - Tablas requeridas (Basado en el uso del código)
-- =============================================================================

-- 1. Áreas (Categorías de las vacantes)
CREATE TABLE IF NOT EXISTS areas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sucursales (Ubicaciones)
CREATE TABLE IF NOT EXISTS sucursales (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Etapas Pipeline (Proceso de contratación)
CREATE TABLE IF NOT EXISTS etapas_pipeline (
  id        SERIAL PRIMARY KEY,
  codigo    VARCHAR(40) NOT NULL UNIQUE,
  nombre    VARCHAR(80) NOT NULL,
  orden     SMALLINT NOT NULL DEFAULT 0,
  activo    BOOLEAN DEFAULT true
);

-- 4. Usuarios (Autenticación general, opcional dependiendo si hay admin real)
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  nombre        VARCHAR(120),
  rol           VARCHAR(30) NOT NULL DEFAULT 'candidato', 
  activo        BOOLEAN DEFAULT true,
  creado_en     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Vacantes (Puestos de trabajo publicados)
CREATE TABLE IF NOT EXISTS vacantes (
  id           SERIAL PRIMARY KEY,
  area_id      INT NOT NULL REFERENCES areas(id),
  titulo       VARCHAR(180) NOT NULL,
  descripcion  TEXT,
  requisitos   TEXT,
  ubicacion    VARCHAR(200),
  beneficios   TEXT,
  estatus      VARCHAR(30) NOT NULL DEFAULT 'Abierta',
  fecha_publicacion DATE DEFAULT CURRENT_DATE,
  fecha_inicio DATE,
  fecha_fin    DATE,
  creado_en    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Candidatos (Personas que se postulan)
CREATE TABLE IF NOT EXISTS candidatos (
  id               SERIAL PRIMARY KEY,
  usuario_id       INT UNIQUE REFERENCES usuarios(id),
  nombre           VARCHAR(180) NOT NULL,
  apellido         VARCHAR(120),
  email            VARCHAR(255) NOT NULL UNIQUE,
  telefono         VARCHAR(40),
  ubicacion        VARCHAR(200),
  fecha_nacimiento DATE,
  genero           VARCHAR(20),
  experiencia      TEXT,
  educacion        TEXT,
  empresa_actual   VARCHAR(120),
  puesto_actual    VARCHAR(120),
  descripcion      TEXT,
  linkedin         VARCHAR(255),
  portfolio        VARCHAR(255),
  disponibilidad   VARCHAR(60),
  modalidad_pref   VARCHAR(40),
  salario_esperado DECIMAL(12,2),
  referencias      TEXT,
  cv_text          TEXT,
  cv_url           TEXT,
  creado_en        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Postulaciones (Relación entre vacantes y candidatos)
CREATE TABLE IF NOT EXISTS postulaciones (
  id            SERIAL PRIMARY KEY,
  candidato_id  INT NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  vacante_id    INT NOT NULL REFERENCES vacantes(id) ON DELETE CASCADE,
  etapa_id      INT NOT NULL REFERENCES etapas_pipeline(id),
  codigo_seguimiento VARCHAR(40) UNIQUE,
  notas         TEXT,
  creado_en     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(candidato_id, vacante_id)
);

-- =============================================================================
-- INSERCIÓN DE DATOS INICIALES (Semillas mínimas de uso en el código)
-- =============================================================================

INSERT INTO areas (nombre, descripcion) VALUES 
('Ventas', 'Área comercial y ventas al público'),
('Servicio', 'Mecánica, taller y servicio automotriz'),
('Administración', 'Contabilidad, finanzas y recursos humanos')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO sucursales (nombre) VALUES 
('Gasme Córdoba'),
('Gasme Orizaba'),
('Gasme Tierra Blanca'),
('Gasme Xalapa')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO etapas_pipeline (codigo, nombre, orden) VALUES 
('NEW', 'Nuevo Postulado', 1),
('REV', 'En Revisión', 2),
('ENT', 'Entrevista', 3),
('OFE', 'Oferta', 4),
('CON', 'Contratado', 5),
('REJ', 'Rechazado', 6)
ON CONFLICT (codigo) DO NOTHING;
