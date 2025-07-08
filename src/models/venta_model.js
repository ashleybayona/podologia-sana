const db = require('../config/db');

// Obtener todas las ventas
exports.getAllVentas = async (pagination = {}) => {
    const { page, limit } = pagination;
    const query = `
        SELECT * FROM view_ventas
    `;

    const offset = (page - 1) * limit;
    const queryParams = [limit, offset];

    const [result] = await db.query(query, queryParams);
    return result;
}

exports.countAll = async () => {
    const query = `
        SELECT COUNT(*) as total FROM venta;
    `;
    const [result] = await db.query(query);
    return result[0].total;
}

// Crear venta
exports.create = async (data) => {
    const query = `
        CALL sp_crear_venta_con_detalles(?, ?, ?, ?)
    `;
    const params = [
        data.id_paciente, // identificacion -> luego lo convierte al id
        data.id_tipo_pago, // tipo_pago -> luego lo convierte al id
        data.codigo_operacion,
        JSON.stringify(data.detalles) // json con los productos [{"id_producto": 1, "cantidad": 2}, ...]
    ];

    try {
        const [result] = await db.query(query, params);
        const detalleVenta = result[0].map(item => ({
            ...item,
            precio_unitario: parseFloat(item.precio_unitario),
            subtotal: parseFloat(item.subtotal),
        })); 

        return detalleVenta;
    } catch (error) {
        if (error.message.includes('Venta no encontrada')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }

        throw error;
    }
}

exports.getDetallesVenta = async (id) => {
    const query = `
        SELECT * FROM view_detalle_por_venta 
        WHERE id_venta = ?
    `;

    try {
        const [result] = await db.query(query, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}