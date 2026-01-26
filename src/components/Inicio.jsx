import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Share2, X, MapPin, Clock, DollarSign, Phone, Menu, Mail, MapPin as Location, Facebook, Instagram, Twitter } from 'lucide-react';
import Registro from './Registro';
import TrackingPostulacion from './Estados';

// Datos de ejemplo actualizados
const jobsData = [
  {
    id: 1,
    title: 'Contador',
    company: 'Nissan Gasme',
    location: 'Nissan Gasme Orizaba',
    type: 'Presencial',
    time: 'Tiempo Completo',
    experience: '3+ años',
    salary: '15,000 - 18,000/mes',
    postedTime: 'Hace 2 días',
    applications: '15 Aplicaciones',
    description: 'Buscamos un Contador con experiencia para llevar la contabilidad general, impuestos y nóminas de la sucursal.'
  },
  {
    id: 2,
    title: 'Mecánico',
    company: 'Nissan Gasme',
    location: 'Nissan Gasme Córdoba',
    type: 'Presencial',
    time: 'Tiempo Completo',
    experience: '2+ años',
    salary: '12,000 - 15,000/mes',
    postedTime: 'Hace 1 día',
    applications: '8 Aplicaciones',
    description: 'Se solicita Mecánico Automotriz para mantenimiento preventivo y correctivo de unidades Nissan. Experiencia necesaria.'
  },
  {
    id: 3,
    title: 'ING Sistemas',
    company: 'Nissan Gasme',
    location: 'Nissan Gasme Tierra Blanca',
    type: 'Presencial',
    time: 'Tiempo Completo',
    experience: '1+ años',
    salary: '18,000 - 22,000/mes',
    postedTime: 'Hace 5 horas',
    applications: '5 Aplicaciones',
    description: 'Encargado de soporte técnico, redes y mantenimiento de equipos de cómputo en la agencia.'
  },
  {
    id: 4,
    title: 'Mercadólogo',
    company: 'Nissan Gasme',
    location: 'Nissan Gasme Tuxtepec',
    type: 'Presencial',
    time: 'Tiempo Completo',
    experience: '2+ años',
    salary: '14,000 - 17,000/mes',
    postedTime: 'Hace 3 días',
    applications: '12 Aplicaciones',
    description: 'Responsable de estrategias de marketing, redes sociales y campañas publicitarias para incrementar ventas.'
  },
  {
    id: 5,
    title: 'Vendedor',
    company: 'Nissan Gasme',
    location: 'Nissan Gasme Juchitán',
    type: 'Presencial',
    time: 'Tiempo Completo',
    experience: '1+ años',
    salary: 'Comisiones + Base',
    postedTime: 'Hace 1 semana',
    applications: '20 Aplicaciones',
    description: 'Asesor de ventas de autos nuevos y seminuevos. Gusto por las ventas y atención al cliente.'
  },
  {
    id: 6,
    title: 'Mecánico',
    company: 'Nissan Gasme',
    location: 'Nissan Gasme Salina Cruz',
    type: 'Presencial',
    time: 'Tiempo Completo',
    experience: '3+ años',
    salary: '13,000 - 16,000/mes',
    postedTime: 'Hace 4 horas',
    applications: '10 Aplicaciones',
    description: 'Mecánico especialista en diagnóstico y reparación de motores. Certificaciones deseables.'
  }
];

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

