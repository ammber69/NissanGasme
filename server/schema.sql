-- =============================================================================
-- LUMANI — Esquema de base de datos (PostgreSQL)
-- Sistema de Gestión de Reclutamiento y RR.HH.
-- =============================================================================

-- Extensiones útiles (opcional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Catálogos y tablas maestras
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS areas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL UNIQUE,
  descripcion TEXT,
  creado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS etapas_pipeline (
  id        SERIAL PRIMARY KEY,
  codigo    VARCHAR(40) NOT NULL UNIQUE,
  nombre    VARCHAR(80) NOT NULL,
  orden     SMALLINT NOT NULL DEFAULT 0,
  activo    BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS turnos (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  hora_entrada  TIME NOT NULL,
  hora_salida   TIME NOT NULL,
  dias          VARCHAR(80) NOT NULL,  -- ej. 'Lun - Vie'
  area_id       INT REFERENCES areas(id),
  creado_en     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- Usuarios y autenticación
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),                    -- BCrypt/Argon2 en backend
  nombre        VARCHAR(120),
  rol           VARCHAR(30) NOT NULL DEFAULT 'administrador',  -- candidato | reclutador | administrador
  activo        BOOLEAN DEFAULT true,
  creado_en     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- -----------------------------------------------------------------------------
-- Colaboradores (empleados)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS colaboradores (
  id            SERIAL PRIMARY KEY,
  usuario_id    INT UNIQUE REFERENCES usuarios(id),
  area_id       INT NOT NULL REFERENCES areas(id),
  turno_id      INT REFERENCES turnos(id),
  nombre        VARCHAR(180) NOT NULL,
  puesto        VARCHAR(120) NOT NULL,
  email         VARCHAR(255),
  extension     VARCHAR(20),
  modalidad     VARCHAR(40),   -- 'T. Completo' | 'M. Tiempo'
  avatar_url    TEXT,
  activo        BOOLEAN DEFAULT true,
  creado_en     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_colaboradores_area ON colaboradores(area_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_nombre ON colaboradores(nombre);

-- -----------------------------------------------------------------------------
-- Vacantes
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vacantes (
  id           SERIAL PRIMARY KEY,
  area_id      INT NOT NULL REFERENCES areas(id),
  titulo       VARCHAR(180) NOT NULL,
  descripcion  TEXT,
  requisitos   TEXT,
  ubicacion    VARCHAR(200),
  beneficios   TEXT,
  estatus      VARCHAR(30) NOT NULL DEFAULT 'Abierta',  -- Abierta | Cerrada | Pausada
  fecha_publicacion DATE DEFAULT CURRENT_DATE,
  fecha_inicio DATE,
  fecha_fin    DATE,
  creado_en    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vacantes_estatus ON vacantes(estatus);
CREATE INDEX IF NOT EXISTS idx_vacantes_area ON vacantes(area_id);

-- -----------------------------------------------------------------------------
-- Candidatos y postulaciones
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS candidatos (
  id               SERIAL PRIMARY KEY,
  usuario_id       INT UNIQUE REFERENCES usuarios(id),
  nombre           VARCHAR(180) NOT NULL,
  apellido         VARCHAR(120),
  email            VARCHAR(255) NOT NULL,
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
  cv_text          TEXT,         -- texto crudo extraído del PDF
  cv_url           TEXT,         -- ruta o URL del CV subido
  creado_en        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidato_skills (
  id          SERIAL PRIMARY KEY,
  candidato_id INT NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  skill       VARCHAR(80) NOT NULL,
  UNIQUE(candidato_id, skill)
);

CREATE INDEX IF NOT EXISTS idx_candidatos_email ON candidatos(email);

CREATE TABLE IF NOT EXISTS postulaciones (
  id            SERIAL PRIMARY KEY,
  candidato_id  INT NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  vacante_id    INT NOT NULL REFERENCES vacantes(id) ON DELETE CASCADE,
  etapa_id      INT NOT NULL REFERENCES etapas_pipeline(id),
  codigo_seguimiento VARCHAR(40) UNIQUE,  -- para que el candidato consulte "mi estado"
  notas         TEXT,
  creado_en     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(candidato_id, vacante_id)
);

CREATE INDEX IF NOT EXISTS idx_postulaciones_vacante ON postulaciones(vacante_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_etapa ON postulaciones(etapa_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_codigo ON postulaciones(codigo_seguimiento);

-- -----------------------------------------------------------------------------
-- Asistencia
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asistencias (
  id             SERIAL PRIMARY KEY,
  colaborador_id INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  fecha          DATE NOT NULL,
  estatus        VARCHAR(30) NOT NULL,  -- Presente | Ausente | Retardo | De permiso
  hora_entrada   TIME,
  hora_salida    TIME,
  overtime_horas DECIMAL(4,2) DEFAULT 0,
  creado_en      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(colaborador_id, fecha)
);

CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX IF NOT EXISTS idx_asistencias_colaborador ON asistencias(colaborador_id);

-- -----------------------------------------------------------------------------
-- Permisos y solicitudes
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tipos_permiso (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS solicitudes_permiso (
  id              SERIAL PRIMARY KEY,
  colaborador_id INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_id         INT NOT NULL REFERENCES tipos_permiso(id),
  dias            DECIMAL(4,2) NOT NULL,
  fecha_inicio    DATE NOT NULL,
  fecha_fin       DATE NOT NULL,
  estatus        VARCHAR(30) NOT NULL DEFAULT 'Pendiente',  -- Pendiente | Aprobado | Rechazado
  creado_en      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  revisado_en     TIMESTAMPTZ,
  revisado_por_id INT REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_colaborador ON solicitudes_permiso(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estatus ON solicitudes_permiso(estatus);

-- -----------------------------------------------------------------------------
-- Ausentismo (registro de ausencias)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tipos_ausentismo (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE  -- Ausente | Vacaciones | Incapacidad | Permiso
);

CREATE TABLE IF NOT EXISTS ausentismo (
  id              SERIAL PRIMARY KEY,
  colaborador_id  INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo_id         INT NOT NULL REFERENCES tipos_ausentismo(id),
  motivo          TEXT,
  fecha_desde     DATE NOT NULL,
  fecha_hasta     DATE NOT NULL,
  dias            DECIMAL(4,2) NOT NULL,
  creado_en       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ausentismo_colaborador ON ausentismo(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_ausentismo_fechas ON ausentismo(fecha_desde, fecha_hasta);

-- -----------------------------------------------------------------------------
-- Perfiles de puesto (para análisis de CVs)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS perfiles_puesto (
  id           SERIAL PRIMARY KEY,
  titulo       VARCHAR(180) NOT NULL,
  tipo         VARCHAR(60) DEFAULT 'Job Profile',
  descripcion  TEXT,
  experiencia  VARCHAR(80),
  activo       BOOLEAN DEFAULT true,
  creado_en    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS perfil_skills_requeridas (
  id         SERIAL PRIMARY KEY,
  perfil_id  INT NOT NULL REFERENCES perfiles_puesto(id) ON DELETE CASCADE,
  skill      VARCHAR(80) NOT NULL,
  UNIQUE(perfil_id, skill)
);

CREATE TABLE IF NOT EXISTS perfil_skills_preferidas (
  id         SERIAL PRIMARY KEY,
  perfil_id  INT NOT NULL REFERENCES perfiles_puesto(id) ON DELETE CASCADE,
  skill      VARCHAR(80) NOT NULL,
  UNIQUE(perfil_id, skill)
);

-- -----------------------------------------------------------------------------
-- Capacitación
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cursos (
  id         SERIAL PRIMARY KEY,
  area_id    INT REFERENCES areas(id),
  nombre     VARCHAR(200) NOT NULL,
  duracion   VARCHAR(40),   -- ej. '4 hrs', '8 hrs'
  modalidad  VARCHAR(40),  -- Presencial | En línea | Híbrido
  estatus    VARCHAR(30) DEFAULT 'Activo',  -- Activo | Próximo | Finalizado
  creado_en  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inscripciones_curso (
  id             SERIAL PRIMARY KEY,
  colaborador_id INT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  curso_id       INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  inscrito_en   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(colaborador_id, curso_id)
);

CREATE INDEX IF NOT EXISTS idx_cursos_estatus ON cursos(estatus);

-- -----------------------------------------------------------------------------
-- Reportes (definiciones)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tipos_reporte (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(60) NOT NULL UNIQUE,
  nombre      VARCHAR(120) NOT NULL,
  descripcion TEXT,
  activo      BOOLEAN DEFAULT true
);

-- Opcional: historial de reportes generados
CREATE TABLE IF NOT EXISTS reportes_generados (
  id          SERIAL PRIMARY KEY,
  tipo_id     INT NOT NULL REFERENCES tipos_reporte(id),
  periodo     VARCHAR(40) NOT NULL,  -- ej. 'Febrero 2025'
  archivo_ruta TEXT,
  generado_por_id INT REFERENCES usuarios(id),
  generado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- Comentarios para documentación
-- -----------------------------------------------------------------------------

COMMENT ON TABLE usuarios IS 'Usuarios del sistema: candidatos, reclutadores y administradores';
COMMENT ON TABLE colaboradores IS 'Empleados/colaboradores de la empresa (directorio, asistencia, permisos)';
COMMENT ON TABLE postulaciones IS 'Postulación de un candidato a una vacante con etapa del pipeline';
COMMENT ON TABLE asistencias IS 'Registro diario de asistencia por colaborador';
