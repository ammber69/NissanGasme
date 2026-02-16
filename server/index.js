require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const vacantesRoutes = require('./routes/vacantes.routes');
const cvRoutes = require('./routes/cv.routes');
const applicationsRoutes = require('./routes/applications.routes');

// Usar rutas
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/uploads', express.static('server/uploads'));

// Test DB Connection Route
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ status: 'OK', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'ERROR', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
