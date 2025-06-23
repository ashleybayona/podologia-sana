const { producto } = require('../middleware/validation');
const model = require('../models/producto_model');

exports.getProductos = async (pagination = {}) => {
    const { page, limit } = pagination;
    const productos = await model.getAll(pagination);
    const total = await model.countAll();
    return {
        data: productos,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_records: total,
            per_page: limit
        }
    }
}

exports.createProducto = async (productoData) => {
    return await model.create(productoData);
}

exports.updateProducto = async (id, productoData) => {
    return await model.update(id, productoData);
}

exports.deleteProducto = async (id) => {
    return await model.delete(id);
}
