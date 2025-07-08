const respuesta = require('../util/respuestas');
const service = require('../services/venta_service');

exports.createVenta = async (req, res) => {
    try {
        const ventaData = req.body;
        const newVenta = await service.createVenta(ventaData);
        
        respuesta.success(req, res, newVenta, 201);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            respuesta.error(req, res, error.message, 404);
        } else {
            respuesta.error(req, res, error.message, 500);
        }
    }
}

exports.getVentas = async (req, res) => {
    try {
        const pagination = {
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };
        const result = await service.getVentas(pagination);
        
        respuesta.success(req, res, result, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.getDetallesVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const detalles = await service.getDetallesVenta(id);
        
        respuesta.success(req, res, detalles, 200);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            respuesta.error(req, res, error.message, 404);
        } else {
            respuesta.error(req, res, error.message, 500);
        }
    }
}