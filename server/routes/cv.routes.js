const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');

// Configuración de multer para almacenamiento en memoria (buffer)
// Esto evita guardar archivos en disco si solo queremos extraer texto
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'), false);
        }
    }
});

router.post('/extract', upload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        // Extraer texto del PDF usando el buffer en memoria
        const data = await pdf(req.file.buffer);
        const text = data.text;

        console.log("--- TEXTO EXTRAÍDO DEL PDF (INICIO) ---");
        console.log(text.substring(0, 500)); // Mostrar los primeros 500 caracteres
        console.log("--- TEXTO EXTRAÍDO DEL PDF (FIN) ---");

        // Limpieza básica del texto: Mantener saltos de línea para detectar estructura
        const cleanText = text.replace(/\r\n/g, '\n');

        // 1. Email
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const emails = cleanText.match(emailRegex);

        // 2. Teléfono
        // Regex permisivo para encontrarlo, pero luego lo limpiamos
        const phoneRegex = /(?:\(?\+?\d{1,3}\)?[\s.-]*)?\(?\d{2,4}\)?[\s.-]*\d{3,4}[\s.-]*\d{3,4}/g;
        const phoneMatch = cleanText.match(phoneRegex);
        // Limpiar: dejar solo dígitos
        const phone = phoneMatch ? phoneMatch[0].replace(/\D/g, '') : '';

        // 3. Extracción de Secciones
        const extractSection = (keywords) => {
            // Generar patrón flexible para soportar letras espaciadas (ej: E X P E R I E N C I A)
            // Soportamos espacios \s* que incluyen \n
            const createFlexiblePattern = (word) => {
                return word.split('').join('\\s*');
            };

            const flexibleKeywords = keywords.map(k => createFlexiblePattern(k)).join('|');
            // IMPORTANTE: (?:\n|^) asegura que coincida solo al inicio de una línea
            // Esto evita coincidir "con formación sólida" en medio de un párrafo.
            const regex = new RegExp(`(?:\\n|^)\\s*(${flexibleKeywords})`, 'i');

            const match = cleanText.match(regex);

            if (!match) return '';

            const startIndex = match.index + match[0].length;
            const textAfter = cleanText.substring(startIndex);

            // Buscar siguiente encabezado (también al inicio de línea)
            const nextHeaders = ['EDUCACIÓN', 'FORMACIÓN', 'ESTUDIOS', 'HABILIDADES', 'IDIOMAS', 'REFERENCIAS', 'PROYECTOS', 'INFORMACIÓN', 'CONTACTO', 'PERFIL', 'EXPERIENCIA'];
            const flexibleNext = nextHeaders.map(k => createFlexiblePattern(k)).join('|');
            const nextHeaderRegex = new RegExp(`(?:\\n|^)\\s*(${flexibleNext})`, 'i');

            const nextMatch = textAfter.search(nextHeaderRegex);

            let content = nextMatch !== -1 ? textAfter.substring(0, nextMatch) : textAfter;
            // Limpieza agresiva de caracteres extra al inicio (como " D E TRABAJO" sobrante)
            return content
                .replace(/^[\s.:\-_a-zA-Z]{0,20}\n/, '') // Intentar quitar subtítulos pegados
                .replace(/[:\-_]{2,}/g, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
        };

        const experiencia = extractSection(['EXPERIENCIA', 'TRAYECTORIA', 'HISTORIAL']);
        const educacion = extractSection(['EDUCACIÓN', 'FORMACIÓN', 'ESTUDIOS', 'ACADÉMICA']);

        // 4. Nombre
        // El usuario solicitó no extraer el nombre automáticamente. Se deja vacío para llenado manual.
        let possibleName = '';

        console.log("--- DATOS EXTRAÍDOS ---");
        console.log("Email:", emails ? emails[0] : 'No');
        console.log("Phone Raw:", phoneMatch ? phoneMatch[0] : 'No');
        console.log("Phone Clean:", phone);
        console.log("Nombre:", possibleName);

        const extractedData = {
            text: cleanText,
            email: emails ? emails[0] : '',
            phone: phone,
            nombre: possibleName,
            experiencia: experiencia.substring(0, 1500),
            educacion: educacion.substring(0, 800)
        };

        res.json({
            success: true,
            data: extractedData
        });

    } catch (error) {
        console.error('Error al procesar el CV:', error);
        res.status(500).json({ error: 'Error al procesar el archivo PDF' });
    }
});

module.exports = router;
