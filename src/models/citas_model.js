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
    // Validar que al menos un campo haya sido proporcionado
    const allowedFields = [
        'id_tipo_cita',
        'id_paciente',
        'id_consultorio',
        'fecha',
        'hora',
        'motivo',
        'id_tipo_estado',
        'id_doctor'
    ];

    const fieldsToUpdate = allowedFields.filter(field => updatedData[field] !== undefined);

    if (fieldsToUpdate.length === 0) {
        const error = new Error('Debe proporcionar al menos un campo para actualizar.');
        error.name = 'ValidationError';
        throw error;
    }

    const query = `CALL sp_actualizar_cita(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        id,
        updatedData.id_tipo_cita || null,
        updatedData.id_paciente || null,
        updatedData.id_consultorio || null,
        updatedData.fecha || null,
        updatedData.hora || null,
        updatedData.motivo || null,
        updatedData.id_tipo_estado || null,
        updatedData.id_doctor || null
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
    const query = `
        CALL sp_crear_cita(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        citaData.id_tipo_cita, // tipo_cita -> domicilio, consultorio
        citaData.id_paciente, // ident_paciente -> luego se convierte
        citaData.id_consultorio || null, // consultorio,  null si es a domicilio
        citaData.direccion || null, // si es q el tipo es 'domicilio',null si es consultorio
        citaData.fecha,
        citaData.hora,
        citaData.motivo || null,
        citaData.id_doctor // ident_doctor -> luego se convierte
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0]; 
    } catch (error) {
        if (error.message.includes('Cita duplicada')) {
            const customError = new Error(error.message);
            customError.name = 'DuplicateError';
            throw customError;
        }

        throw error;
    }
};

exports.ifExists = async (id) => {
    const query = `
        SELECT COUNT(*) as total FROM cita WHERE id_cita = ?
    `;
    const [result] = await db.query(query, [id]);
    return result[0].total > 0;
};