const JobPortal = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'recent',
    jobType: [],
    experience: [],
    location: []
  });

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 2000);
  };

  const filteredJobs = jobsData.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStyle = (styleName) => {
    const mobileStyle = mobileStyles[styleName] || {};
    return isMobile ? { ...styles[styleName], ...mobileStyle } : styles[styleName];
  };

  return (
    <div style={getStyle('container')} key={isMobile ? 'mobile' : 'desktop'}>
      {/* Header Mejorado */}
      <header style={getStyle('header')}>
        <div style={getStyle('headerContent')}>
          {/* Logo y Nombre */}
          <div style={getStyle('headerBrand')}>
            <img src="/gasme.png" alt="Gasme Logo" style={getStyle('gasmeLogo')} />
            {!isMobile && (
              <div style={styles.dealershipInfo}>
                <h1 style={styles.dealershipName}>GASME AUTOMOTRIZ</h1>
              </div>
            )}
            {isMobile && (
              <div style={getStyle('dealershipInfo')}>
                <h1 style={getStyle('dealershipName')}>GASME AUTOMOTRIZ</h1>
              </div>
            )}
          </div>

          {/* Tracking - Desktop */}
          {!isMobile && (
            <div style={styles.headerRight}>
              <TrackingPostulacion />
            </div>
          )}

          {/* Botón Tracking - Mobile */}
          {isMobile && (
            <div style={mobileStyles.mobileTrackingButton}>
              <TrackingPostulacion />
            </div>
          )}
        </div>
      </header>

      {/* Botón flotante de contacto - Solo móvil */}
      {isMobile && (
        <>
          <button 
            style={mobileStyles.mobileContactToggle}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Contacto"
          >
            <Phone size={24} />
          </button>

          {showMobileMenu && (
            <div style={mobileStyles.mobileContactPanel}>
              <div style={mobileStyles.mobileContactHeader}>
                Contáctanos
              </div>
              <div style={mobileStyles.mobileContactContent}>
                <div style={mobileStyles.mobileContactItem}>
                  <Phone size={20} color="#c3002f" />
                  <div>
                    <div style={mobileStyles.mobileContactLabel}>Ventas</div>
                    <a href="tel:+522717166612" style={mobileStyles.mobileContactNumber}>
                      +52 271 716 6612
                    </a>
                  </div>
                </div>
                <div style={mobileStyles.mobileContactItem}>
                  <Phone size={20} color="#c3002f" />
                  <div>
                    <div style={mobileStyles.mobileContactLabel}>Seminuevos</div>
                    <a href="tel:+522712848254" style={mobileStyles.mobileContactNumber}>
                      +52 271 284 8254
                    </a>
                  </div>
                </div>
                <div style={mobileStyles.mobileContactItem}>
                  <Phone size={20} color="#c3002f" />
                  <div>
                    <div style={mobileStyles.mobileContactLabel}>Servicio</div>
                    <a href="tel:+522717167586" style={mobileStyles.mobileContactNumber}>
                      +52 271 716 7586
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Hero Banner */}
      <div style={getStyle('heroBanner')}>
        <h2 style={getStyle('heroTitle')}></h2>
      </div>

      {/* Main Content */}
      <div style={getStyle('mainContent')}>
        {/* Sidebar Filters */}
        <aside style={getStyle('sidebar')}>
          <h3 style={styles.sidebarTitle}>Filtros</h3>
          
          <div style={styles.filterSection}>
            <h4 style={styles.filterTitle}>Ordenar Por</h4>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input type="radio" name="sort" defaultChecked />
                <span>Más Reciente</span>
              </label>
              <label style={styles.radioLabel}>
                <input type="radio" name="sort" />
                <span>A-Z</span>
              </label>
              <label style={styles.radioLabel}>
                <input type="radio" name="sort" />
                <span>Mejor Salario</span>
              </label>
            </div>
          </div>

          <div style={styles.filterSection}>
            <h4 style={styles.filterTitle}>Salario</h4>
            <div style={styles.inputGroup}>
              <input type="text" placeholder="Min" style={styles.input} />
              <input type="text" placeholder="Max" style={styles.input} />
            </div>
          </div>

          <div style={styles.filterSection}>
            <h4 style={styles.filterTitle}>Experiencia</h4>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>1-3 años</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>3-5 años</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>5+ años</span>
            </label>
          </div>

          <div style={styles.filterSection}>
            <h4 style={styles.filterTitle}>Ubicación</h4>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Nissan Gasme Orizaba</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Nissan Gasme Córdoba</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Nissan Gasme Tierra Blanca</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Nissan Gasme Tuxtepec</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Nissan Gasme Juchitán</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Nissan Gasme Salina Cruz</span>
            </label>
          </div>
        </aside>

        {/* Jobs List */}
        <main style={getStyle('jobsSection')}>
          <div style={getStyle('searchBar')}>
            <div style={styles.searchInputWrapper}>
              <Search size={20} color="#9ca3af" style={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Buscar Empleos o Agencia" 
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button style={styles.searchButton}>Buscar</button>
          </div>

          <div style={styles.resultsHeader}>
            <h2 style={styles.resultsTitle}>Resultados de Búsqueda</h2>
            <span style={styles.resultsCount}>{filteredJobs.length} Resultados Encontrados</span>
          </div>

          <div style={getStyle('jobsGrid')}>
            {filteredJobs.map(job => (
              <div 
                key={job.id} 
                style={{
                  ...getStyle('jobCard'),
                  ...(selectedJob?.id === job.id ? styles.jobCardActive : {})
                }}
                onClick={() => handleJobClick(job)}
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
                  <button style={styles.iconButton} onClick={handleShare}>
                    <Share2 size={20} />
                  </button>
                  {showCopiedMessage && <span style={{color: 'green'}}>¡Copiado!</span>}
                </div>

                <div style={styles.jobTags}>
                  <span style={styles.tag}>{job.type}</span>
                  <span style={styles.tag}>{job.time}</span>
                  <span style={styles.tag}>{job.experience}</span>
                </div>

                <div style={styles.jobFooter}>
                  <span style={styles.salary}>
                    <DollarSign size={16} />
                    {job.salary}
                  </span>
                  <span style={styles.postedTime}>{job.postedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Job Details Panel */}
        {selectedJob && (
          <aside style={getStyle('detailsPanel')}>
            <div style={styles.detailsHeader}>
              <div style={styles.detailsHeaderTop}>
                <div style={styles.detailsActions}>
                  <button style={styles.iconButton} onClick={handleShare}>
                    <Share2 size={20} />
                  </button>
                  {showCopiedMessage && <span style={{color: 'green'}}>¡Copiado!</span>}
                </div>
                <button style={styles.closeButton} onClick={closeJobDetails}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={styles.detailsJobInfo}>
                <div style={styles.detailsIconWrapper}>
                  <Briefcase size={32} color="#c3002f" />
                </div>
                <h2 style={styles.detailsJobTitle}>{selectedJob.title}</h2>
                <p style={styles.detailsCompany}>{selectedJob.company} - {selectedJob.location}</p>
                <span style={styles.applicationsCount}>{selectedJob.applications}</span>
              </div>
            </div>

            <div style={styles.detailsContent}>
              <div style={styles.detailsGrid}>
                <div>
                  <h4 style={styles.detailsLabel}>Tipo de Trabajo</h4>
                  <p style={styles.detailsValue}>{selectedJob.time}</p>
                </div>
                <div>
                  <h4 style={styles.detailsLabel}>Experiencia</h4>
                  <p style={styles.detailsValue}>{selectedJob.experience}</p>
                </div>
                <div>
                  <h4 style={styles.detailsLabel}>Posición</h4>
                  <p style={styles.detailsValue}>{selectedJob.title}</p>
                </div>
                <div>
                  <h4 style={styles.detailsLabel}>Fecha Publicado</h4>
                  <p style={styles.detailsValue}>{selectedJob.postedTime}</p>
                </div>
              </div>

              <div style={styles.descriptionSection}>
                <h4 style={styles.detailsLabel}>Descripción</h4>
                <p style={styles.description}>{selectedJob.description}</p>
              </div>

              <div style={styles.salarySection}>
                <h4 style={styles.detailsLabel}>Salario Base</h4>
                <p style={styles.salaryValue}>{selectedJob.salary}</p>
              </div>

              <button 
                style={styles.applyButton}
                onClick={() => setShowRegistration(true)}
              >
                Aplicar Ahora
              </button>
            </div>
          </aside>
        )}

        {/* Modal de Registro */}
        {showRegistration && selectedJob && (
          <Registro 
            job={selectedJob} 
            onClose={() => setShowRegistration(false)} 
          />
        )}
      </div>

      {/* Footer */}
      <footer style={getStyle('footer')}>
        <div style={getStyle('footerContent')}>
          {/* Columna 1: Logo y descripción */}
          <div style={styles.footerColumn}>
            <img src="/65.png" alt="Gasme Logo" style={styles.footerLogo} />
            <h3 style={styles.footerBrand}>GASME AUTOMOTRIZ</h3>
            <p style={styles.footerDescription}>
              Tu distribuidor autorizado Nissan de confianza. Ofrecemos vehículos nuevos, 
              seminuevos y servicio de calidad en toda la región.
            </p>
          </div>

          {/* Columna 3: Ubicaciones */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>Nuestras Agencias</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <Location size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                Nissan Gasme Orizaba
              </li>
              <li style={styles.footerListItem}>
                <Location size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                Nissan Gasme Córdoba
              </li>
              <li style={styles.footerListItem}>
                <Location size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                Nissan Gasme Tierra Blanca
              </li>
              <li style={styles.footerListItem}>
                <Location size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                Nissan Gasme Tuxtepec
              </li>
              <li style={styles.footerListItem}>
                <Location size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                Nissan Gasme Juchitán
              </li>
              <li style={styles.footerListItem}>
                <Location size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
                Nissan Gasme Salina Cruz
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div style={styles.footerColumn}>
            {!isMobile && (
            <>
              <h4 style={styles.footerTitle}>Contacto</h4>
              <div style={styles.footerContactInfo}>
                <div style={styles.footerContactItem}>
                  <Phone size={16} />
                  <div>
                    <p style={styles.footerContactLabel}>Ventas</p>
                    <a href="tel:+522717166612" style={styles.footerContactLink}>+52 271 716 6612</a>
                  </div>
                </div>
                <div style={styles.footerContactItem}>
                  <Phone size={16} />
                  <div>
                    <p style={styles.footerContactLabel}>Seminuevos</p>
                    <a href="tel:+522712848254" style={styles.footerContactLink}>+52 271 284 8254</a>
                  </div>
                </div>
                <div style={styles.footerContactItem}>
                  <Phone size={16} />
                  <div>
                    <p style={styles.footerContactLabel}>Servicio</p>
                    <a href="tel:+522717167586" style={styles.footerContactLink}>+52 271 716 7586</a>
                  </div>
                </div>
                <div style={styles.footerContactItem}>
                  <Mail size={16} />
                  <div>
                    <p style={styles.footerContactLabel}>Email</p>
                    <a href="mailto:contacto@gasme.com" style={styles.footerContactLink}>contacto@gasme.com</a>
                  </div>
                </div>
              </div>
            </>
            )}

            {/* Redes sociales */}
            <div style={styles.socialMedia}>
              <a href="#" style={styles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" style={styles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" style={styles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={getStyle('footerBottom')}>
          <div style={getStyle('footerLinks')}>
            <a href="#privacidad" style={styles.footerBottomLink}>Política de Privacidad</a>
            <span style={styles.separator}>|</span>
            <a href="#terminos" style={styles.footerBottomLink}>Términos y Condiciones</a>
          </div>
          <p style={styles.copyright}>
            © 2026 Gasme Automotriz. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '2px solid #c3002f',
    padding: '0 2rem 2rem 2rem',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
  },
  gasmeLogo: {
    flexShrink: 0,
    width: '280px',
    height: '220px',
    objectFit: 'contain',
    display: 'block',
    marginTop: '-60px',
    marginBottom: '-60px',
    marginLeft: '-40px',
  },
  dealershipInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  dealershipName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#000000',
    margin: 0,
    letterSpacing: '0.5px',
    lineHeight: 1.1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  contactLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    display: 'block',
  },
  contactNumber: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    display: 'block',
  },
  heroBanner: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(/oz2.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '10rem 2rem',
    textAlign: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    display: 'flex',
    gap: '2rem',
    width: '100%',
    position: 'relative',
  },
  sidebar: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    height: 'fit-content',
    width: '200px',
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#000000',
    textTransform: 'uppercase',
  },
  filterSection: {
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  filterTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#000000',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  },
  jobsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  searchBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  searchInputWrapper: {
    position: 'relative',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },
  searchButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#c3002f',
    border: 'none',
    borderRadius: '0.25rem',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  resultsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#000000',
  },
  resultsCount: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    paddingBottom: '2rem',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
    display: 'flex',
    flexDirection: 'column',
  },
  jobCardActive: {
    borderColor: '#c3002f',
    boxShadow: '0 4px 6px -1px rgba(195, 0, 47, 0.2)',
  },
  jobCardHeader: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    alignItems: 'flex-start',
  },
  jobIconWrapper: {
    width: '48px',
    height: '48px',
    backgroundColor: '#ffe5e9',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  jobInfo: {
    flex: 1,
    minWidth: 0,
  },
  jobTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#000000',
    margin: '0 0 0.25rem 0',
  },
  jobCompany: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0 0 0.25rem 0',
  },
  jobLocation: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: 0,
  },
  jobTags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  tag: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    color: '#6b7280',
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
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  },
  postedTime: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  detailsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    width: '450px',
    height: 'fit-content',
    maxHeight: 'calc(100% - 4rem)',
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  detailsHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0,
  },
  detailsHeaderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  detailsActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    color: '#6b7280',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    color: '#6b7280',
  },
  detailsJobInfo: {
    textAlign: 'center',
  },
  detailsIconWrapper: {
    width: '64px',
    height: '64px',
    backgroundColor: '#ffe5e9',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  detailsJobTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#111827',
  },
  detailsCompany: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  applicationsCount: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  detailsContent: {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    justifyContent: 'center',
  },
  detailsLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  detailsValue: {
    fontSize: '0.875rem',
    color: '#111827',
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: '1.5rem',
  },
  description: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  salarySection: {
    marginBottom: '1.5rem',
  },
  salaryValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
  },
  applyButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#c3002f',
    border: 'none',
    borderRadius: '0.25rem',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  // Footer Styles
  footer: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '3rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerLogo: {
    width: '120px',
    height: 'auto',
    marginBottom: '1rem',
    backgroundColor: '#ffffff',
    padding: '0.5rem',
    borderRadius: '0.5rem',
  },
  footerBrand: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  footerDescription: {
    fontSize: '0.875rem',
    color: '#d1d5db',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#ffffff',
    textAlign: 'center',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  footerListItem: {
    marginBottom: '0.75rem',
    fontSize: '0.875rem',
    color: '#d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Added to center list items
    textAlign: 'center',
  },
  footerLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  footerContactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  footerContactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  footerContactLabel: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: '0 0 0.25rem 0',
  },
  footerContactLink: {
    fontSize: '0.875rem',
    color: '#d1d5db',
    textDecoration: 'none',
    fontWeight: '500',
  },
  socialMedia: {
    display: 'flex',
    gap: '1rem',
  },
  socialLink: {
    width: '36px',
    height: '36px',
    backgroundColor: '#374151',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    padding: '1.5rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyright: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: 0,
  },
  footerLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  footerBottomLink: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    textDecoration: 'none',
  },
  separator: {
    color: '#4b5563',
  },
};

