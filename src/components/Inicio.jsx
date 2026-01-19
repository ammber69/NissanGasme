import React, { useState } from 'react';
import { Briefcase, Search, Share2, Bookmark, X, MapPin, Clock, DollarSign } from 'lucide-react';
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

const JobPortal = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'recent',
    jobType: [],
    experience: [],
    location: []
  });

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  const filteredJobs = jobsData.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <img src="/gasme.png" alt="Gasme Logo" style={styles.gasmeLogo} />
            <div style={styles.dealershipInfo}>
              <h1 style={styles.dealershipName}>GASME AUTOMOTRIZ</h1>
              <div style={styles.contactInfo}>
                <span>Ventas +52 271 716 6612</span>
                <span>Seminuevos +52 271 284 8254</span>
                <span>Servicio +52 271 716 7586</span>
              </div>
            </div>
          </div>
          <TrackingPostulacion />
        </div>
      </header>

      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <h2 style={styles.heroTitle}></h2>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar Filters */}
        <aside style={styles.sidebar}>
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
        <main style={styles.jobsSection}>
          <div style={styles.searchBar}>
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

          <div style={styles.jobsGrid}>
            {filteredJobs.map(job => (
              <div 
                key={job.id} 
                style={{
                  ...styles.jobCard,
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
                  <button 
                    style={styles.bookmarkButton}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Bookmark size={20} color="#9ca3af" />
                  </button>
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
          <aside style={styles.detailsPanel}>
            <div style={styles.detailsHeader}>
              <div style={styles.detailsHeaderTop}>
                <div style={styles.detailsActions}>
                  <button style={styles.iconButton}>
                    <Share2 size={20} />
                  </button>
                  <button style={styles.iconButton}>
                    <Bookmark size={20} />
                  </button>
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
    borderBottom: '1px solid #e0e0e0',
    padding: '0 2rem 2rem 2rem', // Añadido paddingBottom
    flexShrink: 0,
  },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start', // Cambiado para alinear el contenido arriba
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'flex-start', // Cambiado de 'center' a 'flex-start'
      gap: '1rem',
    },
        gasmeLogo: {
          flexShrink: 0,
          width: '240px',
          height: '180px',
          objectFit: 'contain',
          display: 'block',
          marginTop: '-60px', // Subir el logo aún más
          marginBottom: '-60px', // Ajustar el margen inferior
          marginLeft: '-40px',
        },    dealershipInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      // justifyContent: 'center', // Eliminado
    },  dealershipName: {
    fontSize: '2.5rem', // Aumentado para igualar al heroTitle
    fontWeight: 'bold',
    color: '#000000',
    margin: 0,
    letterSpacing: '0.5px',
    lineHeight: 1.1, // Mejorar el espaciado de línea para texto grande
  },
  contactInfo: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.85rem',
    color: '#666',
  },
  heroBanner: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(/oz2.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '10rem 2rem', // Aumentado el padding para mostrar más de la imagen de fondo
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
  bookmarkButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    flexShrink: 0,
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
    width: '350px',
    flexShrink: 0,
    height: 'fit-content',
    maxHeight: 'calc(100vh - 8rem)',
    position: 'sticky',
    top: '2rem',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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
  },
  detailsLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  detailsValue: {
    fontSize: '0.875rem',
    color: '#111827',
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
};

export default JobPortal;
