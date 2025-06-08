const db = require('../config/db');

function buildFilterQuery (filters) {
    let whereClause = 'WHERE p.es_paciente_medico = true';
    const params = [];

    if(filters.numero_historia) {
        whereClause += ' AND p.numero_historia = ?';
        params.push(filters.numero_historia);
    }

    if (filters.nombre) {
        whereClause += ' AND (p.nombre LIKE ? OR p.apellido LIKE ?)';
        params.push(`%${filters.nombre}%`, `%${filters.nombre}%`);
    }

    if (filters.telefono) {
        whereClause += ' AND p.telefono LIKE ?';
        params.push(`%${filters.telefono}%`);
    }

    return { whereClause, params };
}

exports.getAllPacientes= async (filters = {}, pagination = {}) => {
    /* 
    filtros 
        - numero_historia
        - nombre / apellido
        - telefono
    */
    const { whereClause, params } = buildFilterQuery(filters);
    const { page, limit } = pagination;

    const query = `
        SELECT p.numero_historia, p.nombre, p.apellido, tg.nombre AS tipo_identificacion, p.identificacion, p.telefono, p.correo, u.distrito, u.departamento, u.provincia, p.direccion, tg2.nombre AS tipo_pie, p.peso, p.altura, p.alergias FROM paciente p
        JOIN tipo_general tg ON p.id_tipo_ident = tg.id_tipo
        JOIN tipo_general tg2 ON p.id_tipo_pie = tg2.id_tipo
        JOIN ubigeo u ON p.id_ubigeo = u.id_ubigeo
        ${whereClause}
        ORDER BY p.numero_historia DESC
        LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;
    const queryParams = [...params, limit, offset];

    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countWithFilters = async (filters = {}) => {
    const { whereClause, params } = buildFilterQuery(filters);

    const query = `
        SELECT COUNT(*) as total FROM paciente p
        ${whereClause}
    `;

    const [result] = await db.query(query, params);
    return result[0].total;
}