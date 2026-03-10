const db = require('./server/db');

async function updateStages() {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        // Verify if REC already exists
        const resCheck = await client.query("SELECT id FROM etapas_pipeline WHERE codigo = 'REC'");
        if (resCheck.rows.length === 0) {
            // Shift orders for > 1
            await client.query("UPDATE etapas_pipeline SET orden = orden + 1 WHERE orden >= 2 AND codigo != 'NEW'");

            // Insert REC at 2
            await client.query("INSERT INTO etapas_pipeline (codigo, nombre, orden) VALUES ('REC', 'Recibido', 2)");
            console.log("Stage REC (Recibido) inserted at order 2.");
        } else {
            console.log("Stage REC already exists. Updating names if needed.");
        }

        // Update exact names for the UI to be consistent (Optional since FE overrides it, but good for DB logic)
        await client.query("UPDATE etapas_pipeline SET nombre = 'Postulado' WHERE codigo = 'NEW'");
        await client.query("UPDATE etapas_pipeline SET nombre = 'Recibido' WHERE codigo = 'REC'");
        await client.query("UPDATE etapas_pipeline SET nombre = 'En Revisión' WHERE codigo = 'REV'");
        await client.query("UPDATE etapas_pipeline SET nombre = 'Entrevista' WHERE codigo = 'ENT'");
        await client.query("UPDATE etapas_pipeline SET nombre = 'Oferta' WHERE codigo = 'OFE'");
        await client.query("UPDATE etapas_pipeline SET nombre = 'Aceptado' WHERE codigo = 'CON'");
        await client.query("UPDATE etapas_pipeline SET nombre = 'Descartado' WHERE codigo = 'REJ'");

        await client.query('COMMIT');
        console.log("Pipeline stages updated successfully.");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating stages:", error);
    } finally {
        client.release();
        process.exit(0);
    }
}

updateStages();
