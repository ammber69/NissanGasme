require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function seedDB() {
    try {
        console.log('Conectando a la base de datos...');
        const client = await pool.connect();

        console.log('Insertando datos de prueba...');

        // 1. Insertar Areas
        const areasResult = await client.query(`
            INSERT INTO areas (nombre, descripcion) VALUES 
            ('Tecnología', 'Departamento de desarrollo y sistemas'),
            ('Recursos Humanos', 'Gestión de talento y personal'),
            ('Contabilidad', 'Finanzas y contabilidad'),
            ('Taller', 'Mantenimiento y reparación vehicular')
            ON CONFLICT (nombre) DO NOTHING RETURNING id, nombre;
        `);
        console.log('Areas insertadas/existentes.');

        // Obtener IDs de areas (ya sea recien insertadas o consultando)
        const areasQuery = await client.query('SELECT id, nombre FROM areas');
        const areasMap = {};
        areasQuery.rows.forEach(row => areasMap[row.nombre] = row.id);

        // 2. Insertar Vacantes
        await client.query(`
            INSERT INTO vacantes (area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_publicacion) VALUES 
            ($1, 'Desarrollador Full Stack', 'Buscamos un desarrollador con experiencia en React y Node.js para unirse a nuestro equipo de tecnología.', 'Experiencia comprobable de 3 años\nConocimiento en SQL\nInglés intermedio', 'Nissan Gasme Orizaba', 'Seguro de gastos médicos mayores\nVales de despensa', 'Abierta', CURRENT_DATE),
            ($2, 'Mecánico Automotriz', 'Técnico mecánico para mantenimiento preventivo y correctivo de unidades Nissan.', 'Experiencia en motores a gasolina\nLicencia de conducir vigente', 'Nissan Gasme Córdoba', 'Uniforme gratuito\nComedor subsidiado', 'Abierta', CURRENT_DATE),
            ($3, 'Auxiliar Contable', 'Apoyo en registros contables, conciliaciones bancarias y facturación.', 'Licenciatura en Contabilidad (trunca o terminada)\nManejo de Excel intermedio', 'Nissan Gasme Tierra Blanca', 'Prestaciones de ley', 'Abierta', CURRENT_DATE)
        `, [areasMap['Tecnología'], areasMap['Taller'], areasMap['Contabilidad']]);

        console.log('Vacantes de prueba insertadas correctamente.');
        client.release();
    } catch (err) {
        console.error('Error al poblar la base de datos:', err);
    } finally {
        await pool.end();
    }
}

seedDB();
