import React, { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';

const Registro = ({ job, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset states
      setSubmitted(false);
      setCvFile(null);
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
            <p>Gracias por aplicar a la vacante de {job.title}.</p>
            <p>Nos pondremos en contacto contigo pronto.</p>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>Aplicar para {job.title}</h2>
              <p style={styles.subtitle}>{job.company} - {job.location}</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre Completo</label>
                <input type="text" required style={styles.input} placeholder="Juan Pérez" />
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Correo Electrónico</label>
                  <input type="email" required style={styles.input} placeholder="juan@ejemplo.com" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Teléfono</label>
                  <input type="tel" required style={styles.input} placeholder="(123) 456-7890" />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Currículum Vitae (PDF)</label>
                <div style={{ ...styles.uploadBox, ...(cvFile && styles.uploadBoxSuccess) }}>
                  {cvFile ? (
                    <>
                      <CheckCircle size={24} color="#10b981" />
                      <span style={{ ...styles.uploadText, color: '#0f766e' }}>{cvFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} color="#6b7280" />
                      <span style={styles.uploadText}>Haz clic o arrastra tu archivo aquí</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    style={styles.fileInput} 
                    onChange={handleFileChange}
                    required 
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mensaje (Opcional)</label>
                <textarea style={styles.textarea} rows="4" placeholder="Cuéntanos por qué eres el candidato ideal..."></textarea>
              </div>

              <button type="submit" style={styles.submitButton}>Enviar Solicitud</button>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    width: '100%',
    maxWidth: '500px',
    padding: '2rem',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    fontSize: '0.875rem',
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
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },
  uploadBox: {
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1.5rem',
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
    backgroundColor: '#eefbf3',
    borderColor: '#10b981',
  },
  uploadText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'center',
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
    padding: '0.875rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.2s',
  },
  successMessage: {
    textAlign: 'center',
    padding: '3rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
  },
};

export default Registro;
