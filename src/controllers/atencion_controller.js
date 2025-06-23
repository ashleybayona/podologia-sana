const service = require('../services/atencion_service');
const respuesta = require('../util/respuestas');

exports.addAtencion = async (req, res) => {
    try {
        const nueva = await service.createAtencion(req.body);
        respuesta.success(req, res, { message: 'Atención creada', data: nueva }, 201);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.updateAtencion = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizada = await service.updateAtencion(id, req.body);
        respuesta.success(req, res, { message: 'Atención actualizada', data: actualizada }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}

exports.deleteAtencion = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteAtencion(id);
        respuesta.success(req, res, { message: 'Atención eliminada', id }, 200);
    } catch (error) {
        respuesta.error(req, res, error.message, 500);
    }
}
