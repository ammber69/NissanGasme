const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function migrate() {
    try {
        console.log('Iniciando migración de esquema...');
        const client = await pool.connect();

        // Verificar si la columna ya existe
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='candidatos' AND column_name='cv_text';
        `);

        if (res.rows.length === 0) {
            console.log("Agregando columna 'cv_text' a tabla 'candidatos'...");
            await client.query(`
                ALTER TABLE candidatos
                ADD COLUMN cv_text TEXT;
            `);
            console.log("Columna agregada exitosamente.");
        } else {
            console.log("La columna 'cv_text' ya existe.");
        }

        client.release();
    } catch (err) {
        console.error('Error durante la migración:', err);
    } finally {
        await pool.end();
    }
}

migrate();
