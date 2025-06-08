const db = require('../config/db');

exports.getAll = async (pagination = {}) => {
    const { page, limit } = pagination;
    
    // cambiar a vista
    const query = `
        SELECT p.id_producto as id, p.nombre, p.descripcion, p.precio_venta, p.stock, tg.nombre as categoria FROM productos p
        JOIN tipo_general tg ON tg.id_tipo = p.id_tipo_categoria
        ORDER BY p.nombre
        LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];
    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM productos
    `;
    const [result] = await db.query(query);
    return result[0].total;
}