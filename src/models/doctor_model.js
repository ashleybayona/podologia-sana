const db = require('../config/db');

exports.getById = async (id) => {
    const query = `
        SELECT d.nombre, d.apellido, d.telefono, tg.nombre as tipo_documento, d.identificacion 
        FROM doctor d
        JOIN tipo_general tg ON d.id_tipo_ident = tg.id_tipo
        WHERE d.id_doctor = ?
    `;
    const [doctor] = await db.query(query, [id]);
    return doctor || null;
}

function buildFilterquery (filters) {
    let whereClause = 'WHERE 1 = 1';
    const params = [];

    if (filters.nombre) {
        whereClause += ' AND (d.nombre LIKE ? OR d.apellido LIKE ?)';
        params.push(`%${filters.nombre}%`, `%${filters.nombre}%`);
    }

    if (filters.telefono) {
        whereClause += ` AND d.telefono LIKE ?`;
        params.push(`%${filters.telefono}%`);
    }
        
    return { whereClause, params };
}

exports.getAll = async (filters = {}, pagination = {}) => {
    const { whereClause, params } = buildFilterquery(filters);
    const { page, limit } = pagination;

    const query = `
        SELECT d.id_doctor as id, d.nombre, d.apellido, d.telefono, tg.nombre as tipo_documento, d.identificacion FROM doctor d
        JOIN tipo_general tg on d.id_tipo_ident = tg.id_tipo
        ${whereClause}
        ORDER BY d.nombre
        LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;
    const queryParams = [...params, limit, offset];
    
    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countWithFilters = async (filters = {}) => {
    const { whereClause, params } = buildFilterquery(filters);

    const query = `
        SELECT COUNT(*) as total FROM doctor d
        ${whereClause}
    `;

    const [result] = await db.query(query, params);
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
        doctorData.id_tipo_ident,
        doctorData.identificacion
    ];
    console.log('Params:', params);

    try {
        const [result] = await db.query(query, params);
        console.log(result);
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
    console.log('Params:', params);

    try {
        console.log('entra try update');
        const [result] = await db.query(query, params);
        console.log(result);
        return result[0][0];
    } catch (error) {
        if(error.message.includes('Doctor no encontrado')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }
        throw error;
    }
}