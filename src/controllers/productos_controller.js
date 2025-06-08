const service = require('../services/producto_service');
const respuesta = require('../util/respuestas');

// Obtener todos los productos con filtros
exports.getProductos = async (req, res) => {
    try {
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 100
        };
        
        const productos = await service.getProductos(pagination);
        respuesta.success(req, res, productos);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Obtener producto por id

// Agregar producto

// Update producto