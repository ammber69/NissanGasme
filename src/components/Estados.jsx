import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, FileText, Calendar, XCircle, AlertCircle, Loader2, Send, Bell, Glasses, ClipboardCheck, UserCheck } from 'lucide-react';
import { checkApplicationStatus } from '../api/api';

const TrackingPostulacion = ({
  showModal: externalShowModal,
  setShowModal: externalSetShowModal,
  hideButton = false
}) => {
  const [internalShowModal, setInternalShowModal] = useState(false);

  const showModal = externalShowModal !== undefined ? externalShowModal : internalShowModal;
  const setShowModal = externalSetShowModal || setInternalShowModal;

  const [trackingCode, setTrackingCode] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setError('');
    const cleanCode = trackingCode.trim().toUpperCase();

    if (!cleanCode) {
      setError('Por favor ingresa tu código de postulación');
      return;
    }

    setIsLoading(true);
    try {
      const data = await checkApplicationStatus(cleanCode);
      setApplicationData(data);
    } catch (err) {
      console.error(err);
      setError('Código no encontrado. Verifica e intenta nuevamente.');
      setApplicationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusInfo = (status) => {
    // Configuración general
    // El color actual será Verde para todos (a excepción de Descartado que es rojo)
    // El texto y configuración de iconos
    const statusConfig = {
      'NEW': {
        label: 'POSTULADO',
        icon: Send,
      },
      'REC': {
        label: 'RECIBIDO',
        icon: Bell, // Campanita
      },
      'REV': {
        label: 'EN REVISIÓN',
        icon: Glasses, // Lentes
      },
      'ENT': {
        label: 'ENTREVISTA',
        icon: ClipboardCheck, // Tipo checklist
      },
      'PRE': {
        label: 'PRE-SELECCIONADO',
        icon: UserCheck, // Persona con palomita (gris/blanco)
      },
      'CON': {
        label: 'SELECCIONADO',
        icon: UserCheck, // Persona con palomita (verde)
      },
      'REJ': {
        label: 'DESCARTADO',
        icon: XCircle,
      }
    };
    return statusConfig[status] || {
      label: (status || 'ESTADO DESCONOCIDO').toUpperCase(),
      icon: Clock
    };
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
      {!hideButton && (
        <button onClick={() => setShowModal(true)} style={styles.triggerButton}>
          Ver Mi Postulación
        </button>
      )}

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
                    placeholder="Ej: AB12CD34"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={styles.searchInput}
                    disabled={isLoading}
                  />
                  <button onClick={handleSearch} style={{ ...styles.searchButton, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>

                {error && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <div style={styles.exampleCodes}>
                  <p style={styles.exampleTitle}>Ingresa aquí el código que te enviamos por correo.</p>
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
                  // Verde por defecto, pero Rojo (#ef4444) y fondo rojo si es Descartado
                  backgroundColor: applicationData.currentStatus === 'REJ' ? '#fee2e2' : '#dcfce7',
                  boxShadow: `0 10px 25px -5px ${applicationData.currentStatus === 'REJ' ? '#ef4444' : '#22c55e'}40`
                }}>
                  <div style={styles.statusIconLarge}>
                    {React.createElement(getStatusInfo(applicationData.currentStatus).icon, {
                      size: 48,
                      color: applicationData.currentStatus === 'REJ' ? '#ef4444' : '#22c55e'
                    })}
                  </div>
                  <h4 style={{
                    ...styles.currentStatusText,
                    color: applicationData.currentStatus === 'REJ' ? '#ef4444' : '#22c55e'
                  }}>
                    {getStatusInfo(applicationData.currentStatus).label}
                  </h4>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.95rem',
                    color: '#4b5563',
                    opacity: 0.8
                  }}>
                    Estado Actual
                  </p>
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
                  <h5 style={styles.timelineTitle}>Progreso de la Postulación</h5>
                  <div style={styles.timeline}>
                    {applicationData.timeline.map((step, index) => {
                      const statusInfo = getStatusInfo(step.status);
                      const Icon = statusInfo.icon;

                      // Lógica de colores del usuari0:
                      // Solo se iluminará el estado EN EL QUE SE ENCUENTRE (verde, o rojo si está descartado)
                      // Todo lo demás, ya sea completado en el pasado o no completado hacia el futuro, será Gris.
                      // En el "caminito" (línea) también será gris.  

                      const isCurrentState = step.status === applicationData.currentStatus;

                      let iconColor = '#9ca3af'; // Gris por defecto (pasado o futuro no iluminado)
                      let bgColor = '#f3f4f6'; // Gris clarito para el circulo
                      let borderColor = '#d1d5db'; // Borde gris claro

                      if (isCurrentState) {
                        if (step.status === 'REJ') {
                          iconColor = '#ffffff';
                          bgColor = '#ef4444'; // Rojo intenso
                          borderColor = '#ef4444';
                        } else {
                          iconColor = '#ffffff';
                          bgColor = '#22c55e'; // Verde
                          borderColor = '#22c55e';
                        }
                      } else {
                        // Si queremos que el icono en el punto muerto sea gris mas oscuro
                        iconColor = '#6b7280';
                      }

                      return (
                        <div key={index} style={styles.timelineItem}>
                          <div style={styles.timelineLeft}>
                            <div style={{
                              ...styles.timelineIcon,
                              backgroundColor: bgColor,
                              borderColor: borderColor,
                              // Hacer brillar la bolita unicamente si es el estado actual
                              boxShadow: isCurrentState ? `0 0 10px ${borderColor}80` : 'none'
                            }}>
                              <Icon size={20} color={iconColor} />
                            </div>
                            {index < applicationData.timeline.length - 1 && (
                              <div style={{
                                ...styles.timelineLine,
                                backgroundColor: '#e5e7eb' // La linea SIEMPRE sera gris según el req.
                              }} />
                            )}
                          </div>
                          <div style={styles.timelineContent}>
                            <h6 style={{
                              ...styles.timelineLabel,
                              color: isCurrentState ? (step.status === 'REJ' ? '#ef4444' : '#15803d') : '#6b7280',
                              fontWeight: isCurrentState ? '800' : '600'
                            }}>
                              {statusInfo.label}
                            </h6>
                            <p style={{
                              ...styles.timelineDate,
                              color: '#9ca3af'
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
                {applicationData.currentStatus === 'CON' && (
                  <div style={styles.finalMessage}>
                    <p style={styles.finalMessageText}>
                      🎉 ¡Felicidades, te hemos aceptado! Nos pondremos en contacto contigo pronto para tu integración.
                    </p>
                  </div>
                )}

                {applicationData.currentStatus === 'REJ' && (
                  <div style={styles.finalMessageRejected}>
                    <p style={styles.finalMessageText}>
                      Agradecemos mucho tu tiempo. En esta ocasión hemos avanzado con otro perfil, pero mantendremos tu información para futuras vacantes.
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
        </div >
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
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.05)',
  },
  closeButton: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    background: '#f3f4f6',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 0.2s',
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
    padding: '2rem 1.5rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.5)',
  },
  statusIconLarge: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  currentStatusText: {
    fontSize: '1.5rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.025em',
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
    width: '4px',
    flex: 1,
    minHeight: '40px',
    marginTop: '6px',
    marginBottom: '6px',
    borderRadius: '2px', // Bordes redondeados en la linea
  },
  timelineContent: {
    paddingBottom: '2rem',
    flex: 1,
    paddingTop: '0.5rem', // Alinear visualmente con el icono
  },
  timelineLabel: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
    margin: '0 0 0.35rem 0',
  },
  timelineDate: {
    fontSize: '0.9rem',
    margin: 0,
    fontWeight: '500',
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
