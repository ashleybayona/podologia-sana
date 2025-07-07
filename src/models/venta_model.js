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
        data.id_paciente,
        data.id_tipo_pago,
        data.codigo_operacion,
        JSON.stringify(data.detalles) 
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

/* no le veo funcionalidad
exports.update = async (id, data) => {
    const updatableFields = [
        'id_paciente',
        'id_tipo_pago',
        'codigo_operacion',
        'detalles'
    ];

    const hasAtLeastOneField = updatableFields.some(field => data[field] !== undefined);

    if (!hasAtLeastOneField) {
        const error = new Error('Debe proporcionar al menos un campo para actualizar.');
        error.name = 'ValidationError';
        throw error;
    }

    const query = `CALL sp_actualizar_venta(?, ?, ?, ?)`;
    const params = [
        id,
        data.id_paciente ?? null,
        data.id_tipo_pago ?? null,
        data.codigo_operacion ?? null,
        data.detalles ?? null
    ];

    try {
        const [result] = await db.query(query, params);
        return result[0][0];
    } catch (error) {
        if (error.message.includes('Venta no encontrada')) {
            const customError = new Error(error.message);
            customError.name = 'NotFoundError';
            throw customError;
        }

        throw error;
    }
};
*/