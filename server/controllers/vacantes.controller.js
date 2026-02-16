const db = require('../db');

// Obtener todas las vacantes (con filtros opcionales)
exports.getAllVacantes = async (req, res) => {
    try {
        const { estatus, area_id, search } = req.query;
        let query = `
            SELECT v.*, a.nombre as area_nombre 
            FROM vacantes v
            JOIN areas a ON v.area_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (estatus) {
            params.push(estatus);
            query += ` AND v.estatus = $${params.length}`;
        } else {
            // Por defecto mostrar solo abiertas si no se especifica
            // query += ` AND v.estatus = 'Abierta'`; 
        }

        if (area_id) {
            params.push(area_id);
            query += ` AND v.area_id = $${params.length}`;
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (v.titulo ILIKE $${params.length} OR v.descripcion ILIKE $${params.length})`;
        }

        query += ' ORDER BY v.fecha_publicacion DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error en getAllVacantes:', err);
        res.status(500).json({ error: 'Error al obtener vacantes' });
    }
};

// Obtener vacante por ID
exports.getVacanteById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT v.*, a.nombre as area_nombre 
            FROM vacantes v
            JOIN areas a ON v.area_id = a.id
            WHERE v.id = $1
        `;
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error en getVacanteById:', err);
        res.status(500).json({ error: 'Error al obtener la vacante' });
    }
};

// Crear nueva vacante
exports.createVacante = async (req, res) => {
    try {
        const { area_id, titulo, descripcion, requisitos, ubicacion, beneficios, fecha_inicio, fecha_fin } = req.body;

        const query = `
            INSERT INTO vacantes (area_id, titulo, descripcion, requisitos, ubicacion, beneficios, fecha_inicio, fecha_fin)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [area_id, titulo, descripcion, requisitos, ubicacion, beneficios, fecha_inicio, fecha_fin];

        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error en createVacante:', err);
        res.status(500).json({ error: 'Error al crear la vacante' });
    }
};

// Actualizar vacante
exports.updateVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const { area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_inicio, fecha_fin } = req.body;

        const query = `
            UPDATE vacantes 
            SET area_id = $1, titulo = $2, descripcion = $3, requisitos = $4, ubicacion = $5, beneficios = $6, estatus = $7, fecha_inicio = $8, fecha_fin = $9, actualizado_en = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *
        `;
        const values = [area_id, titulo, descripcion, requisitos, ubicacion, beneficios, estatus, fecha_inicio, fecha_fin, id];

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error en updateVacante:', err);
        res.status(500).json({ error: 'Error al actualizar la vacante' });
    }
};

// Eliminar vacante (o cambiar estatus a Cerrada/Eliminada)
exports.deleteVacante = async (req, res) => {
    try {
        const { id } = req.params;
        // Opción 1: Borrado físico
        // const query = 'DELETE FROM vacantes WHERE id = $1 RETURNING id';

        // Opción 2: Borrado lógico (recomendado)
        const query = "UPDATE vacantes SET estatus = 'Cerrada' WHERE id = $1 RETURNING id";

        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json({ message: 'Vacante cerrada correctamente', id });
    } catch (err) {
        console.error('Error en deleteVacante:', err);
        res.status(500).json({ error: 'Error al eliminar la vacante' });
    }
};
