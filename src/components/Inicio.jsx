import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Menu, MapPin as Location, Facebook, Instagram, Mail, Filter, Home, FileText, ChevronDown } from 'lucide-react';
import Registro from './Registro';
import TrackingPostulacion from './Estados';
import JobCard from './JobCard';
import JobDetail from './JobDetail';
import { fetchJobs, fetchSucursales } from '../api/api';

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
  const [jobs, setJobs] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'recent',
    location: 'Todas las agencias'
  });
  const [contactFeedback, setContactFeedback] = useState('');

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setContactFeedback(`${type} copiado`);
    setTimeout(() => setContactFeedback(''), 2000);
  };

  // Cargar trabajos y agencias al iniciar o cambiar filtros
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsData, agenciasData] = await Promise.all([
          fetchJobs(),
          fetchSucursales()
        ]);
        setJobs(jobsData);
        setAgencias(agenciasData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("No se pudieron cargar las vacantes. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Dependencias vacías para carga inicial, la búsqueda local se hace abajo por ahora

  // Calcular ubicaciones únicas para el filtro basadas en el catálogo de agencias de la BD
  const locations = ['Todas las agencias', ...agencias.map(agencia => agencia.nombre)];

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

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // Filtrado local (mientras se integra full backend filtering)
  let filteredJobs = jobs
    .filter(job => {
      if (filters.location === 'Todas las agencias') {
        return true;
      }
      return job.location && job.location.includes(filters.location);
    })
    .filter(job => {
      const title = job.title || '';
      const location = job.location || '';
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase());
    });

  // Ordenamiento
  const timeToTimestamp = (dateString) => new Date(dateString).getTime();

  if (filters.sortBy === 'recent') {
    filteredJobs.sort((a, b) => timeToTimestamp(b.posted_at || b.postedTime) - timeToTimestamp(a.posted_at || a.postedTime));
  } else if (filters.sortBy === 'alpha') {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
  }

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
      {/* Header */}
      {/* Header */}
      {!isMobile ? (
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerBrand}>
              <img src="/logo-sucursal.png" alt="Gasme Logo" style={styles.gasmeLogo} />
              <div style={styles.dealershipInfo}>
                <h1 style={styles.dealershipName}>GASME AUTOMOTRIZ</h1>
              </div>
            </div>
            <div style={styles.headerRight}>
              <TrackingPostulacion />
            </div>
          </div>
        </header>
      ) : (
        <div style={mobileStyles.headerMobileWrapper}>
          <div style={mobileStyles.headerTopRow}>
            <img src="/logo-sucursal.png" alt="Gasme Logo" style={mobileStyles.gasmeLogo} />
            <h1 style={mobileStyles.dealershipName}>GASME</h1>
          </div>
          <div style={mobileStyles.searchContainer}>
            <div style={mobileStyles.searchBar}>
              <Search size={20} color="#9ca3af" />
              <input
                type="text"
                placeholder="Buscar empleos..."
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

      {/* Hero Banner - Solo Desktop */}
      {!isMobile && (
        <div style={getStyle('heroBanner')}>
          <h2 style={getStyle('heroTitle')}></h2>
        </div>
      )}

      {/* Main Content */}
      <div style={getStyle('mainContent')}>
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
              <button
                style={{ ...styles.searchButton, backgroundColor: '#f3f4f6', color: '#c3002f', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => setShowFilters(true)}
              >
                <Filter size={18} />
                Filtros
              </button>
              <button style={styles.searchButton}>Buscar</button>
            </div>
          )}

          <div style={getStyle('resultsHeader')}>
            <h2 style={getStyle('resultsTitle')}>
              {isMobile ? 'Vacantes disponibles' : 'Resultados de Búsqueda'}
            </h2>
            <span style={styles.resultsCount}>
              {loading ? 'Cargando...' : `${filteredJobs.length} ${isMobile ? 'empleos' : 'Resultados Encontrados'}`}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              Cargando vacantes...
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              {error}
            </div>
          ) : (
            <>
              {/* Jobs Grid */}
              <div style={getStyle('jobsGrid')}>
                {currentJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isMobile={isMobile}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => handleJobClick(job)}
                    onSave={toggleSaveJob}
                    isSaved={savedJobs.includes(job.id)}
                    onShare={handleShare}
                  />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div style={getStyle('pagination')}>
                  {/* ... lógica de paginación simplificada ... */}
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={styles.paginationButton}>Ant</button>
                  <span style={{ margin: '0 1rem' }}>{currentPage} de {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={styles.paginationButton}>Sig</button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Job Details Panel/Modal - Renderizado Condicional */}
        {selectedJob && (
          isMobile ? (
            <JobDetail
              job={selectedJob}
              isMobile={isMobile}
              onClose={closeJobDetails}
              onShare={handleShare}
              showCopiedMessage={showCopiedMessage}
              onSave={toggleSaveJob}
              isSaved={savedJobs.includes(selectedJob.id)}
            />
          ) : (
            <div style={styles.modalOverlay} onClick={closeJobDetails}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <JobDetail
                  job={selectedJob}
                  isMobile={isMobile}
                  onClose={closeJobDetails}
                  onShare={handleShare}
                  showCopiedMessage={showCopiedMessage}
                  onSave={toggleSaveJob}
                  isSaved={savedJobs.includes(selectedJob.id)}
                />
              </div>
            </div>
          )
        )}

        {/* Modal Filtros */}
        {showFilters && (
          <div style={isMobile ? mobileStyles.filtersOverlay : styles.modalOverlay} onClick={() => setShowFilters(false)}>
            <div style={isMobile ? mobileStyles.filtersContent : { ...styles.modalContent, display: 'block', backgroundColor: '#fff', padding: '2rem', height: 'auto', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Filtros</h3>
                <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Ordenar Por</h4>
                <div style={styles.radioGroup}>
                  <label style={mobileStyles.filterOption}>
                    <input type="radio" name="sortGlobal" value="recent" checked={filters.sortBy === 'recent'} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} style={{ width: '20px', height: '20px', accentColor: '#c3002f' }} />
                    <span style={{ fontSize: '1rem' }}>Más Reciente</span>
                  </label>
                  <label style={mobileStyles.filterOption}>
                    <input type="radio" name="sortGlobal" value="alpha" checked={filters.sortBy === 'alpha'} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} style={{ width: '20px', height: '20px', accentColor: '#c3002f' }} />
                    <span style={{ fontSize: '1rem' }}>A-Z</span>
                  </label>
                </div>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterTitle}>Ubicación</h4>
                <div style={{ position: 'relative' }}>
                  <select
                    style={mobileStyles.filterSelect}
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={() => setShowFilters(false)} style={mobileStyles.filtersApplyButton}>
                Ver {filteredJobs.length} Resultados
              </button>
            </div>
          </div>
        )}

        {/* Modal Registro (integrado en JobDetail pero por si acaso se necesita global) */}
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
              ...(activeTab === 'tracking' ? mobileStyles.bottomNavItemActive : {})
            }}
            onClick={() => setShowTrackingModal(true)}
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

      {/* Mobile Contact Menu */}
      {showMobileMenu && isMobile && (
        <div style={mobileStyles.menuOverlay} onClick={() => setShowMobileMenu(false)}>
          <div style={mobileStyles.menuContent} onClick={e => e.stopPropagation()}>
            <h3>Contacto</h3>

            {contactFeedback && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                zIndex: 10,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {contactFeedback}
              </div>
            )}

            <div style={{ ...mobileStyles.contactItem, cursor: 'pointer', active: { opacity: 0.7 } }} onClick={() => handleCopy('+52 271 716 6612', 'Teléfono')}>
              <Phone size={20} />
              <span>+52 271 716 6612</span>
            </div>
            <div style={{ ...mobileStyles.contactItem, cursor: 'pointer' }} onClick={() => handleCopy('ventas.digitales@gasme.mx', 'Correo')}>
              <Mail size={20} />
              <span>ventas.digitales@gasme.mx</span>
            </div>
            <div style={mobileStyles.contactItem}>
              <Location size={20} style={{ minWidth: '20px' }} /> {/* minWidth para evitar que se aplaste con texto largo */}
              <span style={{ fontSize: '0.9rem' }}>Boulevard Córdoba - Fortín Km 334 # 104, Córdoba, Mexico, 94540</span>
            </div>
            <div style={mobileStyles.socialIcons}>
              <a href="https://www.facebook.com/NissanGasmeOficial" target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '50%' }}>
                <Facebook size={32} />
              </a>
              <a href="https://www.instagram.com/nissan_gasme?fbclid=IwY2xjawQAe1BleHRuA2FlbQIxMABicmlkETJHNGdLVFlnZGExRjZHUktIc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHvqLyESEitNzfZ5dnIsyCzfk-jas9rbIq1VU4g6U53l6B3PopraNe-2zmnRy_aem_P_7OVKQAVoW3IVZN2Ees1w" target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: '#fff0f5', borderRadius: '50%' }}>
                <Instagram size={32} />
              </a>
            </div>
            <button style={mobileStyles.closeMenuButton} onClick={() => setShowMobileMenu(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de Seguimiento */}
      <TrackingPostulacion
        showModal={showTrackingModal}
        setShowModal={setShowTrackingModal}
        hideButton={true}
      />

      {/* Footer */}
      {!isMobile && (
        <footer style={getStyle('footer')}>
          <div style={getStyle('footerContent')}>
            <p style={{ textAlign: 'center', color: '#fff' }}>© 2024 GASME Automotriz. Todos los derechos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

// Estilos
const styles = {
  container: {
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dealershipInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  gasmeLogo: {
    height: '60px', /* Reducido de 80px a 60px para verse más sutil */
    width: 'auto',
  },
  dealershipName: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#c3002f', // Mismo color del botón "Ver Mi Postulación"
    letterSpacing: '-0.025em',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  heroBanner: {
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/oz2.png")', // Imagen proporcionada por usuario
    backgroundSize: 'cover', // Ajuste 'cover' para evitar distorsión y reducir zoom artificial
    backgroundPosition: 'center',
    height: '250px', // Aumentar un poco la altura para mejor encuadre
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#333', // Fallback color
  },
  // ... (omitting unchanged lines for brevity in thought process, but will include context in tool call)


  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: '1fr', // Ocupa todo el ancho ahora que no hay sidebar
    gap: '2rem',
    flex: 1,
    width: '100%',
  },
  sidebar: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    height: 'fit-content',
    border: '1px solid #e5e7eb',
    position: 'sticky',
    top: '100px',
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.75rem',
  },
  filterSection: {
    marginBottom: '2rem',
  },
  filterTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#4b5563',
    cursor: 'pointer',
  },
  dropdownButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#374151',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 20,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  dropdownItem: {
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  },
  jobsSection: {
    minWidth: 0, // Prevent flex item overflow
  },
  searchBar: {
    backgroundColor: '#ffffff',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb',
  },
  searchInputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 0.5rem',
  },
  searchIcon: {
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#1f2937',
    '::placeholder': { color: '#9ca3af' },
  },
  searchButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '1.5rem',
  },
  resultsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
  },
  resultsCount: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columnas como solicitó el usuario
    gap: '1rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
    gap: '0.5rem',
  },
  paginationButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '4rem 2rem',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  modalContent: {
    backgroundColor: 'transparent',
    width: '90%',
    maxWidth: '800px',
    height: '90vh', // Altura fija estandarizada
    overflow: 'hidden',
    borderRadius: '0.75rem',
    display: 'flex',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

const mobileStyles = {
  // Wrapper principal del header móvil - FIJO y con fondo sólido
  headerMobileWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1.5rem 1.25rem',
  },
  headerTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  gasmeLogo: {
    height: '32px', /* Reducido de 40px a 32px para vista móvil */
    width: 'auto',
  },
  dealershipName: {
    fontSize: '1.4rem',
    fontWeight: '900',
    letterSpacing: '-0.025em',
    color: '#c3002f',
    margin: 0,
    textTransform: 'uppercase',
  },
  searchContainer: {
    width: '100%',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '50px', // Full pill
    padding: '0.6rem 1.25rem',
    border: '1px solid #e5e7eb',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    flex: 1,
    marginLeft: '0.75rem',
    fontSize: '0.95rem',
    color: '#1f2937',
    fontWeight: '500',
  },
  filterIconButton: {
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    color: '#c3002f',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  mainContent: {
    margin: 0,
    // Aumentar padding top para compensar el header fijo (aprox 130px)
    padding: '140px 1rem 80px 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    backgroundColor: '#f9fafb', // Fondo general más limpio
    minHeight: '100vh',
  },
  jobsSection: {
    padding: 0,
  },
  resultsHeader: {
    padding: '0 0 1rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  resultsTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #f3f4f6', // Borde más sutil
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom)) 1rem',
    zIndex: 100,
    boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.03)', // Sombra más suave
  },
  bottomNavItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem',
    color: '#9ca3af',
    gap: '0.25rem',
    transition: 'color 0.2s',
  },
  bottomNavItemActive: {
    color: '#c3002f',
  },
  bottomNavLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  filtersOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filtersContent: {
    backgroundColor: '#fff',
    width: '100%',
    padding: '2rem 1.5rem',
    borderTopLeftRadius: '1.5rem',
    borderTopRightRadius: '1.5rem',
    boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    marginBottom: '0.5rem',
  },
  filterSelect: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '0.75rem',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    color: '#374151',
    appearance: 'none',
  },
  filtersApplyButton: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#c3002f',
    color: '#ffffff',
    borderRadius: '0.75rem',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    width: '100%',
    boxShadow: '0 4px 6px -1px rgba(195, 0, 47, 0.3)',
  },
  jobsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  menuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  menuContent: {
    backgroundColor: '#fff',
    padding: '2.5rem 1.5rem',
    borderRadius: '1.5rem',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f3f4f6',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '1rem 0',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '1rem',
    color: '#374151',
    fontWeight: '500',
    border: '1px solid #e5e7eb',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '2rem',
    color: '#4b5563',
    padding: '1rem 0',
    borderTop: '1px solid #f3f4f6',
    borderBottom: '1px solid #f3f4f6',
  },
  closeMenuButton: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#1f2937',
    border: 'none',
    borderRadius: '1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    width: '100%',
    fontSize: '1rem',
    boxShadow: '0 4px 6px -1px rgba(31, 41, 55, 0.3)',
  }
};

export default JobPortal;