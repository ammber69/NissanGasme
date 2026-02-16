const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const fs = require('fs');

// Configuración de almacenamiento en disco para CVs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/applications - Crear nueva postulación
router.post('/', upload.single('cv'), async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        console.log("Recibiendo postulación:", req.body);
        if (req.file) console.log("Archivo recibido:", req.file.path);

        const {
            jobId, nombre, email, telefono, ubicacion,
            experiencia, educacion, puestoActual, mensaje, cv_text
        } = req.body;

        const cvUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // 1. Crear o Actualizar Candidato
        // Usamos ON CONFLICT para actualizar si ya existe el email
        let candidatoQuery = `
            INSERT INTO candidatos (
                nombre, email, telefono, ubicacion, experiencia, 
                educacion, puesto_actual, cv_url, cv_text
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (email) DO UPDATE SET
                nombre = EXCLUDED.nombre,
                telefono = EXCLUDED.telefono,
                ubicacion = EXCLUDED.ubicacion,
                experiencia = EXCLUDED.experiencia,
                educacion = EXCLUDED.educacion,
                puesto_actual = EXCLUDED.puesto_actual,
                cv_url = COALESCE(EXCLUDED.cv_url, candidates.cv_url),
                cv_text = COALESCE(EXCLUDED.cv_text, candidates.cv_text),
                updated_at = CURRENT_TIMESTAMP
            RETURNING id;
        `;

        // Ajuste Query: La tabla tiene 'usuario_id' unique. Si no manejamos usuarios aún, lo dejamos null.
        // Pero email tiene UNIQUE constraint? Schema sagt: email VARCHAR(255) NOT NULL, pero no UNIQUE explícito en candidatos, 
        // solo index. Wait, schema:
        // CREATE TABLE IF NOT EXISTS candidatos (... email VARCHAR(255) NOT NULL, ...);
        // CREATE INDEX IF NOT EXISTS idx_candidatos_email ON candidatos(email);
        // NO HAY UNIQUE CONSTRAINT en email en la definición CREATE TABLE (solo en usuarios).
        // Pero lógica de negocio debería tratar email como único.
        // Asumiremos que el frontend envía datos válidos y trataremos de buscar por email primero.

        let candidatoId;
        const checkCandidate = await client.query('SELECT id FROM candidatos WHERE email = $1', [email]);

        if (checkCandidate.rows.length > 0) {
            candidatoId = checkCandidate.rows[0].id;
            // Update
            await client.query(`
                UPDATE candidatos SET 
                    nombre = $1, telefono = $2, ubicacion = $3, 
                    experiencia = $4, educacion = $5, puesto_actual = $6,
                    cv_url = COALESCE($7, cv_url), cv_text = COALESCE($8, cv_text),
                    actualizado_en = CURRENT_TIMESTAMP
                WHERE id = $9
            `, [nombre, telefono, ubicacion, experiencia, educacion, puestoActual, cvUrl, cv_text, candidatoId]);
        } else {
            // Insert
            const insertResult = await client.query(`
                INSERT INTO candidatos (
                    nombre, email, telefono, ubicacion, experiencia, 
                    educacion, puesto_actual, cv_url, cv_text
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `, [nombre, email, telefono, ubicacion, experiencia, educacion, puestoActual, cvUrl, cv_text]);
            candidatoId = insertResult.rows[0].id;
        }

        // 2. Crear Postulación
        // Verificar si ya existe postulación para esta vacante
        const checkPostulacion = await client.query(
            'SELECT id FROM postulaciones WHERE candidato_id = $1 AND vacante_id = $2',
            [candidatoId, jobId]
        );

        if (checkPostulacion.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Ya te has postulado a esta vacante anteriormente.' });
        }

        // Obtener etapa inicial (suponiendo ID 1 o buscar por orden)
        // Por simplicidad usaremos 1 si existe, o NULL si no hay etapas definidas aun.
        // Schema: etapa_id INT NOT NULL REFERENCES etapas_pipeline(id)
        // Necesitamos saber los IDs de etapas.
        // Vamos a insertar una etapa 'Nuevo' si no existe o buscarla.
        let etapaId = 1;
        const etapaRes = await client.query("SELECT id FROM etapas_pipeline WHERE nombre = 'Nuevo' LIMIT 1");
        if (etapaRes.rows.length > 0) {
            etapaId = etapaRes.rows[0].id;
        } else {
            // Fallback: insertar etapa 'Nuevo'
            const newEtapa = await client.query("INSERT INTO etapas_pipeline (codigo, nombre, orden) VALUES ('NEW', 'Nuevo', 1) ON CONFLICT DO NOTHING RETURNING id");
            if (newEtapa.rows.length > 0) etapaId = newEtapa.rows[0].id;
            else {
                // Si conflict y no retorna, buscar de nuevo (raro)
                const retryEtapa = await client.query("SELECT id FROM etapas_pipeline WHERE codigo = 'NEW'");
                etapaId = retryEtapa.rows[0].id;
            }
        }

        const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        await client.query(`
            INSERT INTO postulaciones (
                candidato_id, vacante_id, etapa_id, codigo_seguimiento, notas
            ) VALUES ($1, $2, $3, $4, $5)
        `, [candidatoId, jobId, etapaId, trackingCode, mensaje]);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Postulación recibida exitosamente',
            trackingCode
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating application:', error);
        res.status(500).json({ error: 'Error interno al procesar la postulación' });
    } finally {
        client.release();
    }
});

module.exports = router;
