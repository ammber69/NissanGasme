require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

// Logger de peticiones para depuración
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Configuración manual de CORS para máxima compatibilidad
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Responder inmediatamente a peticiones OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Importar rutas
const vacantesRoutes = require('./routes/vacantes.routes');
const cvRoutes = require('./routes/cv.routes');
const applicationsRoutes = require('./routes/applications.routes');
const sucursalesRoutes = require('./routes/sucursales.routes');

// Usar rutas
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/uploads', express.static('server/uploads'));

// Test DB Connection Route
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ status: 'OK', time: result.rows[0].now });
    } catch (err) {
        console.error('Error en Health Check:', err);
        res.status(500).json({ status: 'ERROR', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`>>> Servidor de Bolsa de Trabajo corriendo en puerto ${PORT}`);
    console.log(`>>> Probando conexión a BD...`);
});
