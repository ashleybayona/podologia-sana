const service = require('../services/foto_service');
const respuesta = require('../util/respuestas');

const service = require('../services/foto_service');
const respuesta = require('../util/respuestas');

// Crear foto
exports.addFoto = async (req, res) => {
    try {
        const fotoData = req.body;
        const newFoto = await service.addFoto(fotoData);
        
        respuesta.success(req, res, newFoto, 201);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            respuesta.error(req, res, error.message, 404);
        } else {
            respuesta.error(req, res, error.message, 500);
        }
    }
}

