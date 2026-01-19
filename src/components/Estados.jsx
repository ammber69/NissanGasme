import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, FileText, Calendar, XCircle, AlertCircle } from 'lucide-react';

const TrackingPostulacion = () => {
  const [showModal, setShowModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [error, setError] = useState('');

  // Datos de ejemplo - en producción vendría de una API
  const mockApplications = {
    'NIS2024001': {
      code: 'NIS2024001',
      position: 'Vendedor de Piso',
      appliedDate: '15 Ene 2024',
      currentStatus: 'en-revision',
      applicantName: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      phone: '229-123-4567',
      timeline: [
        { status: 'recibida', date: '15 Ene 2024 - 10:30 AM', completed: true },
        { status: 'en-revision', date: '16 Ene 2024 - 09:15 AM', completed: true },
        { status: 'entrevista', date: 'Pendiente', completed: false },
        { status: 'decision', date: 'Pendiente', completed: false }
      ]
    },
    'NIS2024002': {
      code: 'NIS2024002',
      position: 'Asesor de Servicio',
      appliedDate: '10 Ene 2024',
      currentStatus: 'entrevista',
      applicantName: 'María González',
      email: 'maria@ejemplo.com',
      phone: '229-987-6543',
      interviewDate: '22 Ene 2024',
      interviewTime: '11:00 AM',
      interviewLocation: 'Oficinas Nissan Banzai',
      timeline: [
        { status: 'recibida', date: '10 Ene 2024 - 02:45 PM', completed: true },
        { status: 'en-revision', date: '11 Ene 2024 - 10:00 AM', completed: true },
        { status: 'entrevista', date: '22 Ene 2024 - 11:00 AM', completed: true },
        { status: 'decision', date: 'Pendiente', completed: false }
      ]
    },
    'NIS2024003': {
      code: 'NIS2024003',
      position: 'Técnico Mecánico',
      appliedDate: '05 Ene 2024',
      currentStatus: 'aprobada',
      applicantName: 'Carlos Ramírez',
      email: 'carlos@ejemplo.com',
      phone: '229-555-1234',
      timeline: [
        { status: 'recibida', date: '05 Ene 2024 - 03:20 PM', completed: true },
        { status: 'en-revision', date: '06 Ene 2024 - 09:30 AM', completed: true },
        { status: 'entrevista', date: '12 Ene 2024 - 10:00 AM', completed: true },
        { status: 'decision', date: '18 Ene 2024 - Aprobada', completed: true }
      ]
    },
    'NIS2024004': {
      code: 'NIS2024004',
      position: 'Recepcionista',
      appliedDate: '08 Ene 2024',
      currentStatus: 'rechazada',
      applicantName: 'Ana Martínez',
      email: 'ana@ejemplo.com',
      phone: '229-444-5678',
      timeline: [
        { status: 'recibida', date: '08 Ene 2024 - 11:15 AM', completed: true },
        { status: 'en-revision', date: '09 Ene 2024 - 02:00 PM', completed: true },
        { status: 'entrevista', date: 'No programada', completed: false },
        { status: 'decision', date: '14 Ene 2024 - No seleccionada', completed: true }
      ]
    }
  };

  const handleSearch = () => {
    setError('');
    const cleanCode = trackingCode.trim().toUpperCase();
    
    if (!cleanCode) {
      setError('Por favor ingresa tu código de postulación');
      return;
    }

    const application = mockApplications[cleanCode];
    
    if (application) {
      setApplicationData(application);
    } else {
      setError('Código no encontrado. Verifica e intenta nuevamente.');
      setApplicationData(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      'recibida': {
        label: 'Solicitud Recibida',
        icon: FileText,
        color: '#3b82f6',
        bgColor: '#dbeafe'
      },
      'en-revision': {
        label: 'En Revisión',
        icon: Clock,
        color: '#f59e0b',
        bgColor: '#fef3c7'
      },
      'entrevista': {
        label: 'Entrevista Programada',
        icon: Calendar,
        color: '#8b5cf6',
        bgColor: '#ede9fe'
      },
      'decision': {
        label: 'Decisión Final',
        icon: CheckCircle,
        color: '#10b981',
        bgColor: '#d1fae5'
      },
      'aprobada': {
        label: '¡Felicidades! Has sido seleccionado',
        icon: CheckCircle,
        color: '#10b981',
        bgColor: '#d1fae5'
      },
      'rechazada': {
        label: 'No seleccionado',
        icon: XCircle,
        color: '#ef4444',
        bgColor: '#fee2e2'
      }
    };
    return statusConfig[status] || statusConfig['recibida'];
  };

  const resetModal = () => {
    setShowModal(false);
    setTrackingCode('');
    setApplicationData(null);
    setError('');
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <button onClick={() => setShowModal(true)} style={styles.triggerButton}>
        Ver Mi Postulación
      </button>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={resetModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={resetModal}>
              <X size={24} />
            </button>

            {!applicationData ? (
              /* Vista de búsqueda */
              <div style={styles.searchSection}>
                <div style={styles.searchHeader}>
                  <div style={styles.iconWrapper}>
                    <Search size={48} color="#c3002f" />
                  </div>
                  <h2 style={styles.title}>Consultar Estado de Postulación</h2>
                  <p style={styles.subtitle}>
                    Ingresa el código que recibiste por correo electrónico al aplicar
                  </p>
                </div>

                <div style={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Ej: NIS2024001"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={styles.searchInput}
                  />
                  <button onClick={handleSearch} style={styles.searchButton}>
                    <Search size={20} />
                    Buscar
                  </button>
                </div>

                {error && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div style={styles.exampleCodes}>
                  <p style={styles.exampleTitle}>Códigos de ejemplo para probar:</p>
                  <div style={styles.codesList}>
                    <code style={styles.code}>NIS2024001</code>
                    <code style={styles.code}>NIS2024002</code>
                    <code style={styles.code}>NIS2024003</code>
                    <code style={styles.code}>NIS2024004</code>
                  </div>
                </div>
              </div>
            ) : (
              /* Vista de resultado */
              <div style={styles.resultSection}>
                {/* Header con información del aplicante */}
                <div style={styles.resultHeader}>
                  <h3 style={styles.positionTitle}>{applicationData.position}</h3>
                  <p style={styles.applicantInfo}>
                    Código de seguimiento: <strong>{applicationData.code}</strong>
                  </p>
                  <p style={styles.applicantInfo}>
                    Fecha de aplicación: {applicationData.appliedDate}
                  </p>
                </div>

                {/* Estado actual destacado */}
                <div style={{
                  ...styles.currentStatusCard,
                  backgroundColor: getStatusInfo(applicationData.currentStatus).bgColor
                }}>
                  <div style={styles.statusIconLarge}>
                    {React.createElement(getStatusInfo(applicationData.currentStatus).icon, {
                      size: 40,
                      color: getStatusInfo(applicationData.currentStatus).color
                    })}
                  </div>
                  <h4 style={{
                    ...styles.currentStatusText,
                    color: getStatusInfo(applicationData.currentStatus).color
                  }}>
                    {getStatusInfo(applicationData.currentStatus).label}
                  </h4>
                </div>

                {/* Información de entrevista si aplica */}
                {applicationData.interviewDate && applicationData.currentStatus === 'entrevista' && (
                  <div style={styles.interviewCard}>
                    <h5 style={styles.interviewTitle}>📅 Detalles de tu Entrevista</h5>
                    <div style={styles.interviewDetails}>
                      <p><strong>Fecha:</strong> {applicationData.interviewDate}</p>
                      <p><strong>Hora:</strong> {applicationData.interviewTime}</p>
                      <p><strong>Lugar:</strong> {applicationData.interviewLocation}</p>
                    </div>
                    <p style={styles.interviewNote}>
                      Por favor llega 10 minutos antes. Trae una identificación oficial.
                    </p>
                  </div>
                )}

                {/* Timeline de progreso */}
                <div style={styles.timelineSection}>
                  <h5 style={styles.timelineTitle}>Historial de tu Postulación</h5>
                  <div style={styles.timeline}>
                    {applicationData.timeline.map((step, index) => {
                      const statusInfo = getStatusInfo(step.status);
                      const Icon = statusInfo.icon;
                      
                      return (
                        <div key={index} style={styles.timelineItem}>
                          <div style={styles.timelineLeft}>
                            <div style={{
                              ...styles.timelineIcon,
                              backgroundColor: step.completed ? statusInfo.color : '#e5e7eb',
                              borderColor: step.completed ? statusInfo.color : '#d1d5db'
                            }}>
                              <Icon size={20} color="#ffffff" />
                            </div>
                            {index < applicationData.timeline.length - 1 && (
                              <div style={{
                                ...styles.timelineLine,
                                backgroundColor: step.completed && applicationData.timeline[index + 1].completed
                                  ? statusInfo.color
                                  : '#e5e7eb'
                              }} />
                            )}
                          </div>
                          <div style={styles.timelineContent}>
                            <h6 style={{
                              ...styles.timelineLabel,
                              color: step.completed ? '#111827' : '#9ca3af'
                            }}>
                              {statusInfo.label}
                            </h6>
                            <p style={{
                              ...styles.timelineDate,
                              color: step.completed ? '#6b7280' : '#9ca3af'
                            }}>
                              {step.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mensaje adicional según el estado */}
                {applicationData.currentStatus === 'aprobada' && (
                  <div style={styles.finalMessage}>
                    <p style={styles.finalMessageText}>
                      🎉 Nos pondremos en contacto contigo pronto para los siguientes pasos del proceso de contratación.
                    </p>
                  </div>
                )}

                {applicationData.currentStatus === 'rechazada' && (
                  <div style={styles.finalMessageRejected}>
                    <p style={styles.finalMessageText}>
                      Gracias por tu interés en formar parte de nuestro equipo. Te animamos a seguir aplicando a futuras vacantes que se ajusten a tu perfil.
                    </p>
                  </div>
                )}

                {/* Botón para nueva búsqueda */}
                <button onClick={() => setApplicationData(null)} style={styles.newSearchButton}>
                  Consultar otra postulación
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  triggerButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#c3002f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  searchSection: {
    padding: '3rem 2rem',
  },
  searchHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    margin: '0 auto 1rem',
    backgroundColor: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  searchBox: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '2px solid #d1d5db',
    borderRadius: '0.5rem',
    outline: 'none',
    textTransform: 'uppercase',
  },
  searchButton: {
    padding: '0.875rem 1.5rem',
    backgroundColor: '#c3002f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  exampleCodes: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  exampleTitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.75rem',
    fontWeight: '500',
  },
  codesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  code: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    color: '#c3002f',
    cursor: 'pointer',
  },
  resultSection: {
    padding: '2rem',
  },
  resultHeader: {
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem',
  },
  positionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  applicantInfo: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  currentStatusCard: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  statusIconLarge: {
    marginBottom: '0.75rem',
  },
  currentStatusText: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0,
  },
  interviewCard: {
    backgroundColor: '#ede9fe',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    border: '2px solid #8b5cf6',
  },
  interviewTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#5b21b6',
    marginBottom: '0.75rem',
    margin: '0 0 0.75rem 0',
  },
  interviewDetails: {
    marginBottom: '0.75rem',
    lineHeight: '1.8',
  },
  interviewNote: {
    fontSize: '0.85rem',
    color: '#6b21a8',
    fontStyle: 'italic',
    margin: 0,
  },
  timelineSection: {
    marginBottom: '1.5rem',
  },
  timelineTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.25rem',
    margin: '0 0 1.25rem 0',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    gap: '1rem',
    position: 'relative',
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  timelineIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid',
    flexShrink: 0,
    zIndex: 1,
  },
  timelineLine: {
    width: '3px',
    flex: 1,
    minHeight: '40px',
    marginTop: '4px',
    marginBottom: '4px',
  },
  timelineContent: {
    paddingBottom: '1.5rem',
    flex: 1,
  },
  timelineLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    margin: '0 0 0.25rem 0',
  },
  timelineDate: {
    fontSize: '0.875rem',
    margin: 0,
  },
  finalMessage: {
    backgroundColor: '#d1fae5',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    border: '2px solid #10b981',
  },
  finalMessageRejected: {
    backgroundColor: '#fee2e2',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    border: '2px solid #ef4444',
  },
  finalMessageText: {
    fontSize: '0.95rem',
    color: '#111827',
    lineHeight: '1.6',
    margin: 0,
  },
  newSearchButton: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default TrackingPostulacion;
