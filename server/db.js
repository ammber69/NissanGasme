const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Client } = require('pg');

const createClient = async () => {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || '127.0.0.1',
        database: process.env.DB_NAME || 'lumani',
        password: process.env.DB_PASSWORD || 'maximo2126',
        port: process.env.DB_PORT || 5432,
    });
    await client.connect();
    return client;
};

module.exports = {
    query: async (text, params) => {
        const client = await createClient();
        try {
            return await client.query(text, params);
        } finally {
            await client.end();
        }
    },
    getClient: async () => {
        const client = await createClient();
        // Polyfill para código que llama a client.release() asumiendo que es un Pool
        client.release = () => client.end();
        return client;
    },
};
