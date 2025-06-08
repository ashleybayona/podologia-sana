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

    const productos = result.map(producto => ({
        ...producto,
        precio_venta: parseFloat(producto.precio_venta),
    }));

    return productos;
}

exports.create = async (productoData) => {
    const query = `
        CALL sp_crear_producto(?, ?, ?, ?, ?)
    `;
    const params = [
        productoData.nombre,
        productoData.descripcion,
        productoData.precio_venta,
        productoData.stock,
        productoData.id_tipo_categoria,
    ];

    try {
        const [result] = await db.query(query, params);
        const newProducto = result[0][0];
        newProducto.precio_venta = parseFloat(newProducto.precio_venta);
        return newProducto;
    } catch (error) {
        throw error;
    }
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM productos
    `;
    const [result] = await db.query(query);
    return result[0].total;
}