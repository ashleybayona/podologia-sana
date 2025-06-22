const db = require('../config/db');

exports.getAllCitas = async (pagination = {}) => {
    const { page, limit } = pagination;
    const query = `
        SELECT * FROM view_citas
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];

    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM cita;
    `;
    const [result] = await db.query(query);
    return result[0].total;
}

exports.update = async (id, updatedData) => {
    // Validar que todos los campos requeridos estén presentes
    const requiredFields = [
        'id_tipo_cita',
        'id_paciente',
        'id_consultorio',
        'fecha',
        'hora',
        'motivo',
        'id_tipo_estado',
        'id_doctor'
    ];

    const missingFields = requiredFields.filter(field => updatedData[field] === undefined || updatedData[field] === null);

    if (missingFields.length > 0) {
        const error = new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        error.name = 'ValidationError';
        throw error;
    }

    const query = `
        CALL sp_actualizar_cita(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        id,
        updatedData.id_tipo_cita,
        updatedData.id_paciente,
        updatedData.id_consultorio,
        updatedData.fecha,
        updatedData.hora,
        updatedData.motivo,
        updatedData.id_tipo_estado,
        updatedData.id_doctor
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Cita no encontrada')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }

        throw error;
    }
};

exports.create = async (citaData) => {
    const requiredFields = [
        'id_tipo_cita',
        'id_paciente',
        'id_consultorio',
        'fecha',
        'hora',
        'motivo',
        'id_tipo_estado',
        'id_doctor'
    ];

    const missingFields = requiredFields.filter(field => citaData[field] === undefined || citaData[field] === null);

    if (missingFields.length > 0) {
        const error = new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        error.name = 'ValidationError';
        throw error;
    }

    const query = `
        CALL sp_crear_cita(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        citaData.id_tipo_cita,
        citaData.id_paciente,
        citaData.id_consultorio,
        citaData.fecha,
        citaData.hora,
        citaData.motivo,
        citaData.id_tipo_estado,
        citaData.id_doctor
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0]; // retornamos la cita insertada
    } catch (error) {
        if (error.message.includes('Cita duplicada')) {
            const customError = new Error(error.message);
            customError.name = 'DuplicateError';
            throw customError;
        }

        throw error;
    }
};
