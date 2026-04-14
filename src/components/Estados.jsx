import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, FileText, Calendar, XCircle, AlertCircle, Loader2, Send, Bell, Glasses, ClipboardCheck, UserCheck, Briefcase } from 'lucide-react';
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
    if (e.key === 'Enter') handleSearch();
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      'NEW': { label: 'ENVIADO', icon: Send },
      'REC': { label: 'EN REVISIÓN (RRHH)', icon: Bell },
      'REV': { label: 'EVALUANDO PERFIL', icon: Glasses },
      'ENT': { label: 'ENTREVISTA', icon: Calendar },
      'PRE': { label: 'PRE-SELECCIONADO', icon: ClipboardCheck },
      'CON': { label: 'CONTRATADO', icon: UserCheck },
      'REJ': { label: 'DESCARTADO', icon: XCircle }
    };
    return statusConfig[status] || { label: (status || 'ESTADO DESCONOCIDO').toUpperCase(), icon: Clock };
  };

  const resetModal = () => {
    setShowModal(false);
    setTrackingCode('');
    setApplicationData(null);
    setError('');
  };

  return (
    <>
      {!hideButton && (
        <button onClick={() => setShowModal(true)} style={styles.triggerButton}>
          Ver Mi Postulación
        </button>
      )}

      {showModal && (
        <div style={styles.overlay} onClick={resetModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={resetModal}>
              <X size={24} />
            </button>

            {/* Banner Superior Premium */}
            <div style={styles.headerBanner}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 60%)', width: '250px', height: '250px', borderRadius: '50%' }}></div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 0.5rem 0', position: 'relative', zIndex: 2 }}>Estado del Proceso</h2>
              <p style={{ fontSize: '1.1rem', margin: 0, color: '#e5e7eb', position: 'relative', zIndex: 2 }}>Monitorea el avance de tu postulación con GASME</p>
            </div>

            {!applicationData ? (
              <div style={styles.contentContainer}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: '0 0 0.5rem 0' }}>Consulta tu código</h3>
                  <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>Ingresa el código alfanumérico que recibiste en tu correo de confirmación.</p>
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
                  <button onClick={handleSearch} style={{ ...styles.searchButton, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading} className="btn-hover">
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                  </button>
                </div>

                {error && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.contentContainer} className="animate-fade-in">
                {/* Meta Header */}
                <div style={styles.metaHeader}>
                  <div style={styles.metaIcon}>
                    <Briefcase size={32} color="#c3002f" />
                  </div>
                  <div>
                    <h3 style={styles.metaTitle}>{applicationData.position}</h3>
                    <p style={styles.metaSubtitle}>Cód: <strong style={{ color: '#111827' }}>{applicationData.code}</strong> <span style={{ margin: '0 0.5rem', color: '#d1d5db' }}>|</span> {applicationData.appliedDate}</p>
                  </div>
                </div>

                {/* Línea de Tiempo Fortune 500 */}
                <div style={styles.timelineWrapper}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Línea de Tiempo Operativa</h4>
                  <div style={styles.timeline}>
                    {applicationData.timeline
                      .filter((step, index, self) => index === self.findIndex(s => getStatusInfo(s.status).label === getStatusInfo(step.status).label))
                      .map((step, index, arr) => {
                        const statusInfo = getStatusInfo(step.status);
                        const Icon = statusInfo.icon;

                        const currentIndex = arr.findIndex(s => s.status === applicationData.currentStatus);
                        const isCurrentState = index === currentIndex;
                        const isPastState = index < currentIndex;
                        const isRejected = step.status === 'REJ';

                        let bgColor = isPastState ? '#10b981' : (isCurrentState ? (isRejected ? '#ef4444' : '#111827') : '#f3f4f6');
                        let iconColor = isPastState || isCurrentState ? '#ffffff' : '#9ca3af';
                        let lineColor = isPastState ? '#10b981' : '#e5e7eb';

                        return (
                          <div key={index} style={styles.timelineItem}>
                            <div style={styles.timelineLeft}>
                              <div style={{
                                ...styles.timelineIconNode,
                                backgroundColor: bgColor,
                                border: isPastState || isCurrentState ? 'none' : '2px solid #d1d5db',
                                boxShadow: isCurrentState ? `0 0 0 4px ${bgColor}33` : 'none', // Sutil
                              }}>
                                {isPastState && !isRejected ? <CheckCircle size={18} color="#fff" /> : <Icon size={18} color={iconColor} />}
                              </div>
                              {index < arr.length - 1 && (
                                <div style={{ ...styles.timelineLine, backgroundColor: lineColor }} />
                              )}
                            </div>
                            <div style={styles.timelineContent}>
                              <h6 style={{
                                ...styles.timelineLabel,
                                color: isCurrentState ? (isRejected ? '#ef4444' : '#111827') : (isPastState ? '#374151' : '#9ca3af')
                              }}>
                                {statusInfo.label}
                              </h6>
                              <p style={styles.timelineDate}>{step.date}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Context Cards */}
                {(applicationData.interviewDate && applicationData.currentStatus === 'ENT') && (
                  <div style={{ ...styles.contextCard, borderLeft: '4px solid #7c3aed', backgroundColor: '#f5f3ff' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <Calendar size={24} color="#7C3AED" style={{ marginTop: '2px' }} />
                      <div>
                        <h5 style={{ ...styles.contextTitle, color: '#5b21b6' }}>Entrevista Programada</h5>
                        <p style={{ ...styles.contextText, color: '#4c1d95' }}><strong>Fecha:</strong> {applicationData.interviewDate} a las {applicationData.interviewTime}</p>
                        <p style={{ ...styles.contextText, color: '#4c1d95' }}><strong>Lugar:</strong> {applicationData.interviewLocation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {applicationData.currentStatus === 'CON' && (
                  <div style={{ ...styles.contextCard, borderLeft: '4px solid #10b981', backgroundColor: '#ecfdf5' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <UserCheck size={24} color="#10b981" style={{ marginTop: '2px' }} />
                      <div>
                        <h5 style={{ ...styles.contextTitle, color: '#047857' }}>¡Contratación Confirmada!</h5>
                        <p style={{ ...styles.contextText, color: '#065f46' }}>Bienvenido al equipo de Grupo Automotriz Nissan GASME.</p>
                      </div>
                    </div>
                  </div>
                )}

                {applicationData.currentStatus === 'REJ' && (
                  <div style={{ ...styles.contextCard, borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <AlertCircle size={24} color="#ef4444" style={{ marginTop: '2px' }} />
                      <div>
                        <h5 style={{ ...styles.contextTitle, color: '#b91c1c' }}>Proceso Concluido</h5>
                        <p style={{ ...styles.contextText, color: '#7f1d1d' }}>Agradecemos mucho tu tiempo. Tu información permanecerá en nuestra bolsa de talentos para oportunidades futuras.</p>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={() => setApplicationData(null)} className="btn-hover" style={styles.resetButton}>
                  Consultar un nuevo código
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
    backgroundColor: '#f9fafb',
    borderRadius: '1.5rem',
    width: '100%',
    maxWidth: '740px',
    padding: '0',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    textAlign: 'left'
  },
  headerBanner: {
    background: 'linear-gradient(135deg, #111827 0%, #1e293b 40%, #c3002f 100%)',
    padding: '3rem',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
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
    zIndex: 10,
    backdropFilter: 'blur(5px)',
    transition: 'background-color 0.2s',
  },
  contentContainer: {
    padding: '3rem',
    backgroundColor: '#ffffff',
    minHeight: '400px'
  },
  searchBox: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  searchInput: {
    flex: 1,
    padding: '1.25rem 1.5rem',
    fontSize: '1.1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    outline: 'none',
    textTransform: 'uppercase',
    color: '#111827',
    fontWeight: 'bold',
    transition: 'border-color 0.2s',
  },
  searchButton: {
    padding: '0 1.5rem',
    backgroundColor: '#c3002f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginTop: '1rem',
    border: '1px solid #fee2e2'
  },
  metaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2.5rem',
    paddingBottom: '2.5rem',
    borderBottom: '2px solid #f3f4f6'
  },
  metaIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '1.25rem',
    backgroundColor: '#fff1f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffe4e6'
  },
  metaTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 0.4rem 0'
  },
  metaSubtitle: {
    color: '#6b7280',
    margin: 0,
    fontSize: '1.05rem',
  },
  timelineWrapper: {
    marginBottom: '2rem'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    gap: '1.5rem',
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '36px',
  },
  timelineIconNode: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'all 0.3s ease',
  },
  timelineLine: {
    width: '3px',
    minHeight: '40px',
    flex: 1,
    margin: '6px 0',
    borderRadius: '1.5px',
    transition: 'background-color 0.3s ease',
  },
  timelineContent: {
    paddingBottom: '2rem',
    flex: 1,
    paddingTop: '0.4rem',
  },
  timelineLabel: {
    fontSize: '1.1rem',
    fontWeight: '800',
    margin: '0 0 0.25rem 0',
  },
  timelineDate: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    margin: 0,
    fontWeight: '500'
  },
  contextCard: {
    padding: '1.5rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
  },
  contextTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
  },
  contextText: {
    fontSize: '0.95rem',
    margin: '0 0 0.25rem 0',
  },
  resetButton: {
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#ffffff',
    color: '#111827',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s'
  }
};

export default TrackingPostulacion;
