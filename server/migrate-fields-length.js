const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Iniciando migración de tipos de columnas...');

        await client.query('BEGIN');

        // Alterar columna experiencia
        console.log('Alterando columna experiencia a TEXT...');
        await client.query('ALTER TABLE candidatos ALTER COLUMN experiencia TYPE TEXT');

        // Alterar columna educacion
        console.log('Alterando columna educacion a TEXT...');
        await client.query('ALTER TABLE candidatos ALTER COLUMN educacion TYPE TEXT');

        await client.query('COMMIT');
        console.log('¡Migración completada exitosamente!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error durante la migración:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
