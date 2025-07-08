const db = require('../config/db');

exports.getAll = async (pagination = {}) => {
    const { page, limit } = pagination;
    
    // cambiar a vista
    const query = `
        SELECT * FROM view_productos
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
        productoData.descripcion || null,
        productoData.precio_venta,
        productoData.stock,
        productoData.id_tipo_categoria, // categoria -> crema, solucion, spray, laca, dispositivo
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

exports.update = async (id, productoData) => {
    const query = `
        CALL sp_actualizar_producto(?, ?, ?, ?, ?, ?)
    `;
    const params = [ 
        id,
        productoData.nombre || null,
        productoData.descripcion || null,
        productoData.precio_venta || null,
        productoData.stock || null,
        productoData.id_tipo_categoria || null, // categoria -> crema, solucion, spray, laca, dispositivo
    ];

    try {
        const [result] = await db.query(query, params);
        const updatedProducto = result[0][0];
        updatedProducto.precio_venta = parseFloat(updatedProducto.precio_venta);
        return updatedProducto;
    } catch (error) {
        throw error;
    }
}

exports.delete = async (id) => {
    const query = `CALL sp_eliminar_producto(?)`;
    try {
        const [result] = await db.query(query, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
}
