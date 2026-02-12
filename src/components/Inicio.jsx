import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Share2, X, MapPin, Clock, DollarSign, Phone, Menu, Mail, MapPin as Location, Facebook, Instagram, Twitter, Filter, Home, FileText, User, Bookmark, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
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

  const toggleSaveJob = (jobId, e) => {
    e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const filteredJobs = jobsData.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const getStyle = (styleName) => {
    const mobileStyle = mobileStyles[styleName] || {};
    return isMobile ? { ...styles[styleName], ...mobileStyle } : styles[styleName];
  };

  return (
    <div style={getStyle('container')} key={isMobile ? 'mobile' : 'desktop'}>
      {/* Header Mejorado */}
      <header style={getStyle('header')}>
        <div style={getStyle('headerContent')}>
          {!isMobile ? (
            // Desktop Header
            <>
              <div style={getStyle('headerBrand')}>
                <img src="/gasme.png" alt="Gasme Logo" style={getStyle('gasmeLogo')} />
                <div style={styles.dealershipInfo}>
                  <h1 style={styles.dealershipName}>GASME AUTOMOTRIZ</h1>
                </div>
              </div>
              <div style={styles.headerRight}>
                <TrackingPostulacion />
              </div>
            </>
          ) : (
            // Mobile Header - Estilo redes sociales
            <div style={mobileStyles.headerMobileWrapper}>
              <div style={mobileStyles.headerTopRow}>
                <img src="/gasme.png" alt="Gasme Logo" style={mobileStyles.gasmeLogo} />
                <h1 style={mobileStyles.dealershipName}>GASME</h1>
              </div>
              <div style={mobileStyles.searchContainer}>
                <div style={mobileStyles.searchBar}>
                  <Search size={20} color="#9ca3af" />
                  <input 
                    type="text" 
                    placeholder="Buscar empleos, ubicaciones..." 
                    style={mobileStyles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button 
                    style={mobileStyles.filterIconButton}
                    onClick={() => setShowFilters(true)}
                  >
                    <Filter size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Banner - Solo Desktop */}
      {!isMobile && (
        <div style={getStyle('heroBanner')}>
          <h2 style={getStyle('heroTitle')}></h2>
        </div>
      )}

      {/* Main Content */}
      <div style={getStyle('mainContent')}>
        {/* Sidebar Filters - Desktop */}
        {!isMobile && (
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
        )}

        {/* Jobs List */}
        <main style={getStyle('jobsSection')}>
          {/* Search Bar - Desktop */}
          {!isMobile && (
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
          )}

          <div style={getStyle('resultsHeader')}>
            <h2 style={getStyle('resultsTitle')}>
              {isMobile ? 'Vacantes disponibles' : 'Resultados de Búsqueda'}
            </h2>
            <span style={styles.resultsCount}>
              {filteredJobs.length} {isMobile ? 'empleos' : 'Resultados Encontrados'}
            </span>
          </div>

          {/* Jobs Grid - Tarjetas tipo LinkedIn en móvil */}
          <div style={getStyle('jobsGrid')}>
            {currentJobs.map(job => (
              <div 
                key={job.id} 
                style={{
                  ...getStyle('jobCard'),
                  ...(selectedJob?.id === job.id && !isMobile ? styles.jobCardActive : {})
                }}
                onClick={() => handleJobClick(job)}
              >
                {isMobile ? (
                  // Tarjeta tipo LinkedIn - Mobile
                  <>
                    <div style={mobileStyles.linkedInCard}>
                      <div style={mobileStyles.linkedInCardLeft}>
                        <div style={mobileStyles.companyLogo}>
                          <Briefcase size={24} color="#c3002f" />
                        </div>
                      </div>
                      <div style={mobileStyles.linkedInCardCenter}>
                        <h3 style={mobileStyles.jobTitleLinkedIn}>{job.title}</h3>
                        <p style={mobileStyles.companyNameLinkedIn}>{job.company}</p>
                        <div style={mobileStyles.jobMetaLinkedIn}>
                          <span style={mobileStyles.jobMetaItem}>
                            <MapPin size={14} />
                            {job.location.replace('Nissan Gasme ', '')}
                          </span>
                          <span style={mobileStyles.jobMetaSeparator}>•</span>
                          <span style={mobileStyles.jobMetaItem}>{job.time.replace('Tiempo ', '')}</span>
                        </div>
                        <div style={mobileStyles.salaryBadge}>
                          <DollarSign size={14} />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <div style={mobileStyles.linkedInCardRight}>
                        <button 
                          style={mobileStyles.saveButton}
                          onClick={(e) => toggleSaveJob(job.id, e)}
                        >
                          <Bookmark 
                            size={20} 
                            color={savedJobs.includes(job.id) ? "#c3002f" : "#9ca3af"}
                            fill={savedJobs.includes(job.id) ? "#c3002f" : "none"}
                          />
                        </button>
                        <span style={mobileStyles.postedTimeLinkedIn}>{job.postedTime.replace('Hace ', '')}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  // Desktop Card
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div style={getStyle('pagination')}>
              <button 
                style={{
                  ...getStyle('paginationButton'),
                  ...(currentPage === 1 ? mobileStyles.paginationButtonDisabled : {})
                }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={isMobile ? 18 : 20} />
                {!isMobile && <span>Anterior</span>}
              </button>
              
              {isMobile ? (
                <span style={mobileStyles.paginationInfo}>
                  {currentPage} de {totalPages}
                </span>
              ) : (
                <div style={styles.paginationNumbers}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      style={{
                        ...styles.paginationNumber,
                        ...(currentPage === i + 1 ? styles.paginationNumberActive : {})
                      }}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}

              <button 
                style={{
                  ...getStyle('paginationButton'),
                  ...(currentPage === totalPages ? mobileStyles.paginationButtonDisabled : {})
                }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {!isMobile && <span>Siguiente</span>}
                <ChevronRight size={isMobile ? 18 : 20} />
              </button>
            </div>
          )}
        </main>

        {/* Job Details Panel - Desktop */}
        {selectedJob && !isMobile && (
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

        {/* Job Details Modal - Mobile Full Screen */}
        {selectedJob && isMobile && (
          <div style={mobileStyles.fullScreenModal}>
            <div style={mobileStyles.modalHeader}>
              <button style={mobileStyles.backButton} onClick={closeJobDetails}>
                <ChevronLeft size={24} />
              </button>
              <h2 style={mobileStyles.modalHeaderTitle}>Detalles del empleo</h2>
              <button style={mobileStyles.shareButton} onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>

            <div style={mobileStyles.modalBody}>
              <div style={mobileStyles.jobHeaderFull}>
                <div style={mobileStyles.companyLogoLarge}>
                  <Briefcase size={32} color="#c3002f" />
                </div>
                <h1 style={mobileStyles.jobTitleFull}>{selectedJob.title}</h1>
                <p style={mobileStyles.companyNameFull}>{selectedJob.company}</p>
                <div style={mobileStyles.locationFull}>
                  <MapPin size={16} color="#6b7280" />
                  <span>{selectedJob.location}</span>
                </div>
              </div>

              <div style={mobileStyles.statsRow}>
                <div style={mobileStyles.statItem}>
                  <Clock size={18} color="#c3002f" />
                  <div>
                    <div style={mobileStyles.statLabel}>Tipo</div>
                    <div style={mobileStyles.statValue}>{selectedJob.time}</div>
                  </div>
                </div>
                <div style={mobileStyles.statItem}>
                  <Briefcase size={18} color="#c3002f" />
                  <div>
                    <div style={mobileStyles.statLabel}>Experiencia</div>
                    <div style={mobileStyles.statValue}>{selectedJob.experience}</div>
                  </div>
                </div>
              </div>

              <div style={mobileStyles.salaryCard}>
                <div style={mobileStyles.salaryCardHeader}>
                  <DollarSign size={24} color="#c3002f" />
                  <span style={mobileStyles.salaryCardTitle}>Salario ofrecido</span>
                </div>
                <div style={mobileStyles.salaryAmount}>{selectedJob.salary}</div>
              </div>

              <div style={mobileStyles.descriptionCard}>
                <h3 style={mobileStyles.sectionTitle}>Sobre el puesto</h3>
                <p style={mobileStyles.descriptionText}>{selectedJob.description}</p>
              </div>

              <div style={mobileStyles.metaInfo}>
                <span style={mobileStyles.applicationsText}>
                  {selectedJob.applications}
                </span>
                <span style={mobileStyles.postedText}>
                  Publicado {selectedJob.postedTime.toLowerCase()}
                </span>
              </div>
            </div>

            <div style={mobileStyles.modalFooter}>
              <button 
                style={mobileStyles.applyButtonFull}
                onClick={() => setShowRegistration(true)}
              >
                Aplicar a esta vacante
              </button>
              <button 
                style={mobileStyles.saveButtonFull}
                onClick={(e) => toggleSaveJob(selectedJob.id, e)}
              >
                <Bookmark 
                  size={22} 
                  color={savedJobs.includes(selectedJob.id) ? "#c3002f" : "#ffffff"}
                  fill={savedJobs.includes(selectedJob.id) ? "#c3002f" : "none"}
                />
              </button>
            </div>
          </div>
        )}

        {/* Modal de Filtros - Mobile */}
        {showFilters && isMobile && (
          <div style={mobileStyles.filtersOverlay} onClick={() => setShowFilters(false)}>
            <div style={mobileStyles.filtersContent} onClick={(e) => e.stopPropagation()}>
              <div style={mobileStyles.filtersHeader}>
                <h3 style={mobileStyles.filtersTitle}>Filtros</h3>
                <button style={mobileStyles.filtersClose} onClick={() => setShowFilters(false)}>
                  <X size={24} />
                </button>
              </div>

              <div style={mobileStyles.filtersBody}>
                <div style={mobileStyles.filterSection}>
                  <h4 style={mobileStyles.filterSectionTitle}>Ordenar por</h4>
                  <div style={mobileStyles.filterOptions}>
                    <label style={mobileStyles.filterOption}>
                      <input type="radio" name="sort" defaultChecked />
                      <span>Más reciente</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="radio" name="sort" />
                      <span>Mejor salario</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="radio" name="sort" />
                      <span>A-Z</span>
                    </label>
                  </div>
                </div>

                <div style={mobileStyles.filterSection}>
                  <h4 style={mobileStyles.filterSectionTitle}>Experiencia</h4>
                  <div style={mobileStyles.filterOptions}>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>1-3 años</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>3-5 años</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>5+ años</span>
                    </label>
                  </div>
                </div>

                <div style={mobileStyles.filterSection}>
                  <h4 style={mobileStyles.filterSectionTitle}>Ubicación</h4>
                  <div style={mobileStyles.filterOptions}>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>Orizaba</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>Córdoba</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>Tierra Blanca</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>Tuxtepec</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>Juchitán</span>
                    </label>
                    <label style={mobileStyles.filterOption}>
                      <input type="checkbox" />
                      <span>Salina Cruz</span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={mobileStyles.filtersFooter}>
                <button style={mobileStyles.filtersClearButton} onClick={() => setShowFilters(false)}>
                  Limpiar
                </button>
                <button style={mobileStyles.filtersApplyButton} onClick={() => setShowFilters(false)}>
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Registro */}
        {showRegistration && selectedJob && (
          <Registro 
            job={selectedJob} 
            onClose={() => setShowRegistration(false)} 
          />
        )}
      </div>

      {/* Bottom Navigation - Mobile */}
      {isMobile && (
        <nav style={mobileStyles.bottomNav}>
          <button 
            style={{
              ...mobileStyles.bottomNavItem,
              ...(activeTab === 'home' ? mobileStyles.bottomNavItemActive : {})
            }}
            onClick={() => setActiveTab('home')}
          >
            <Home size={24} />
            <span style={mobileStyles.bottomNavLabel}>Inicio</span>
          </button>
          <button 
            style={{
              ...mobileStyles.bottomNavItem,
              ...(activeTab === 'saved' ? mobileStyles.bottomNavItemActive : {})
            }}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={24} />
            <span style={mobileStyles.bottomNavLabel}>Guardados</span>
            {savedJobs.length > 0 && (
              <span style={mobileStyles.badge}>{savedJobs.length}</span>
            )}
          </button>
          <button 
            style={{
              ...mobileStyles.bottomNavItem,
              ...(activeTab === 'tracking' ? mobileStyles.bottomNavItemActive : {})
            }}
            onClick={() => setActiveTab('tracking')}
          >
            <FileText size={24} />
            <span style={mobileStyles.bottomNavLabel}>Seguimiento</span>
          </button>
          <button 
            style={mobileStyles.bottomNavItem}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Phone size={24} />
            <span style={mobileStyles.bottomNavLabel}>Contacto</span>
          </button>
        </nav>
      )}

      {/* Panel de contacto móvil */}
      {isMobile && showMobileMenu && (
        <div style={mobileStyles.contactOverlay} onClick={() => setShowMobileMenu(false)}>
          <div style={mobileStyles.contactPanel} onClick={(e) => e.stopPropagation()}>
            <div style={mobileStyles.contactPanelHeader}>
              <h3 style={mobileStyles.contactPanelTitle}>Contáctanos</h3>
              <button style={mobileStyles.contactPanelClose} onClick={() => setShowMobileMenu(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={mobileStyles.contactPanelBody}>
              <a href="tel:+522717166612" style={mobileStyles.contactPanelItem}>
                <div style={mobileStyles.contactPanelIcon}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={mobileStyles.contactPanelLabel}>Ventas</div>
                  <div style={mobileStyles.contactPanelNumber}>+52 271 716 6612</div>
                </div>
              </a>
              <a href="tel:+522712848254" style={mobileStyles.contactPanelItem}>
                <div style={mobileStyles.contactPanelIcon}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={mobileStyles.contactPanelLabel}>Seminuevos</div>
                  <div style={mobileStyles.contactPanelNumber}>+52 271 284 8254</div>
                </div>
              </a>
              <a href="tel:+522717167586" style={mobileStyles.contactPanelItem}>
                <div style={mobileStyles.contactPanelIcon}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={mobileStyles.contactPanelLabel}>Servicio</div>
                  <div style={mobileStyles.contactPanelNumber}>+52 271 716 7586</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={getStyle('footer')}>
        {!isMobile ? (
          // Desktop Footer
          <>
            <div style={getStyle('footerContent')}>
              <div style={styles.footerColumn}>
                <img src="/65.png" alt="Gasme Logo" style={styles.footerLogo} />
                <h3 style={styles.footerBrand}>GASME AUTOMOTRIZ</h3>
                <p style={styles.footerDescription}>
                  Tu distribuidor autorizado Nissan de confianza. Ofrecemos vehículos nuevos, 
                  seminuevos y servicio de calidad en toda la región.
                </p>
              </div>

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

              <div style={styles.footerColumn}>
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
          </>
        ) : (
          // Mobile Footer - Simplificado
          <div style={mobileStyles.footerMobile}>
            <div style={mobileStyles.footerMobileContent}>
              <img src="/65.png" alt="Gasme Logo" style={mobileStyles.footerLogoMobile} />
              <h3 style={mobileStyles.footerBrandMobile}>GASME AUTOMOTRIZ</h3>
              <div style={mobileStyles.socialMediaMobile}>
                <a href="#" style={mobileStyles.socialLinkMobile} aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" style={mobileStyles.socialLinkMobile} aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" style={mobileStyles.socialLinkMobile} aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            <div style={mobileStyles.footerBottomMobile}>
              <div style={mobileStyles.footerLinksMobile}>
                <a href="#privacidad" style={mobileStyles.footerLinkMobile}>Privacidad</a>
                <span style={mobileStyles.separatorMobile}>•</span>
                <a href="#terminos" style={mobileStyles.footerLinkMobile}>Términos</a>
              </div>
              <p style={mobileStyles.copyrightMobile}>
                © 2026 Gasme Automotriz
              </p>
            </div>
          </div>
        )}
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
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    paddingBottom: '2rem',
  },
  paginationButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    color: '#111827',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  paginationNumbers: {
    display: 'flex',
    gap: '0.5rem',
  },
  paginationNumber: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    color: '#111827',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  paginationNumberActive: {
    backgroundColor: '#c3002f',
    color: '#ffffff',
    borderColor: '#c3002f',
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
    justifyContent: 'center',
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
  // Header Mobile - Estilo redes sociales
  header: {
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  headerContent: {
    width: '100%',
  },
  headerMobileWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  headerTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  gasmeLogo: {
    width: '45px',
    height: '45px',
    objectFit: 'contain',
  },
  dealershipName: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#000000',
    margin: 0,
    letterSpacing: '0.5px',
  },
  searchContainer: {
    width: '100%',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#f3f4f6',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#111827',
  },
  filterIconButton: {
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    cursor: 'pointer',
    color: '#c3002f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Content Mobile
  mainContent: {
    flexDirection: 'column',
    padding: '0',
    gap: '0',
    paddingBottom: '80px',
  },

  // Results Header
  resultsHeader: {
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f3f4f6',
  },
  resultsTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },

  // Jobs Grid - LinkedIn Style Cards
  jobsGrid: {
    gridTemplateColumns: '1fr',
    gap: '0',
    padding: '0',
  },
  jobCard: {
    padding: '0',
    borderRadius: '0',
    border: 'none',
    borderBottom: '1px solid #e5e7eb',
  },
  linkedInCard: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    alignItems: 'flex-start',
  },
  linkedInCardLeft: {
    flexShrink: 0,
  },
  companyLogo: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedInCardCenter: {
    flex: 1,
    minWidth: 0,
  },
  jobTitleLinkedIn: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.25rem 0',
  },
  companyNameLinkedIn: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0 0 0.5rem 0',
  },
  jobMetaLinkedIn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  jobMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  jobMetaSeparator: {
    color: '#d1d5db',
    fontSize: '0.75rem',
  },
  salaryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#ffe5e9',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#c3002f',
  },
  linkedInCardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
  },
  saveButton: {
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    cursor: 'pointer',
  },
  postedTimeLinkedIn: {
    fontSize: '0.7rem',
    color: '#9ca3af',
  },

  // Paginación Mobile
  pagination: {
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
  },
  paginationButton: {
    padding: '0.75rem',
    minWidth: '44px',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  paginationInfo: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  },

  // Modal Full Screen - Mobile
  fullScreenModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s ease-out',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  shareButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#c3002f',
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem 1rem',
    paddingBottom: '100px',
  },
  jobHeaderFull: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  companyLogoLarge: {
    width: '72px',
    height: '72px',
    backgroundColor: '#f3f4f6',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  jobTitleFull: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  companyNameFull: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '0.75rem',
  },
  locationFull: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    color: '#6b7280',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statItem: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#111827',
  },
  salaryCard: {
    backgroundColor: '#ffe5e9',
    padding: '1.25rem',
    borderRadius: '16px',
    marginBottom: '2rem',
  },
  salaryCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  salaryCardTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#6b7280',
  },
  salaryAmount: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#c3002f',
  },
  descriptionCard: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '1rem',
  },
  descriptionText: {
    fontSize: '0.95rem',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  metaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  applicationsText: {
    fontSize: '0.85rem',
    color: '#1e40af',
    fontWeight: '600',
  },
  postedText: {
    fontSize: '0.85rem',
    color: '#9ca3af',
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
    zIndex: 10,
  },
  applyButtonFull: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#c3002f',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  saveButtonFull: {
    width: '56px',
    height: '56px',
    backgroundColor: '#1f2937',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  // Filters Modal
  filtersOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  },
  filtersContent: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80vh',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease-out',
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0,
  },
  filtersTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  filtersClose: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  filtersBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  },
  filterSection: {
    marginBottom: '1.5rem',
  },
  filterSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.75rem',
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#111827',
    border: '1px solid #e5e7eb',
  },
  filtersFooter: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
    flexShrink: 0,
  },
  filtersClearButton: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    color: '#6b7280',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  filtersApplyButton: {
    flex: 2,
    padding: '0.875rem',
    backgroundColor: '#c3002f',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.5rem 0',
    zIndex: 100,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
  },
  bottomNavItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'color 0.2s',
  },
  bottomNavItemActive: {
    color: '#c3002f',
  },
  bottomNavLabel: {
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: '0.25rem',
    right: '0.5rem',
    backgroundColor: '#c3002f',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: '700',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    minWidth: '18px',
    textAlign: 'center',
  },

  // Contact Panel
  contactOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001,
    animation: 'fadeIn 0.2s ease-out',
  },
  contactPanel: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    animation: 'slideUp 0.3s ease-out',
    maxHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
  },
  contactPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1rem',
    borderBottom: '1px solid #e5e7eb',
  },
  contactPanelTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  contactPanelClose: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  contactPanelBody: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  contactPanelItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  contactPanelIcon: {
    width: '44px',
    height: '44px',
    backgroundColor: '#ffe5e9',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#c3002f',
    flexShrink: 0,
  },
  contactPanelLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  contactPanelNumber: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
  },

  // Footer Mobile - Simplificado
  footerMobile: {
    backgroundColor: '#1f2937',
    padding: '2rem 1rem 6rem',
  },
  footerMobileContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  footerLogoMobile: {
    width: '80px',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '0.5rem',
    borderRadius: '0.5rem',
  },
  footerBrandMobile: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0,
    textAlign: 'center',
  },
  socialMediaMobile: {
    display: 'flex',
    gap: '1rem',
  },
  socialLinkMobile: {
    width: '40px',
    height: '40px',
    backgroundColor: '#374151',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textDecoration: 'none',
  },
  footerBottomMobile: {
    borderTop: '1px solid #374151',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  footerLinksMobile: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  footerLinkMobile: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    textDecoration: 'none',
  },
  separatorMobile: {
    color: '#6b7280',
    fontSize: '0.8rem',
  },
  copyrightMobile: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    margin: 0,
    textAlign: 'center',
  },
};

export default JobPortal;