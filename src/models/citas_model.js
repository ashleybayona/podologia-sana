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