const mobileStyles = {
  header: {
    padding: '1rem',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'column',
    gap: '0',
    alignItems: 'stretch',
  },
  headerBrand: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0',
  },
  gasmeLogo: {
    width: '180px',
    height: '135px',
    margin: '0',
    objectFit: 'contain',
  },
  dealershipInfo: {
    width: '100%',
    alignItems: 'center',
  },
  dealershipName: {
    fontSize: '1.5rem',
    textAlign: 'center',
    letterSpacing: '0.5px',
    margin: '0',
  },
  mobileTrackingButton: {
    width: '100%',
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  mobileContactToggle: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '56px',
    height: '56px',
    backgroundColor: '#c3002f',
    border: 'none',
    borderRadius: '50%',
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(195, 0, 47, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'transform 0.2s',
  },
  mobileContactPanel: {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '280px',
    maxHeight: '400px',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    zIndex: 999,
    animation: 'slideUp 0.3s ease-out',
  },
  mobileContactHeader: {
    padding: '1rem',
    backgroundColor: '#c3002f',
    color: '#ffffff',
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '1rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'center',
  },
  mobileContactContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileContactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    borderLeft: '3px solid #c3002f',
  },
  mobileContactLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  mobileContactNumber: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#111827',
    textDecoration: 'none',
    display: 'block',
  },
  heroBanner: {
    padding: '5rem 1rem',
  },
  heroTitle: {
    fontSize: '1.75rem',
  },
  mainContent: {
    flexDirection: 'column',
    padding: '1rem',
    gap: '1rem',
  },
  sidebar: {
    display: 'none',
  },
  jobsGrid: {
    gridTemplateColumns: '1fr',
  },
  searchBar: {
    flexDirection: 'column',
  },
  detailsPanel: {
    width: 'auto',
    left: '1rem',
    right: '1rem',
    top: '1rem',
    bottom: '1rem',
    maxHeight: 'calc(100% - 2rem)',
  },
  detailsGrid: {
    gridTemplateColumns: '1fr',
  },
  footer: {
    padding: '2rem 1rem',
  },
  footerContent: {
    gridTemplateColumns: '1fr',
    gap: '2rem',
    padding: '2rem 0',
  },
  footerBottom: {
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'column',
  },
};

export default JobPortal;