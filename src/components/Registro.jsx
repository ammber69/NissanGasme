import React, { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';

const Registro = ({ job, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [manualEntry, setManualEntry] = useState(false); // Nuevo estado para alternar modo

  // Estados para campos manuales
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
    experiencia: '',
    educacion: '',
    puestoActual: '',
    mensaje: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando postulación:", {
      jobId: job.id,
      ...formData,
      cv: manualEntry ? 'Manual Entry' : cvFile?.name,
      mode: manualEntry ? 'manual' : 'file'
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset states
      setSubmitted(false);
      setCvFile(null);
      setManualEntry(false);
      setFormData({
        nombre: '', email: '', telefono: '', ubicacion: '',
        experiencia: '', educacion: '', puestoActual: '', mensaje: ''
      });
    }, 3000);
  };

  if (!job) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        {submitted ? (
          <div style={styles.successMessage}>
            <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={styles.successTitle}>¡Solicitud Enviada!</h3>
            <p style={{ textAlign: 'center', color: '#4b5563' }}>
              Gracias por aplicar a la vacante de <br /><strong>{job.title}</strong>.
            </p>
            <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
              El equipo de RRHH revisará tu perfil y te contactará pronto.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>Aplicar para {job.title}</h2>
              <p style={styles.subtitle}>{job.company} - {job.location}</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Información de Contacto Básica (Siempre visible) */}
              <div style={styles.sectionTitle}>Información de Contacto</div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              {/* Selector de Modo: CV vs Manual */}
              <div style={styles.modeSelector}>
                <button
                  type="button"
                  style={!manualEntry ? styles.modeButtonActive : styles.modeButton}
                  onClick={() => setManualEntry(false)}
                >
                  <Upload size={18} /> Subir CV
                </button>
                <button
                  type="button"
                  style={manualEntry ? styles.modeButtonActive : styles.modeButton}
                  onClick={() => setManualEntry(true)}
                >
                  <CheckCircle size={18} /> Llenar Manualmente
                </button>
              </div>

              {manualEntry ? (
                /* Formulario Manual Completo */
                <div style={styles.manualFormContainer}>
                  <div style={styles.row}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Ubicación / Ciudad</label>
                      <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                        placeholder="Ej. Córdoba, Ver."
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Puesto Actual / Último</label>
                      <input
                        type="text"
                        name="puestoActual"
                        value={formData.puestoActual}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Ej. Vendedor"
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Último Grado de Estudios</label>
                    <input
                      type="text"
                      name="educacion"
                      value={formData.educacion}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      placeholder="Ej. Licenciatura, Bachillerato..."
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Experiencia Laboral Reciente</label>
                    <textarea
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      rows="3"
                      placeholder="Describe brevemente tus últimos empleos y responsabilidades..."
                      required
                    ></textarea>
                  </div>
                </div>
              ) : (
                /* Subida de Archivo */
                <div style={styles.formGroup}>
                  <label style={styles.label}>Currículum Vitae (PDF)</label>
                  <div style={{ ...styles.uploadBox, ...(cvFile && styles.uploadBoxSuccess) }}>
                    {cvFile ? (
                      <>
                        <CheckCircle size={24} color="#10b981" />
                        <span style={{ ...styles.uploadText, color: '#0f766e' }}>{cvFile.name}</span>
                        <button
                          type="button"
                          style={styles.changeFileButton}
                          onClick={(e) => {
                            e.preventDefault();
                            setCvFile(null);
                          }}
                        >
                          Cambiar archivo
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload size={24} color="#6b7280" />
                        <span style={styles.uploadText}>Haz clic o arrastra tu archivo aquí</span>
                        <span style={styles.uploadSubtext}>Formato PDF, Word (Max 5MB)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={styles.fileInput}
                      onChange={handleFileChange}
                      required={!manualEntry}
                    />
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Mensaje Adicional (Opcional)</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  rows="2"
                  placeholder="¿Algo más que debamos saber?"
                ></textarea>
              </div>

              <button type="submit" style={styles.submitButton}>
                {manualEntry ? 'Enviar Solicitud Manual' : 'Enviar Postulación con CV'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '600px', // Un poco más ancho para el formulario manual
    padding: '2rem',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  header: {
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem',
    marginTop: '0.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Responsive grid
    gap: '1rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    width: '100%',
  },
  modeSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem',
    borderRadius: '0.5rem',
  },
  modeButton: {
    flex: 1,
    padding: '0.6rem',
    border: 'none',
    borderRadius: '0.375rem',
    backgroundColor: 'transparent',
    color: '#4b5563',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  },
  modeButtonActive: {
    flex: 1,
    padding: '0.6rem',
    border: 'none',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    color: '#c3002f', // Brand color
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  manualFormContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  uploadBox: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s',
  },
  uploadBoxSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  uploadText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  changeFileButton: {
    marginTop: '0.5rem',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '0.8rem',
    textDecoration: 'underline',
    cursor: 'pointer',
    zIndex: 10, // Ensure clickable over file input
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#c3002f',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 6px -1px rgba(195, 0, 47, 0.3)',
  },
  successMessage: {
    textAlign: 'center',
    padding: '3rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
  },
};

export default Registro;
