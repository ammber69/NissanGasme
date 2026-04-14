import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Share2, X, ChevronLeft, Bookmark, ClipboardList, CheckCircle } from 'lucide-react';
import Registro from './Registro';

const JobDetail = ({ job, isMobile, onClose, onShare, showCopiedMessage }) => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const safeJob = {
        ...job,
        time: job.contract_type || job.time,
        experience: job.experience_level || job.experience,
        salary: job.salary_range || job.salary,
        postedTime: job.postedTime || new Date(job.posted_at).toLocaleDateString()
    };

    const handleSave = () => setIsSaved(!isSaved);

    const s = {
        wrapper: {
            position: 'relative',
            backgroundColor: '#f3f4f6', // Light gray background for contrast
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            textAlign: 'left', // FORCE left alignment for the whole tree
        },
        headerActions: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
            zIndex: 10,
        },
        actionBtn: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            color: '#111827',
        },
        banner: {
            height: '180px',
            width: '100%',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 40%, #c3002f 100%)', // Premium dark to red
            position: 'relative',
            flexShrink: 0,
        },
        scrollArea: {
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '3rem',
        },
        mainCard: {
            maxWidth: '850px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: isMobile ? '1.5rem 1.5rem 0 0' : '1rem', // Round top for mobile, full round for PC if inside container
            padding: isMobile ? '1.5rem' : '3rem', // Bigger on PC
            position: 'relative',
            marginTop: '-50px', // Pull up to overlap banner
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            minHeight: '100%',
        },
        logoFloatingBox: {
            width: '110px',
            height: '110px',
            backgroundColor: '#ffffff',
            borderRadius: '1.2rem',
            border: '6px solid #ffffff',
            boxShadow: '0 8px 15px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '-55px', // Stick out 55px
            left: isMobile ? '1.5rem' : '3rem',
            zIndex: 5,
        },
        titleSection: {
            marginTop: '65px', // Space for the logo above
            marginBottom: '1.25rem',
        },
        jobTitle: {
            fontSize: isMobile ? '1.75rem' : '2.25rem',
            fontWeight: '900',
            color: '#111827',
            lineHeight: 1.2,
            letterSpacing: '-1px',
            margin: '0 0 0.5rem 0',
        },
        subtitleLine: {
            fontSize: '1.05rem',
            color: '#4b5563',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.4rem',
            lineHeight: 1.5,
        },
        dot: { color: '#9ca3af', margin: '0 0.1rem' },
        insightGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '2rem',
        },
        insightRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.05rem',
            color: '#374151',
            fontWeight: '500',
        },
        buttonsCard: {
            display: 'flex',
            gap: '1rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '2rem',
        },
        btnPrimary: {
            backgroundColor: '#c3002f', // Brand core
            color: '#ffffff',
            border: 'none',
            borderRadius: '99px',
            padding: '0.9rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(195,0,47,0.3)',
            flex: isMobile ? 1 : 'unset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        btnSecondary: {
            backgroundColor: 'transparent',
            color: '#c3002f',
            border: '2px solid #c3002f',
            borderRadius: '99px',
            padding: '0.9rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
        },
        sectionTitle: {
            fontSize: '1.35rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '1.25rem',
            marginTop: '2rem',
        },
        textContent: {
            fontSize: '1.05rem',
            lineHeight: '1.7',
            color: '#4b5563',
            whiteSpace: 'pre-wrap',
        }
    };

    const HeaderButtons = () => (
        <div style={s.headerActions}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {showCopiedMessage && <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>¡Enlace copiado!</span>}
                <button style={s.actionBtn} onClick={onShare} className="btn-hover">
                    <Share2 size={20} color="#111827" />
                </button>
            </div>
            <button style={s.actionBtn} onClick={onClose} className="btn-hover">
                {isMobile ? <ChevronLeft size={22} /> : <X size={22} />}
            </button>
        </div>
    );

    return (
        <aside style={s.wrapper}>
            <HeaderButtons />
            <div style={s.banner} />

            <div style={s.scrollArea}>
                <div style={s.mainCard}>
                    {/* Floating Logo */}
                    <div style={s.logoFloatingBox}>
                        <Briefcase size={54} color="#c3002f" />
                    </div>

                    {/* Titles */}
                    <div style={s.titleSection}>
                        <h1 style={s.jobTitle}>{safeJob.title}</h1>
                        <div style={s.subtitleLine}>
                            <span style={{ fontWeight: '700', color: '#111827' }}>{safeJob.company}</span>
                            <span style={s.dot}>•</span>
                            <span>{safeJob.location}</span>
                            <span style={s.dot}>•</span>
                            <span style={{ color: '#059669', fontWeight: '600' }}>{safeJob.postedTime}</span>
                            <span style={s.dot}>•</span>
                            <span style={{ color: '#0a66c2', fontWeight: '600' }}>{safeJob.applications || '+100 solicitudes'}</span>
                        </div>
                    </div>

                    {/* Insights */}
                    <div style={s.insightGrid}>
                        <div style={s.insightRow}>
                            <Briefcase size={26} color="#6b7280" />
                            <span>{safeJob.time} · {safeJob.experience}</span>
                        </div>
                        <div style={s.insightRow}>
                            <ClipboardList size={26} color="#6b7280" />
                            <span>1,001-5,000 empleados · Sector Automotriz</span>
                        </div>
                        <div style={s.insightRow}>
                            <DollarSign size={26} color="#6b7280" />
                            <span>{safeJob.salary}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={s.buttonsCard}>
                        <button style={s.btnPrimary} onClick={() => setShowRegistration(true)} className="btn-hover">
                            Postularse Ahora
                        </button>
                        <button style={s.btnSecondary} onClick={handleSave} className="btn-hover">
                            {isSaved ? <CheckCircle size={22} /> : <Bookmark size={22} />}
                            {isSaved ? "Guardado" : "Guardar"}
                        </button>
                    </div>

                    {/* Description Body */}
                    <div>
                        <h2 style={{ ...s.sectionTitle, marginTop: 0 }}>Acerca del empleo</h2>
                        <div style={s.textContent}>{safeJob.description}</div>

                        {safeJob.requirements && (
                            <>
                                <h2 style={s.sectionTitle}>Requisitos indispensables</h2>
                                <div style={s.textContent}>{safeJob.requirements}</div>
                            </>
                        )}

                        {safeJob.benefits && (
                            <>
                                <h2 style={s.sectionTitle}>Beneficios corporativos</h2>
                                <div style={s.textContent}>{safeJob.benefits}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showRegistration && (
                <Registro job={safeJob} onClose={() => setShowRegistration(false)} />
            )}
        </aside>
    );
};

export default JobDetail;
