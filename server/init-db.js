const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const schemaPath = path.join(__dirname, 'schema.sql');

async function initDB() {
    try {
        console.log('Leyendo archivo de esquema...');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Conectando a la base de datos...');
        const client = await pool.connect();

        console.log('Ejecutando script SQL...');
        await client.query(schema);

        console.log('¡Base de datos inicializada correctamente!');
        client.release();
    } catch (err) {
        console.error('Error al inicializar la base de datos:', err);
    } finally {
        await pool.end();
    }
}

initDB();
