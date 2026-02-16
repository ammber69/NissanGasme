require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function seedMoreJobs() {
    let client;
    try {
        console.log('Conectando a la base de datos...');
        client = await pool.connect();

        console.log('Añadiendo nuevas áreas y vacantes...');

        // 1. Asegurar áreas nuevas
        await client.query(`
            INSERT INTO areas (nombre, descripcion) VALUES 
            ('Ventas', 'Departamento comercial y ventas de unidades'),
            ('Refacciones', 'Almacén y venta de refacciones'),
            ('Administración', 'Gestión administrativa y atención al cliente')
            ON CONFLICT (nombre) DO NOTHING;
        `);

        // Obtener mapa de IDs
        const areasQuery = await client.query('SELECT id, nombre FROM areas');
        const areasMap = {};
        areasQuery.rows.forEach(row => areasMap[row.nombre] = row.id);

        // 2. Insertar 5 Vacantes Nuevas
        const newJobs = [
            {
                area: 'Ventas',
                titulo: 'Asesor de Ventas Autos Nuevos',
                descripcion: 'Responsable de la atención a clientes, demostración de unidades y cierre de ventas. Buscamos personas con actitud de servicio y gusto por las ventas.',
                requisitos: 'Experiencia en ventas (1 año mínimo)\nLicencia de conducir vigente\nFacilidad de palabra\nPreparatoria terminada',
                ubicacion: 'Nissan Gasme Córdoba',
                beneficios: 'Comisiones sin tope\nCapacitación constante\nPlan de carrera',
            },
            {
                area: 'Refacciones',
                titulo: 'Chófer de Reparto',
                descripcion: 'Entrega de refacciones a talleres y clientes en la zona. Apoyo en almacén cuando no haya ruta.',
                requisitos: 'Licencia de chofer vigente\nConocimiento de la ciudad\nExperiencia en manejo de camioneta 3.5 ton',
                ubicacion: 'Nissan Gasme Orizaba',
                beneficios: 'Sueldo base + bono de reparto\nPrestaciones de ley',
            },
            {
                area: 'Administración',
                titulo: 'Recepcionista',
                descripcion: 'Primera imagen de la agencia. Recepción de clientes, manejo de conmutador y apoyo administrativo básico.',
                requisitos: 'Excelente presentación\nManejo de Office básico\nAmable y proactiva',
                ubicacion: 'Nissan Gasme Tierra Blanca',
                beneficios: 'Horario fijo\nUniforme ejecutivo',
            },
            {
                area: 'Taller',
                titulo: 'Lavador de Autos',
                descripcion: 'Lavado y detallado de unidades nuevas y de servicio. Asegurar la limpieza impecable de los vehículos para entrega.',
                requisitos: 'Experiencia en detallado automotriz (deseable)\nResponsable y detallista\nDisponibilidad de horario',
                ubicacion: 'Nissan Gasme Córdoba',
                beneficios: 'Pago por destajo o sueldo base\nPropinas',
            },
            {
                area: 'Taller',
                titulo: 'Asesor de Servicio',
                descripcion: 'Recepción de unidades a taller, seguimiento a reparaciones y entrega al cliente. Venta de servicios adicionales.',
                requisitos: 'Conocimiento básico de mecánica\nExperiencia en atención al cliente\nManejo de PC',
                ubicacion: 'Nissan Gasme Orizaba',
                beneficios: 'Sueldo garantía + comisiones\nCapacitación Nissan University',
            }
        ];

        for (const job of newJobs) {
            await client.query(`
                INSERT INTO vacantes (area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_publicacion) 
                VALUES ($1, $2, $3, $4, $5, $6, 'Abierta', CURRENT_DATE)
            `, [areasMap[job.area], job.titulo, job.descripcion, job.requisitos, job.ubicacion, job.beneficios]);
        }

        console.log('¡5 nuevas vacantes insertadas con éxito!');

    } catch (err) {
        console.error('Error al insertar vacantes:', err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

seedMoreJobs();
