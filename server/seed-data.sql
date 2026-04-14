-- 1. Insertar Areas
INSERT INTO areas (nombre, descripcion) VALUES 
('Tecnología', 'Departamento de desarrollo y sistemas'),
('Recursos Humanos', 'Gestión de talento y personal'),
('Contabilidad', 'Finanzas y contabilidad'),
('Taller', 'Mantenimiento y reparación vehicular')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Insertar Vacantes
-- Usamos subconsultas para obtener los IDs de las áreas
INSERT INTO vacantes (area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_publicacion) 
SELECT id, 'Desarrollador Full Stack', 'Buscamos un desarrollador con experiencia en React y Node.js para unirse a nuestro equipo de tecnología.', 'Experiencia comprobable de 3 años\nConocimiento en SQL\nInglés intermedio', 'Nissan Gasme Orizaba', 'Seguro de gastos médicos mayores\nVales de despensa', 'Abierta', CURRENT_DATE
FROM areas WHERE nombre = 'Tecnología';

INSERT INTO vacantes (area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_publicacion)
SELECT id, 'Mecánico Automotriz', 'Técnico mecánico para mantenimiento preventivo y correctivo de unidades Nissan.', 'Experiencia en motores a gasolina\nLicencia de conducir vigente', 'Nissan Gasme Córdoba', 'Uniforme gratuito\nComedor subsidiado', 'Abierta', CURRENT_DATE
FROM areas WHERE nombre = 'Taller';

INSERT INTO vacantes (area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_publicacion)
SELECT id, 'Auxiliar Contable', 'Apoyo en registros contables, conciliaciones bancarias y facturación.', 'Licenciatura en Contabilidad (trunca o terminada)\nManejo de Excel intermedio', 'Nissan Gasme Tierra Blanca', 'Prestaciones de ley', 'Abierta', CURRENT_DATE
FROM areas WHERE nombre = 'Contabilidad';
