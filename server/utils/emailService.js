const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transporter usando las variables de entorno
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ionos.mx',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true para port 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Envia un correo de confirmación de postulación
 * @param {string} toEmail Correo del candidato
 * @param {string} candidateName Nombre del candidato
 * @param {string} trackingCode Código generado
 * @param {string} jobTitle Título de la vacante a la que aplicó
 */
const sendApplicationConfirmation = async (toEmail, candidateName, trackingCode, jobTitle) => {
    try {
        const mailOptions = {
            from: `"Bolsa de Trabajo GASME" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Confirmación de Postulación - Nissan Gasme',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <!-- Header (Blanco con Logo simulado) -->
                <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 2px solid #c3002f;">
                    <h1 style="color: #c3002f; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
                        GASME AUTOMOTRIZ
                    </h1>
                </div>

                <!-- Banner / Imagen principal (Opcional, usando un gradiente rojo nissan) -->
                <div style="background: linear-gradient(135deg, #c3002f 0%, #8a0021 100%); height: 80px; width: 100%;"></div>

                <!-- Contenido Principal -->
                <div style="padding: 40px 30px; background-color: #ffffff;">
                    <h2 style="color: #111827; margin-top: 0; font-size: 24px;">Confirmación de Postulación</h2>
                    
                    <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                        Hola <strong>${candidateName}</strong>,
                    </p>
                    
                    <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                        Hemos recibido exitosamente tu postulación para la vacante de <strong>${jobTitle || 'nuestra bolsa de trabajo'}</strong>. 
                        Para finalizar tu registro y poder dar seguimiento a tu proceso de selección de manera transparente, hemos generado un código único para ti.
                    </p>

                    <!-- Botón / Código simulado -->
                    <div style="margin: 30px 0; text-align: left;">
                        <span style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 24px; font-size: 18px; font-weight: bold; letter-spacing: 1px;">
                            ${trackingCode}
                        </span>
                        <p style="margin-top: 10px; font-size: 13px; color: #6b7280;">Guarda este código de seguimiento.</p>
                    </div>

                    <!-- Sección de beneficios / información extra (Icono verde de check) -->
                    <div style="margin-top: 40px;">
                        <h3 style="color: #111827; font-size: 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #10b981; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 14px;">✓</span>
                            Siguientes Pasos
                        </h3>
                        <ul style="color: #4b5563; line-height: 1.6; font-size: 15px; padding-left: 20px; margin-top: 0;">
                            <li style="margin-bottom: 10px;"><strong>Revisión de Perfil:</strong> Nuestro equipo de Atracción de Talento analizará tu CV y experiencia en los próximos días.</li>
                            <li><strong>Consulta Avanzada:</strong> Usa tu código en nuestro portal para saber exactamente en qué fase te encuentras (Entrevista, Pre-selección, etc).</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Footer oscuro -->
                <div style="background-color: #374151; padding: 30px; color: #d1d5db;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #4b5563; padding-bottom: 20px; margin-bottom: 20px;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">GASME</h2>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                        <span style="color: #10b981;">Bolsa de Trabajo Gasme</span>
                        <div style="text-align: right;">
                            <a href="#" style="color: #d1d5db; text-decoration: none; margin-left: 10px;">Aviso de Privacidad</a>
                            &bull;
                            <a href="#" style="color: #d1d5db; text-decoration: none; margin-left: 10px;">Contacto</a>
                        </div>
                    </div>
                    <p style="text-align: center; font-size: 11px; color: #6b7280; margin-top: 20px;">
                        Por favor, no respondas a este correo ya que es generado automáticamente.
                    </p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email enviado con éxito a ${toEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error enviando el correo electrónico:', error);
        return false;
    }
};

module.exports = {
    sendApplicationConfirmation
};
