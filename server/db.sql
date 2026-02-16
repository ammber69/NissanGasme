-- Habilitar extensión para UUIDs (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: jobs (Vacantes)
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(100) DEFAULT 'Nissan Gasme',
    location VARCHAR(100) NOT NULL,
    work_type VARCHAR(50), -- Ej: Presencial, Remoto
    contract_type VARCHAR(50), -- Ej: Tiempo Completo
    experience_level VARCHAR(50), -- Ej: 3+ años
    salary_range VARCHAR(50), -- Ej: $15,000 - $18,000
    description TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla: applications (Postulaciones)
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id),
    tracking_code VARCHAR(50) UNIQUE NOT NULL, -- Código para consulta pública
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    cv_url VARCHAR(255), -- URL del CV alojado
    current_status VARCHAR(50) DEFAULT 'recibida', -- recibida, revision, entrevista, rechazada, oferta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: application_timeline (Historial)
CREATE TABLE application_timeline (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id),
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_apps_tracking ON applications(tracking_code);

-- Datos de prueba (Seed)
INSERT INTO jobs (title, location, work_type, contract_type, experience_level, salary_range, description) VALUES
('Contador', 'Nissan Gasme Orizaba', 'Presencial', 'Tiempo Completo', '3+ años', '15,000 - 18,000/mes', 'Buscamos un Contador con experiencia para llevar la contabilidad general...'),
('Mecánico', 'Nissan Gasme Córdoba', 'Presencial', 'Tiempo Completo', '2+ años', '12,000 - 15,000/mes', 'Se solicita Mecánico Automotriz para mantenimiento preventivo...'),
('ING Sistemas', 'Nissan Gasme Tierra Blanca', 'Presencial', 'Tiempo Completo', '1+ años', '18,000 - 22,000/mes', 'Encargado de soporte técnico, redes y mantenimiento...');
