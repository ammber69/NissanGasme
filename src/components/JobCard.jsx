import React from 'react';
import { Briefcase, MapPin, DollarSign, Share2, Bookmark } from 'lucide-react';

const JobCard = ({ job, isMobile, isSelected, onClick, onSave, isSaved, onShare }) => {
    // Mobile Styles (LinkedIn Style)
    const mobileStyles = {
        linkedInCard: {
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#ffffff',
            marginBottom: '0.5rem',
            position: 'relative',
        },
        linkedInCardLeft: {
            flexShrink: 0,
        },
        companyLogo: {
            width: '48px',
            height: '48px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        linkedInCardCenter: {
            flex: 1,
        },
        jobTitleLinkedIn: {
            fontSize: '1rem',
            fontWeight: '600',
            color: '#0a66c2',
            marginBottom: '0.25rem',
            lineHeight: '1.2',
        },
        companyNameLinkedIn: {
            fontSize: '0.9rem',
            color: '#1f2937',
            marginBottom: '0.25rem',
        },
        jobMetaLinkedIn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
        },
        jobMetaItem: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
        },
        jobMetaSeparator: {
            color: '#9ca3af',
        },
        salaryBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: '#4b5563',
            fontSize: '0.85rem',
            marginTop: '0.25rem',
        },
        linkedInCardRight: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        saveButton: {
            background: 'none',
            border: 'none',
            padding: '0.25rem',
            cursor: 'pointer',
        },
        postedTimeLinkedIn: {
            fontSize: '0.75rem',
            color: '#059669',
            fontWeight: '500',
        },
    };

    // Desktop Styles
    const styles = {
        jobCard: {
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#f3f4f6',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        jobCardActive: {
            borderColor: '#c3002f',
            backgroundColor: '#fff1f2',
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(195, 0, 47, 0.1), 0 10px 10px -5px rgba(195, 0, 47, 0.04)',
        },
        jobCardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
        },
        jobIconWrapper: {
            width: '52px',
            height: '52px',
            backgroundColor: '#fff1f2',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '1.25rem',
            border: '1px solid #ffe4e6',
        },
        jobInfo: {
            flex: 1,
        },
        jobTitle: {
            fontSize: '1.15rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '0.35rem',
            lineHeight: '1.3',
            letterSpacing: '-0.01em',
        },
        jobCompany: {
            fontSize: '0.95rem',
            color: '#4b5563',
            fontWeight: '600',
            marginBottom: '0.35rem',
        },
        jobLocation: {
            fontSize: '0.85rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: '500',
        },
        iconButton: {
            padding: '0.6rem',
            borderRadius: '0.75rem',
            border: '1px solid #f3f4f6',
            backgroundColor: '#ffffff',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        jobTags: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.5rem',
        },
        tag: {
            padding: '0.35rem 0.85rem',
            backgroundColor: '#f8fafc',
            color: '#334155',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid #e2e8f0',
            letterSpacing: '-0.01em',
        },
        jobFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f3f4f6',
            marginTop: 'auto',
        },
        salary: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: '800',
            color: '#111827',
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
        },
        postedTime: {
            fontSize: '0.8rem',
            color: '#6b7280',
            fontWeight: '500',
        },
    };

    const currentStyles = isMobile ? mobileStyles : styles;

    if (isMobile) {
        return (
            <div
                style={currentStyles.linkedInCard}
                onClick={onClick}
            >
                <div style={currentStyles.linkedInCardLeft}>
                    <div style={currentStyles.companyLogo}>
                        <Briefcase size={24} color="#c3002f" />
                    </div>
                </div>
                <div style={currentStyles.linkedInCardCenter}>
                    <h3 style={currentStyles.jobTitleLinkedIn}>{job.title || 'Sin Título'}</h3>
                    <p style={currentStyles.companyNameLinkedIn}>{job.company || 'Nissan Gasme Córdoba'}</p>
                    <div style={currentStyles.jobMetaLinkedIn}>
                        <span style={currentStyles.jobMetaItem}>
                            <MapPin size={14} />
                            {job.location?.replace('Nissan Gasme ', '')}
                        </span>
                        <span style={currentStyles.jobMetaSeparator}>•</span>
                        <span style={currentStyles.jobMetaItem}>{job.work_type || job.type}</span>
                    </div>
                    <div style={currentStyles.salaryBadge}>
                        <DollarSign size={14} />
                        <span>{job.salary_range || job.salary}</span>
                    </div>
                </div>
                <div style={currentStyles.linkedInCardRight}>
                    <button
                        style={currentStyles.saveButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSave(job.id);
                        }}
                    >
                        <Bookmark
                            size={20}
                            color={isSaved ? "#c3002f" : "#9ca3af"}
                            fill={isSaved ? "#c3002f" : "none"}
                        />
                    </button>
                    <span style={currentStyles.postedTimeLinkedIn}>
                        {/* Simple logic for "Hace X tiempo" if original string present, otherwise format date */}
                        {job.postedTime ? job.postedTime.replace('Hace ', '') : new Date(job.posted_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        );
    }

    // Desktop Render
    return (
        <div
            className="animate-fade-in job-card-desktop"
            style={{
                ...styles.jobCard,
                ...(isSelected ? styles.jobCardActive : {})
            }}
            onClick={onClick}
        >
            <div style={styles.jobCardHeader}>
                <div style={styles.jobIconWrapper}>
                    <Briefcase size={24} color="#c3002f" />
                </div>
                <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>{job.title || 'Sin Título'}</h3>
                    <p style={styles.jobCompany}>{job.company || 'Nissan Gasme Córdoba'}</p>
                    <p style={styles.jobLocation}>{job.location || 'Córdoba, Veracruz'}</p>
                </div>
                <button
                    className="btn-hover"
                    style={styles.iconButton}
                    onClick={(e) => { e.stopPropagation(); onShare(); }}
                >
                    <Share2 size={18} color="#6b7280" />
                </button>
            </div>

            <div style={styles.jobTags}>
                <span style={styles.tag}>{job.work_type || job.type}</span>
                <span style={styles.tag}>{job.contract_type || job.time}</span>
                <span style={styles.tag}>{job.experience_level || job.experience}</span>
            </div>

            <div style={styles.jobFooter}>
                <span style={styles.salary}>
                    <DollarSign size={16} />
                    {job.salary_range || job.salary}
                </span>
                <span style={styles.postedTime}>
                    {job.postedTime || new Date(job.posted_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default JobCard;
