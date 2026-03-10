const db = require('./server/db');

async function cleanStages() {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        console.log("Limpiando DB e insertando etapas limpias:");
        // Para evitar problemas de foreign key con `postulaciones` que ya usan estos, 
        // primero reasignaremos temporalmente cualquier postulación a un solo ID o simplemente actualizamos los correctos y borramos los demás
        // En este caso, el usuario solo tiene un registro postulado que vimos (LUM-3EBD21) o algunos pocos de prueba.

        // 1. Asegurar que tenemos los requeridos
        const codigosRequeridos = ['NEW', 'REC', 'REV', 'ENT', 'PRE', 'CON', 'REJ'];

        // Borramos los viejos registros en minusculas (recibido, en-revision, etc)
        // pero antes movemos cualquier id asociado a 'NEW'
        await client.query(`UPDATE postulaciones SET etapa_id = (SELECT id FROM etapas_pipeline WHERE codigo = 'NEW' LIMIT 1) WHERE etapa_id IN (SELECT id FROM etapas_pipeline WHERE codigo IN ('recibido', 'en-revision', 'entrevista', 'pre-seleccionado', 'aceptado', 'descartado'))`);

        await client.query(`DELETE FROM etapas_pipeline WHERE codigo IN ('recibido', 'en-revision', 'entrevista', 'pre-seleccionado', 'aceptado', 'descartado')`);

        // Insertamos o actualizamos los oficiales
        await client.query(`
            INSERT INTO etapas_pipeline (codigo, nombre, orden) VALUES
            ('NEW', 'Postulado', 1),
            ('REC', 'Recibido', 2),
            ('REV', 'En Revisión', 3),
            ('ENT', 'Entrevista', 4),
            ('PRE', 'Pre-seleccionado', 5),
            ('CON', 'Seleccionado', 6),
            ('REJ', 'Descartado', 7)
            ON CONFLICT (codigo) DO UPDATE SET 
                nombre = EXCLUDED.nombre,
                orden = EXCLUDED.orden
        `);

        await client.query('COMMIT');
        console.log("Éxito limpiando BD");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
    } finally {
        client.release();
        process.exit(0);
    }
}
cleanStages();
