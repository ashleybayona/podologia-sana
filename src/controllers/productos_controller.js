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

        respuesta.success(req, res, productos, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Agregar producto
exports.addProducto = async (req, res) => {
    try {
        const productoData = req.body;
        const newProducto = await service.createProducto(productoData);
        console.log(newProducto);
        
        respuesta.success(req, res, {
            message: 'Producto creado exitosamente',
            data: newProducto
        }, 201);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Update producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const productoData = req.body;

        const updatedProducto = await service.updateProducto(id, productoData);

        respuesta.success(req, res, {
            message: 'Producto actualizado exitosamente',
            data: updatedProducto
        }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

// Eliminar producto (cambio de estado a inactivo)
exports.deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteProducto(id);
        respuesta.success(req, res, {
            message: 'Producto eliminado (estado inactivo)',
            id
        }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}
