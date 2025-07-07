const model = require('../models/venta_model');

exports.createVenta = async (ventaData) => {
    const newVenta = await model.create(ventaData);
    
    if (!newVenta) throw new Error('Error al crear la venta');

    return newVenta;
}

exports.getVentas = async (pagination = {}) => {
    const { page, limit } = pagination;
    const ventas = await model.getAllVentas(pagination);
    const total = await model.countAll();
    
    return {
        data: ventas,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_records: total,
            per_page: limit
        } 
    };
}

exports.getDetallesVenta = async (id) => {
    const detalles = await model.getDetallesVenta(id);
    
    if (!detalles || detalles.length === 0) {
        throw new Error('Detalles de venta no encontrados');
    }

    return detalles;
}