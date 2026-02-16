const API_URL = 'http://localhost:3001/api';

/**
 * Normaliza los datos de la vacante (BD) al formato esperado por el frontend (Job).
 */
const normalizeJob = (vacante) => {
    if (!vacante) return null;
    return {
        id: vacante.id,
        title: vacante.titulo,
        company: 'Nissan Gasme', // Hardcoded por ahora, o derivar de vacante.area_nombre + 'Nissan Gasme'
        location: vacante.ubicacion || 'Ubicación no especificada',
        description: vacante.descripcion,
        // Mapeo de campos faltantes o diferentes
        type: vacante.modalidad || 'Presencial', // Asumiendo modalidad o default
        time: 'Tiempo Completo', // Default
        experience: vacante.requisitos ? (vacante.requisitos.length > 50 ? 'Ver requisitos' : vacante.requisitos) : 'No especificada', // Usar requisitos como proxy simple
        salary: vacante.salario_esperado || 'Salario Competitivo', // No hay campo salario en vacantes, quizás en beneficios?
        postedTime: vacante.fecha_publicacion ? new Date(vacante.fecha_publicacion).toLocaleDateString() : 'Reciente',
        posted_at: vacante.fecha_publicacion,
        benefits: vacante.beneficios,
        requirements: vacante.requisitos,
        status: vacante.estatus,
        area: vacante.area_nombre
    };
};

/**
 * Obtiene la lista de vacantes activas.
 * Soporta filtros opcionales de búsqueda y ubicación
 */
export const fetchJobs = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.location) params.append('area_id', filters.location);

        // Por defecto traer todas, el backend filtra por estatus=Abierta si no se especifica
        const response = await fetch(`${API_URL}/vacantes?${params.toString()}`);
        if (!response.ok) throw new Error('Error fetching jobs');

        const data = await response.json();
        return data.map(normalizeJob);
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * Obtiene los detalles de una vacante por ID
 */
export const fetchJobById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/vacantes/${id}`);
        if (!response.ok) throw new Error('Job not found');
        const data = await response.json();
        return normalizeJob(data);
    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * Envia una nueva postulación
 */
export const submitApplication = async (applicationData) => {
    try {
        // TODO: Adaptar endpoint en backend para recibir postulaciones en nueva tabla
        const response = await fetch(`${API_URL}/applications`, { // Mantener temporalmente o actualizar a /postulaciones
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData),
        });

        if (!response.ok) throw new Error('Error submitting application');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Consulta el estado de una postulación por código
 */
export const checkApplicationStatus = async (trackingCode) => {
    try {
        const response = await fetch(`${API_URL}/applications/${trackingCode}`);
        if (!response.ok) throw new Error('Application not found');
        return await response.json();
    } catch (error) {
        throw error;
    }
};
