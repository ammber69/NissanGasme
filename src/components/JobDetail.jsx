import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Share2, X, ChevronLeft, Bookmark } from 'lucide-react';
import Registro from './Registro';

const JobDetail = ({ job, isMobile, onClose, onShare, showCopiedMessage, onSave, isSaved }) => {
    const [showRegistration, setShowRegistration] = useState(false);

    // Helper to handle safe property access for API vs Mock data
    const safeJob = {
        ...job,
        time: job.contract_type || job.time,
        experience: job.experience_level || job.experience,
        salary: job.salary_range || job.salary,
        postedTime: job.postedTime || new Date(job.posted_at).toLocaleDateString()
    };

    const styles = {
        // Desktop Styles
        detailsPanel: {
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            // padding: '2rem', // Removed padding from container
            height: '100%',
            overflow: 'hidden', // Container hidden, inner scroll
            display: 'flex',
            flexDirection: 'column',
        },
        detailsHeader: {
            padding: '2rem 2rem 1rem 2rem',
            borderBottom: '1px solid #f3f4f6',
            flexShrink: 0,
        },
        scrollableContent: {
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 2rem 2rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        },
        fixedFooter: {
            padding: '1.5rem 2rem',
            borderTop: '1px solid #f3f4f6',
            backgroundColor: '#ffffff',
            flexShrink: 0,
            zIndex: 10,
        },
        detailsHeaderTop: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
        },
        detailsActions: {
            display: 'flex',
            gap: '0.5rem',
        },
        closeButton: {
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconButton: {
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        detailsJobInfo: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        },
        detailsIconWrapper: {
            width: '64px',
            height: '64px',
            backgroundColor: '#fee2e2',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
        },
        detailsJobTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem',
        },
        detailsCompany: {
            fontSize: '1rem',
            color: '#4b5563',
            marginBottom: '0.5rem',
        },
        applicationsCount: {
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
        },
        detailsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
        },
        detailsLabel: {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.25rem',
            fontWeight: '500',
        },
        detailsValue: {
            fontSize: '1rem',
            color: '#111827',
            fontWeight: '600',
        },
        descriptionSection: {
            borderTop: '1px solid #f3f4f6',
            paddingTop: '1.5rem',
        },
        description: {
            fontSize: '1rem',
            lineHeight: '1.7',
            color: '#4b5563',
        },
        salarySection: {
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            marginTop: '0.5rem',
        },
        salaryValue: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#c3002f',
        },
        applyButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#c3002f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(195, 0, 47, 0.3)',
        }
    };

    const mobileStyles = {
        fullScreenModal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f3f4f6',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
        },
        modalHeader: {
            backgroundColor: '#FEFEFE',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        },
        backButton: {
            background: 'none',
            border: 'none',
            color: '#4b5563',
            padding: '0.5rem',
            marginLeft: '-0.5rem',
        },
        modalHeaderTitle: {
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
        },
        shareButton: {
            background: 'none',
            border: 'none',
            color: '#4b5563',
            padding: '0.5rem',
            marginRight: '-0.5rem',
        },
        modalBody: {
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            paddingBottom: '80px',
        },
        jobHeaderFull: {
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            marginBottom: '1rem',
            textAlign: 'center',
        },
        companyLogoLarge: {
            width: '64px',
            height: '64px',
            margin: '0 auto 1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        jobTitleFull: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
        },
        companyNameFull: {
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
        },
        locationFull: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            fontSize: '0.9rem',
        },
        statsRow: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1rem',
        },
        statItem: {
            backgroundColor: '#ffffff',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        statLabel: {
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.25rem',
        },
        statValue: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#111827',
        },
        salaryCard: {
            backgroundColor: '#c3002f',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            color: '#ffffff',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px -1px rgba(195, 0, 47, 0.4)',
        },
        salaryCardHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            opacity: 0.9,
        },
        salaryCardTitle: {
            fontSize: '0.9rem',
            fontWeight: '500',
        },
        salaryAmount: {
            fontSize: '1.75rem',
            fontWeight: 'bold',
        },
        descriptionCard: {
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            marginBottom: '1rem',
        },
        sectionTitle: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem',
        },
        descriptionText: {
            color: '#4b5563',
            lineHeight: '1.6',
            fontSize: '0.95rem',
        },
        metaInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 0.5rem',
            marginBottom: '1rem',
        },
        applicationsText: {
            color: '#059669',
            fontSize: '0.85rem',
            fontWeight: '500',
        },
        postedText: {
            color: '#9ca3af',
            fontSize: '0.85rem',
        },
        modalFooter: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '0.75rem',
            zIndex: 20,
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
        },
        applyButtonFull: {
            flex: 1,
            backgroundColor: '#c3002f',
            color: '#ffffff',
            border: 'none',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px -1px rgba(195, 0, 47, 0.3)',
        },
        saveButtonFull: {
            width: '3.5rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    if (isMobile) {
        return (
            <div style={mobileStyles.fullScreenModal}>
                <div style={mobileStyles.modalHeader}>
                    <button style={mobileStyles.backButton} onClick={onClose}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={mobileStyles.modalHeaderTitle}>Detalles del empleo</h2>
                    <button style={mobileStyles.shareButton} onClick={onShare}>
                        <Share2 size={20} />
                    </button>
                </div>

                <div style={mobileStyles.modalBody}>
                    <div style={mobileStyles.jobHeaderFull}>
                        <div style={mobileStyles.companyLogoLarge}>
                            <Briefcase size={32} color="#c3002f" />
                        </div>
                        <h1 style={mobileStyles.jobTitleFull}>{safeJob.title}</h1>
                        <p style={mobileStyles.companyNameFull}>{safeJob.company}</p>
                        <div style={mobileStyles.locationFull}>
                            <MapPin size={16} color="#6b7280" />
                            <span>{safeJob.location}</span>
                        </div>
                    </div>

                    <div style={mobileStyles.statsRow}>
                        <div style={mobileStyles.statItem}>
                            <Clock size={18} color="#c3002f" />
                            <div>
                                <div style={mobileStyles.statLabel}>Tipo</div>
                                <div style={mobileStyles.statValue}>{safeJob.time}</div>
                            </div>
                        </div>
                        <div style={mobileStyles.statItem}>
                            <Briefcase size={18} color="#c3002f" />
                            <div>
                                <div style={mobileStyles.statLabel}>Experiencia</div>
                                <div style={mobileStyles.statValue}>{safeJob.experience}</div>
                            </div>
                        </div>
                    </div>

                    <div style={mobileStyles.salaryCard}>
                        <div style={mobileStyles.salaryCardHeader}>
                            <DollarSign size={24} color="#c3002f" />
                            <span style={mobileStyles.salaryCardTitle}>Salario ofrecido</span>
                        </div>
                        <div style={mobileStyles.salaryAmount}>{safeJob.salary}</div>
                    </div>

                    <div style={mobileStyles.descriptionCard}>
                        <h3 style={mobileStyles.sectionTitle}>Sobre el puesto</h3>
                        <p style={mobileStyles.descriptionText}>{safeJob.description}</p>
                    </div>

                    <div style={mobileStyles.metaInfo}>
                        <span style={mobileStyles.applicationsText}>
                            {safeJob.applications || 'Sé uno de los primeros en aplicar'}
                        </span>
                        <span style={mobileStyles.postedText}>
                            Publicado {safeJob.postedTime?.toLowerCase()}
                        </span>
                    </div>
                    {/* Spacer for fixed footer */}
                    <div style={{ height: "60px" }}></div>
                </div>

                <div style={mobileStyles.modalFooter}>
                    <button
                        style={mobileStyles.applyButtonFull}
                        onClick={() => setShowRegistration(true)}
                    >
                        Aplicar a esta vacante
                    </button>
                </div>

                {/* Modal: Registro */}
                {showRegistration && (
                    <Registro
                        job={safeJob}
                        onClose={() => setShowRegistration(false)}
                    />
                )}
            </div>
        );
    }

    // Desktop Render
    return (
        <aside style={styles.detailsPanel}>
            {/* Header Fijo */}
            <div style={styles.detailsHeader}>
                <div style={styles.detailsHeaderTop}>
                    <div style={styles.detailsActions}>
                        <button style={styles.iconButton} onClick={onShare}>
                            <Share2 size={20} />
                        </button>
                        {showCopiedMessage && <span style={{ color: 'green', fontSize: '0.8rem', alignSelf: 'center' }}>¡Copiado!</span>}
                    </div>
                    <button style={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div style={styles.detailsJobInfo}>
                    <div style={styles.detailsIconWrapper}>
                        <Briefcase size={32} color="#c3002f" />
                    </div>
                    <h2 style={styles.detailsJobTitle}>{safeJob.title}</h2>
                    <p style={styles.detailsCompany}>{safeJob.company} - {safeJob.location}</p>
                    <span style={styles.applicationsCount}>{safeJob.applications || 'Nuevas vacantes'}</span>
                </div>
            </div>

            {/* Contenido Scrollable */}
            <div style={styles.scrollableContent}>
                <div style={styles.detailsGrid}>
                    <div>
                        <h4 style={styles.detailsLabel}>Tipo de Trabajo</h4>
                        <p style={styles.detailsValue}>{safeJob.time}</p>
                    </div>
                    <div>
                        <h4 style={styles.detailsLabel}>Experiencia</h4>
                        <p style={styles.detailsValue}>{safeJob.experience}</p>
                    </div>
                    <div>
                        <h4 style={styles.detailsLabel}>Posición</h4>
                        <p style={styles.detailsValue}>{safeJob.title}</p>
                    </div>
                    <div>
                        <h4 style={styles.detailsLabel}>Fecha Publicado</h4>
                        <p style={styles.detailsValue}>{safeJob.postedTime}</p>
                    </div>
                </div>

                <div style={styles.descriptionSection}>
                    <h4 style={styles.detailsLabel}>Descripción</h4>
                    <p style={styles.description}>{safeJob.description}</p>
                </div>

                <div style={styles.salarySection}>
                    <h4 style={styles.detailsLabel}>Salario Base</h4>
                    <p style={styles.salaryValue}>{safeJob.salary}</p>
                </div>

                {safeJob.requirements && (
                    <div style={{ marginTop: '1rem' }}>
                        <h4 style={styles.detailsLabel}>Requisitos</h4>
                        <p style={styles.description}>{safeJob.requirements}</p>
                    </div>
                )}

                {safeJob.benefits && (
                    <div style={{ marginTop: '1rem' }}>
                        <h4 style={styles.detailsLabel}>Beneficios</h4>
                        <p style={styles.description}>{safeJob.benefits}</p>
                    </div>
                )}
            </div>

            {/* Footer Fijo */}
            <div style={styles.fixedFooter}>
                <button
                    style={styles.applyButton}
                    onClick={() => setShowRegistration(true)}
                >
                    Postularme Ahora
                </button>
            </div>

            {/* Modal: Registro */}
            {showRegistration && (
                <Registro
                    job={safeJob}
                    onClose={() => setShowRegistration(false)}
                />
            )}
        </aside>
    );
};

export default JobDetail;
