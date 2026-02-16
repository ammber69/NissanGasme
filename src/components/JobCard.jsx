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
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid transparent',
            cursor: 'pointer',
            marginBottom: '1rem',
        },
        jobCardActive: {
            borderColor: '#c3002f',
            backgroundColor: '#fff1f2',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(195, 0, 47, 0.1)',
        },
        jobCardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
        },
        jobIconWrapper: {
            width: '48px',
            height: '48px',
            backgroundColor: '#fee2e2',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: '1rem',
        },
        jobInfo: {
            flex: 1,
        },
        jobTitle: {
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.25rem',
            lineHeight: '1.4',
        },
        jobCompany: {
            fontSize: '0.95rem',
            color: '#4b5563',
            fontWeight: '500',
            marginBottom: '0.25rem',
        },
        jobLocation: {
            fontSize: '0.875rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
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
        jobTags: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1rem',
        },
        tag: {
            padding: '0.25rem 0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
        },
        jobFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid #f3f4f6',
        },
        salary: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: '700',
            color: '#1f2937',
            fontSize: '0.95rem',
        },
        postedTime: {
            fontSize: '0.8rem',
            color: '#9ca3af',
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
                    <h3 style={currentStyles.jobTitleLinkedIn}>{job.title}</h3>
                    <p style={currentStyles.companyNameLinkedIn}>{job.company}</p>
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
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.jobCompany}>{job.company}</p>
                    <p style={styles.jobLocation}>{job.location}</p>
                </div>
                <button
                    style={styles.iconButton}
                    onClick={(e) => { e.stopPropagation(); onShare(); }}
                >
                    <Share2 size={20} />
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
