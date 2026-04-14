import React, { useState } from 'react';
import { X, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { submitApplication, extractCVData } from '../api/api';

const Registro = ({ job, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Estados para campos manuales
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
    experiencia: '',
    educacion: '',
    puestoActual: '',
    mensaje: '',
    cv_text: '' // Almacenar texto crudo del CV
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setCvFile(file);
      setError(null);

      // Iniciar análisis automático
      setIsAnalyzing(true);
      try {
        const result = await extractCVData(file);
        if (result.success && result.data) {
          const { email, phone, text, experiencia, educacion, nombre } = result.data;

          setFormData(prev => ({
            ...prev,
            nombre: nombre || prev.nombre,
            email: email || prev.email,
            telefono: phone || prev.telefono,
            experiencia: experiencia || prev.experiencia,
            educacion: educacion || prev.educacion,
            cv_text: text || ''
          }));

          // Cambiar a vista manual para que el usuario verifique/complete
          setManualEntry(true);
        }
      } catch (err) {
        console.error("Error analizando CV:", err);
        setError("No pudimos leer los datos automáticamente, por favor completa el formulario.");
        setManualEntry(true); // Mostrar formulario de todos modos
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append('jobId', job.id);
      dataToSend.append('nombre', formData.nombre);
      dataToSend.append('email', formData.email);
      dataToSend.append('telefono', formData.telefono);
      dataToSend.append('ubicacion', formData.ubicacion);
      dataToSend.append('experiencia', formData.experiencia);
      dataToSend.append('educacion', formData.educacion);
      dataToSend.append('puestoActual', formData.puestoActual);
      dataToSend.append('mensaje', formData.mensaje);
      dataToSend.append('cv_text', formData.cv_text);

      if (cvFile) {
        dataToSend.append('cv', cvFile);
      }

      await submitApplication(dataToSend);

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset states
        setSubmitted(false);
        setCvFile(null);
        setManualEntry(false);
        setFormData({
          nombre: '', email: '', telefono: '', ubicacion: '',
          experiencia: '', educacion: '', puestoActual: '', mensaje: '', cv_text: ''
        });
      }, 3000);

    } catch (err) {
      console.error("Error enviando postulación:", err);
      setError("Hubo un error al enviar tu solicitud. Intenta nuevamente.");
    }
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
            <CheckCircle size={80} color="#10b981" style={{ marginBottom: '1.5rem' }} />
            <h3 style={styles.successTitle}>¡Solicitud Enviada!</h3>
            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '1.1rem' }}>
              Gracias por aplicar a la vacante de <br /><strong style={{ color: '#111827' }}>{job.title}</strong>.
            </p>
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '1rem' }}>
              El equipo de RRHH revisará tu perfil y te contactará pronto.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.headerBanner}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 60%)', width: '250px', height: '250px', borderRadius: '50%' }}></div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 0.5rem 0', position: 'relative', zIndex: 2 }}>Aplica Ahora</h2>
              <p style={{ fontSize: '1.1rem', margin: 0, color: '#e5e7eb', position: 'relative', zIndex: 2 }}>{job.title} • {job.company}</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.formContainer}>
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
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, telefono: val }));
                    }}
                    required
                    style={styles.input}
                    placeholder="Ej. 1234567890"
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
                  {/* Aviso de análisis */}
                  {cvFile && !isAnalyzing && (
                    <div style={{
                      backgroundColor: '#eff6ff',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #dbeafe',
                      color: '#1e40af',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      Hemos extraído algunos datos de tu CV. Por favor verifícalos.
                    </div>
                  )}

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
                    {isAnalyzing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Loader2 size={32} color="#c3002f" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={styles.uploadText}>Analizando documento...</span>
                      </div>
                    ) : cvFile ? (
                      <>
                        <CheckCircle size={24} color="#10b981" />
                        <span style={{ ...styles.uploadText, color: '#0f766e' }}>{cvFile.name}</span>
                        <button
                          type="button"
                          style={styles.changeFileButton}
                          onClick={(e) => {
                            e.preventDefault();
                            setCvFile(null);
                            setFormData(prev => ({ ...prev, cv_text: '' }));
                          }}
                        >
                          Cambiar archivo
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload size={24} color="#6b7280" />
                        <span style={styles.uploadText}>Haz clic o arrastra tu archivo aquí</span>
                        <span style={styles.uploadSubtext}>Formato PDF (Max 5MB)</span>
                        <span style={{ fontSize: '0.8rem', color: '#c3002f', marginTop: '0.5rem' }}>
                          Al subir tu CV, llenaremos el formulario automáticamente
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      style={styles.fileInput}
                      onChange={handleFileChange}
                      required={!manualEntry}
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Mensaje Adicional ({manualEntry ? 'Opcional' : 'Requerido si no subes CV'})</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  rows="2"
                  placeholder="¿Algo más que debamos saber?"
                ></textarea>
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-hover" style={styles.submitButton} disabled={isAnalyzing}>
                {isAnalyzing ? 'Procesando...' : (manualEntry ? 'Enviar Solicitud Manual' : 'Enviar Postulación con CV')}
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
    backgroundColor: '#f9fafb',
    borderRadius: '1.5rem',
    width: '100%',
    maxWidth: '740px', // Wider
    padding: '0', // Using 0 because I've added a banner
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxHeight: '90vh',
    overflowY: 'auto',
    textAlign: 'left' // Explicit constraint
  },
  closeButton: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    cursor: 'pointer',
    color: '#ffffff',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    zIndex: 10,
    backdropFilter: 'blur(5px)',
  },
  headerBanner: {
    background: 'linear-gradient(135deg, #111827 0%, #1e293b 40%, #c3002f 100%)',
    padding: '3rem',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  },
  formContainer: {
    padding: '3rem',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#111827',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '0.5rem',
    marginTop: '1.5rem',
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
    padding: '0.875rem',
    borderRadius: '0.75rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
  },
  textarea: {
    padding: '0.875rem',
    borderRadius: '0.75rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
  },
  modeSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f3f4f6',
    padding: '0.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
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
    border: '2px dashed #cbd5e1',
    borderRadius: '1rem',
    padding: '3rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: '#f8fafc',
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
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 14px rgba(195, 0, 47, 0.25)',
  },
  successMessage: {
    textAlign: 'center',
    padding: '6rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Ensures consistency inside the modal
    height: '100%'
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#111827',
    marginBottom: '1rem',
  },
};

export default Registro;
