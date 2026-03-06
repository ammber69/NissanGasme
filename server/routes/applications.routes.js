const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const fs = require('fs');

// Configuración de almacenamiento en disco para CVs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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
router.post('/', upload.fields([{ name: 'cv', maxCount: 1 }]), async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        console.log("Recibiendo postulación:", req.body);
        if (req.file) console.log("Archivo recibido:", req.file.path);

        const {
            jobId, nombre, email, telefono, ubicacion,
            experiencia, educacion, puestoActual, mensaje, cv_text
        } = req.body;

        const cvFileObj = req.files && req.files['cv'] ? req.files['cv'][0] : null;

        const cvUrl = cvFileObj ? `/uploads/${cvFileObj.filename}` : null;
        let cvBlob = null;
        let cvMimetype = null;
        let cvTextSafe = cv_text || null;

        if (cvFileObj) {
            try {
                cvBlob = fs.readFileSync(cvFileObj.path);
                cvMimetype = cvFileObj.mimetype;
            } catch (fsErr) {
                console.error("Error leyendo archivo:", fsErr);
            }
        }

        // 1. Buscar o Crear Candidato
        let candidatoId;
        const checkCandidate = await client.query('SELECT id FROM candidatos WHERE email = $1', [email]);

        if (checkCandidate.rows.length > 0) {
            candidatoId = checkCandidate.rows[0].id;
            await client.query(`
                UPDATE candidatos SET 
                    nombre = $1, telefono = $2, ubicacion = $3, 
                    experiencia = $4, educacion = $5, puesto_actual = $6,
                    cv_url = COALESCE($7, cv_url), cv_text = COALESCE($8, cv_text),
                    cv_blob = COALESCE($9::bytea, cv_blob), cv_mimetype = COALESCE($10, cv_mimetype),
                    actualizado_en = CURRENT_TIMESTAMP
                WHERE id = $11
            `, [nombre, telefono, ubicacion, experiencia, educacion, puestoActual, cvUrl, cvTextSafe, cvBlob, cvMimetype, candidatoId]);
        } else {
            const insertResult = await client.query(`
                INSERT INTO candidatos (
                    nombre, email, telefono, ubicacion, experiencia, 
                    educacion, puesto_actual, cv_url, cv_text, cv_blob, cv_mimetype
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::bytea, $11)
                RETURNING id
            `, [nombre, email, telefono, ubicacion, experiencia, educacion, puestoActual, cvUrl, cvTextSafe, cvBlob, cvMimetype]);
            candidatoId = insertResult.rows[0].id;
        }

        // 2. Verificar si ya existe postulación para esta vacante
        const checkPostulacion = await client.query(
            'SELECT id FROM postulaciones WHERE candidato_id = $1 AND vacante_id = $2',
            [candidatoId, jobId]
        );

        if (checkPostulacion.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Ya te has postulado a esta vacante anteriormente.' });
        }

        // Obtener el Título de la Vacante para el Correo Electrónico
        const jobQuery = await client.query('SELECT titulo FROM vacantes WHERE id = $1', [jobId]);
        const jobTitle = jobQuery.rows.length > 0 ? jobQuery.rows[0].titulo : 'nuestra bolsa de trabajo';

        // 3. Crear Postulación con etapa válida
        const etapaRes = await client.query("SELECT id FROM etapas_pipeline WHERE codigo = 'NEW' OR nombre ILIKE '%nuevo%' OR nombre ILIKE '%postulado%' ORDER BY orden ASC LIMIT 1");
        const etapaId = etapaRes.rows.length > 0 ? etapaRes.rows[0].id : 1;

        const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        await client.query(`
            INSERT INTO postulaciones (
                candidato_id, vacante_id, etapa_id, codigo_seguimiento, notas
            ) VALUES ($1, $2, $3, $4, $5)
        `, [candidatoId, jobId, etapaId, trackingCode, mensaje]);

        await client.query('COMMIT');

        // 4. Enviar Correo de Confirmación vía Nodemailer (Sin bloquear la respuesta al usuario)
        const emailService = require('../utils/emailService');
        emailService.sendApplicationConfirmation(email, nombre, trackingCode, jobTitle)
            .catch(e => console.error("Fallo enviando correo SMTP:", e));

        res.status(201).json({ message: 'Postulación recibida exitosamente', trackingCode });

    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('Error creating application:', error);
        res.status(500).json({ error: 'Error interno al procesar la postulación' });
    } finally {
        if (client) client.release();
    }
});

module.exports = router;