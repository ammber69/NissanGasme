const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
        const isFormData = applicationData instanceof FormData;
        const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
        const body = isFormData ? applicationData : JSON.stringify(applicationData);

        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) throw new Error('Error submitting application');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

/**
 * Extrae datos de un archivo CV (PDF)
 */
export const extractCVData = async (file) => {
    try {
        const formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(`${API_URL}/cv/extract`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Error extracting CV data');
        return await response.json();
    } catch (error) {
        console.error("Error extraction:", error);
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
