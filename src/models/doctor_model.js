const db = require('../config/db');

exports.getById = async (id) => {
    const query = `
        SELECT d.nombre, d.apellido, d.telefono, tg.nombre as tipo_documento, d.identificacion 
        FROM doctor d
        JOIN tipo_general tg ON d.id_tipo_ident = tg.id_tipo
        WHERE d.id_doctor = ?
        AND d.estado = 'activo'
    `;
    const [doctor] = await db.query(query, [id]);
    if (doctor.length === 0) {
        throw new Error('Doctor no encontrado');
    }
    return doctor[0] || null;
}

exports.getAll = async (pagination = {}) => {
    const { page, limit } = pagination;

    const query = `
        SELECT d.id_doctor as id, d.nombre, d.apellido, d.telefono, tg.nombre as tipo_documento, d.identificacion FROM doctor d
        JOIN tipo_general tg on d.id_tipo_ident = tg.id_tipo
        WHERE d.estado = 'activo'
        LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];
    
    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM doctor 
    `;
    const [result] = await db.query(query);
    return result[0].total;
}

exports.create = async (doctorData) => {
    const query = `
        CALL sp_crear_doctor(?, ?, ?, ?, ?)
    `;
    const params = [
        doctorData.nombre,
        doctorData.apellido,
        doctorData.telefono,
        doctorData.id_tipo_ident, // tipo_identificacion -> dni, ce, etc.
        doctorData.identificacion
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if(error.message.includes('Ya existe un doctor con esta identificación')) {
            const customError = new Error(error.message);
            customError.name = 'DuplicateError';
            throw customError; 
        }
        if (error.message.includes('Tipo de identificación no válido')) {
            const customError = new Error(error.message);
            customError.name = 'ValidationError';
            throw customError;
        }
        throw error;
    }
}

exports.update = async (id, updateData) => {
    const  query = `
        CALL sp_actualizar_doctor(?, ?)
    `;
    const params = [
        id,
        updateData.telefono || null
    ]

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if(error.message.includes('Doctor no encontrado')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }
        throw error.sqlMessage;
    }
}

exports.delete = async (id) => {
    const query = `
    CALL sp_inactivar_doctor_completo(?)
    `;
    try {
        const [result] = await db.query(query, [id]);
        return result[0][0];
    } catch (error) {
        if(error.message.includes('Doctor no existe')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }
        throw error;
    }
}

exports.getAtencionesByDoctor = async (doctorId) => {
    const query = `
        SELECT * FROM view_atenciones
        WHERE id_doctor = ?
    `;
    const [result] = await db.query(query, [doctorId]);
    return result;
}

exports.getDoctorByIdentificacion = async (identificacion) => {
    const query = `
        SELECT * FROM doctor WHERE identificacion = ?
    `;
    const [result] = await db.query(query, [identificacion]);
    return result[0] || null;
}